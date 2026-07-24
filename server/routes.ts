import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Get all collections
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await storage.getAllCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collections" });
    }
  });

  // Get products by collection
  app.get("/api/collections/:collection/products", async (req, res) => {
    try {
      const products = await storage.getProductsByCollection(req.params.collection);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products for collection" });
    }
  });

  // Create Tap Payment Charge for multiple items (Cart)
  app.post("/api/create-charge-cart", async (req, res) => {
    try {
      const { items, customer, subscribeWhatsapp, origin } = req.body;
      
      let subtotal = 0;
      items.forEach((item: any) => {
        subtotal += parseFloat(item.price) * item.quantity;
      });

      const discount = subscribeWhatsapp ? (subtotal * 0.10) : 0;
      const totalAmount = subtotal - discount; // Apply discount, free shipping

      const payload = {
        amount: totalAmount,
        currency: "SAR",
        customer: {
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: customer.email || `${customer.phone}@moony.com`,
          phone: {
            country_code: "966",
            number: customer.phone.replace(/[^0-9]/g, "").slice(-9) || "555555555"
          }
        },
        source: { id: "src_all" },
        redirect: { url: `${origin}/success` },
        post: { url: `${origin}/api/webhook/tap` },
        metadata: {
          items: JSON.stringify(items.map((i: any) => ({
            id: i.productId,
            name: i.productName,
            size: i.size,
            qty: i.quantity
          }))),
          customerName: `${customer.firstName} ${customer.lastName}`,
          phone: customer.phone,
          address: customer.address
        }
      };

      const tapRes = await fetch("https://api.tap.company/v2/charges", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.TAP_SECRET_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await tapRes.json();
      
      if (!tapRes.ok) {
        console.error("[TAP] Error response:", JSON.stringify(data));
        const errObj = data.errors?.[0];
        const errorMessage = errObj ? `Error ${errObj.code}: ${errObj.description}` : "Payment gateway error";
        return res.status(500).json({ message: errorMessage, details: data });
      }

      const paymentUrl = data.transaction?.url;
      console.log("[TAP] Charge created:", data.id, "URL:", paymentUrl);
      
      if (!paymentUrl) {
        console.error("[TAP] No transaction URL in response:", JSON.stringify(data));
        return res.status(500).json({ message: "Payment gateway did not return a checkout URL" });
      }

      res.json({ url: paymentUrl });
    } catch (error) {
      console.error("[TAP] Exception:", error);
      res.status(500).json({ message: "Failed to create charge" });
    }
  });
  // Verify Tap Charge Status
  app.get("/api/verify-charge/:charge_id", async (req, res) => {
    try {
      const tapRes = await fetch(`https://api.tap.company/v2/charges/${req.params.charge_id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.TAP_SECRET_KEY}`,
          "Accept": "application/json"
        }
      });
      const data = await tapRes.json();
      res.json(data);
    } catch (error) {
      console.error("[TAP] Verify Exception:", error);
      res.status(500).json({ message: "Failed to verify charge" });
    }
  });

  // --- Tap Webhook (Receives successful payment confirmation) ---
  app.post("/api/webhook/tap", async (req, res) => {
    try {
      console.log("[TAP WEBHOOK] Received payload:", JSON.stringify(req.body));
      const payload = req.body;
      const charge = payload.data ? payload.data : payload; // Handle both wrapped event and direct object
      
      if (charge.status === "CAPTURED" || payload.event === "charge.succeeded") {
        const metadata = charge.metadata || {};
        const items = JSON.parse(metadata.items || "[]");
        const { customerName, phone, address } = metadata;
        
        console.log(`[TAP WEBHOOK] Processing ${items.length} items for order ${charge.id}`);

        for (const item of items) {
          // 1. Deduct the stock
          await storage.decrementStock(item.id, item.size, parseInt(item.qty));

          // 2. Log order to Sheets
          const sheetsUrl = process.env.SHEETS_INVENTORY_URL;
          if (sheetsUrl) {
            try {
              console.log("[TAP WEBHOOK] Sending to Google Sheets:", sheetsUrl);
              // Note: Apps Script POST often returns 302, so we need to handle it or just send and forget
              await fetch(sheetsUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  action: "addOrder",
                  orderId: `MNS-${(charge.id || "").slice(-5).toUpperCase()}`,
                  name: customerName || "Unknown",
                  email: metadata.email || "N/A",
                  phone: phone || "N/A",
                  product: item.name,
                  size: item.size,
                  quantity: item.qty,
                  amount: (charge.amount / items.length).toFixed(2), // Approximate per-item amount
                  status: "PAID"
                }),
                redirect: "follow"
              });
              console.log("[TAP WEBHOOK] Successfully sent to Google Sheets");
            } catch (sheetError) {
              console.error("[TAP WEBHOOK] Google Sheets update failed:", sheetError);
            }
          }
        }

        // 3. Send Telegram Notification
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatIdEnv = process.env.TELEGRAM_CHAT_ID;
        
        if (botToken && chatIdEnv) {
          const chatIds = chatIdEnv.split(',').map(id => id.trim()).filter(id => id);
          const moonyOrderId = `MNS-${(charge.id || "").slice(-5).toUpperCase()}`;
          const itemSummary = items.map((i: any) => `${i.qty}x ${i.productName || i.name || 'Product'} (Size: ${i.size})`).join("\n");
          const message = `🎉 *NEW ORDER RECEIVED!*\n\n*Order ID:* \`${moonyOrderId}\`\n*Customer:* ${customerName || 'N/A'}\n*Phone:* ${phone || 'N/A'}\n*Address:* ${address || 'N/A'}\n\n*Items:*\n${itemSummary}\n\n*Total:* ${charge.amount} ${charge.currency}`;
          
          for (const chatId of chatIds) {
            try {
              await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chat_id: chatId,
                  text: message,
                  parse_mode: "Markdown"
                })
              });
              console.log(`[TELEGRAM] Notification sent successfully to ${chatId}!`);
            } catch (err) {
              console.error(`[TELEGRAM] Failed to send to ${chatId}:`, err);
            }
          }
        }
      }
      res.status(200).send("OK");
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).send("Webhook failed");
    }
  });

  // --- Inventory endpoints ---

  // Get all inventory
  app.get("/api/inventory", async (req, res) => {
    try {
      const inventory = await storage.getInventory();
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  // Get inventory for a specific product
  app.get("/api/inventory/:productId", async (req, res) => {
    try {
      const inv = await storage.getProductInventory(req.params.productId);
      if (!inv) return res.status(404).json({ message: "Product not found" });
      res.json(inv);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  // Decrement stock (called after successful order)
  app.post("/api/inventory/decrement", async (req, res) => {
    try {
      const { productId, size, quantity } = req.body;
      if (!productId || !size || !quantity) {
        return res.status(400).json({ message: "productId, size, and quantity are required" });
      }
      const result = await storage.decrementStock(productId, size, quantity);
      if (!result.success) {
        return res.status(409).json({ message: "Insufficient stock", remaining: result.remaining });
      }
      res.json({ success: true, remaining: result.remaining });
    } catch (error) {
      res.status(500).json({ message: "Failed to update inventory" });
    }
  });

  // Set stock (admin override)
  app.post("/api/inventory/set", async (req, res) => {
    try {
      const { productId, size, quantity } = req.body;
      if (!productId || !size || quantity === undefined) {
        return res.status(400).json({ message: "productId, size, and quantity are required" });
      }
      await storage.setStock(productId, size, quantity);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to set inventory" });
    }
  });

  // Get gallery images
  app.get("/api/gallery-images", async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      
      const adsDir = path.join(process.cwd(), "client", "public", "images", "ads");
      if (!fs.existsSync(adsDir)) {
        return res.json({ images: [] });
      }

      const files = fs.readdirSync(adsDir);
      const validPrefixes = [
        "neo_", "lux_", "art_", "strict_", "final_", "baaghil_", "baaghil-", 
        "carousel_", "carousel-", "premium_", "slide-", "static-", "ad1-", "ad2-", "ad3-"
      ];

      const images = files
        .filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i))
        .filter(f => validPrefixes.some(prefix => f.startsWith(prefix)))
        .map(f => `/images/ads/${f}`);

      res.json({ images });
    } catch (error) {
      console.error("[GALLERY] Error:", error);
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
