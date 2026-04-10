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

  // Create Tap Payment Charge
  app.post("/api/create-charge", async (req, res) => {
    try {
      const { product, quantity, customer, origin } = req.body;
      const dbProduct = await storage.getProduct(product);
      
      if (!dbProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      const amount = (parseFloat(dbProduct.price) * quantity) + 56.25; // 56.25 is shipping in SAR
      
      const payload = {
        amount,
        currency: "SAR",
        customer: {
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: customer.email,
          phone: {
            country_code: "966",
            number: customer.phone.replace(/[^0-9]/g, "").slice(-9) || "555555555" // basic fallback formatting
          }
        },
        source: { id: "src_all" },
        redirect: { url: `${origin}/success` }
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

  const httpServer = createServer(app);

  return httpServer;
}
