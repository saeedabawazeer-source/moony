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
      const { items, customer, origin } = req.body;
      
      let totalAmount = 56.25; // Base shipping
      items.forEach((item: any) => {
        totalAmount += parseFloat(item.price) * item.quantity;
      });

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
        console.error("Tap Error:", data);
        return res.status(500).json({ message: "Payment gateway error", details: data });
      }

      res.json({ url: data.transaction.url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create charge" });
    }
  });

  // --- Tap Webhook (Receives successful payment confirmation) ---
  app.post("/api/webhook/tap", async (req, res) => {
    try {
      const event = req.body;
      
      if (event.status === "CAPTURED" || event.event === "charge.succeeded") {
        const metadata = event.metadata || {};
        const items = JSON.parse(metadata.items || "[]");
        const { customerName, phone, address } = metadata;
        
        for (const item of items) {
          // 1. Deduct the stock
          await storage.decrementStock(item.id, item.size, parseInt(item.qty));

          // 2. Log order to Sheets
          const sheetsUrl = process.env.SHEETS_INVENTORY_URL;
          if (sheetsUrl) {
            await fetch(sheetsUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "addOrder",
                orderId: event.id || `ORD-${Date.now()}`,
                name: customerName || "Unknown",
                email: metadata.email || "N/A",
                phone: phone || "N/A",
                product: item.name,
                size: item.size,
                quantity: item.qty,
                amount: (event.amount / items.length).toFixed(2), // Approximate per-item amount
                status: "PAID"
              })
            });
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

  const httpServer = createServer(app);

  return httpServer;
}
