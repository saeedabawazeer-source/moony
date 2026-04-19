import { type Product, type Collection, type InsertProduct, type InsertCollection } from "@shared/schema";
import { randomUUID } from "crypto";

// Inventory = { "daydream-set": { "S": 9, "M": 16, ... }, ... }
export type Inventory = Record<string, Record<string, number>>;

export interface IStorage {
  getProduct(id: string): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCollection(collection: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  getCollection(id: string): Promise<Collection | undefined>;
  getAllCollections(): Promise<Collection[]>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  // Inventory
  getInventory(): Promise<Inventory>;
  getProductInventory(productId: string): Promise<Record<string, number> | undefined>;
  decrementStock(productId: string, size: string, qty: number): Promise<{ success: boolean; remaining: number }>;
  setStock(productId: string, size: string, qty: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private collections: Map<string, Collection>;
  private inventory: Inventory;

  constructor() {
    this.products = new Map();
    this.collections = new Map();
    this.inventory = {};
    this.initializeData();
  }

  private initializeData() {
    const collections: Collection[] = [
      {
        id: "daydream",
        name: "Daydream",
        description: "Elegant coral-themed modest swimwear collection",
        icon: "/images/starfish-coral.png",
        color: "coral"
      },
      {
        id: "aqua-glow",
        name: "Aqua Glow",
        description: "Refreshing teal-themed modest swimwear collection",
        icon: "/images/starfish-teal.png",
        color: "teal"
      }
    ];

    collections.forEach(c => this.collections.set(c.id, c));

    const products: Product[] = [
      {
        id: "daydream-set",
        name: "Daydream",
        price: "596.25",
        description: "Elegant and modest swimwear designed for comfort and style.",
        collection: "daydream",
        mainImage: "/images/models/daydream/_HTM3935.JPEG",
        images: [
          "/images/models/daydream/_HTM3935.JPEG",
          "/images/models/daydream/_HTM4121.JPEG",
          "/images/models/daydream/_HTM4179.JPEG",
          "/images/models/daydream/_HTM4610.JPEG"
        ],
        includes: ["Top", "Leggings", "Short Coverup", "Whole Coverup", "Turban"],
        highlights: [
          { icon: "/images/starfish-teal.png", title: "Premium Design", description: "Full coverage with style." },
          { icon: "/images/starfish-coral.png", title: "Complete Set", description: "5 pieces for multiple styling options." },
          { icon: "/images/starfish-black.png", title: "UV Protection", description: "UPF 50+ sun protection." },
          { icon: "/images/starfish-teal.png", title: "Quick-Drying", description: "Premium quick-dry fabric." },
          { icon: "/images/starfish-coral.png", title: "Material", description: "80% Polyamide, 20% Elastane." },
          { icon: "/images/starfish-black.png", title: "Care Instructions", description: "Hand wash cold. No bleach. Shade dry." },
          { icon: "/images/starfish-teal.png", title: "Signature Details", description: "Neon accents and Moony branding." },
          { icon: "/images/starfish-coral.png", title: "Versatile Styling", description: "Multiple ways to wear." }
        ],
        material: "80% Polyamide, 20% Elastane",
        careInstructions: "Hand wash in cold water. Do not bleach. Hang to dry in shade.",
        uvProtection: true,
        quickDrying: true,
        sizes: ["S", "M", "L", "XL"],
        inStock: true
      },
      {
        id: "aqua-glow-set",
        name: "Aqua Glow",
        price: "596.25",
        description: "Refreshing teal-themed modest swimwear for comfort and elegance.",
        collection: "aqua-glow",
        mainImage: "/images/models/aquaglow/_HTM3828.JPEG",
        images: [
          "/images/models/aquaglow/_HTM3828.JPEG",
          "/images/models/aquaglow/_HTM3832.JPEG",
          "/images/models/aquaglow/_HTM3856.JPEG",
          "/images/models/aquaglow/_HTM3883.JPEG"
        ],
        includes: ["Top", "Leggings", "Short Coverup", "Whole Coverup", "Turban"],
        highlights: [
          { icon: "/images/starfish-teal.png", title: "Premium Design", description: "Full coverage with style." },
          { icon: "/images/starfish-coral.png", title: "Complete Set", description: "5 pieces for multiple styling options." },
          { icon: "/images/starfish-black.png", title: "UV Protection", description: "UPF 50+ sun protection." },
          { icon: "/images/starfish-teal.png", title: "Quick-Drying", description: "Premium quick-dry fabric." },
          { icon: "/images/starfish-coral.png", title: "Material", description: "80% Polyamide, 20% Elastane." },
          { icon: "/images/starfish-black.png", title: "Care Instructions", description: "Hand wash cold. No bleach. Shade dry." },
          { icon: "/images/starfish-teal.png", title: "Signature Details", description: "Neon accents and Moony branding." },
          { icon: "/images/starfish-coral.png", title: "Versatile Styling", description: "Multiple ways to wear." }
        ],
        material: "80% Polyamide, 20% Elastane",
        careInstructions: "Hand wash in cold water. Do not bleach. Hang to dry in shade.",
        uvProtection: true,
        quickDrying: true,
        sizes: ["S", "M", "L", "XL"],
        inStock: true
      }
    ];

    products.forEach(p => this.products.set(p.id, p));

    // Initial inventory counts
    this.inventory = {
      "daydream-set": { "S": 9, "M": 16, "L": 18, "XL": 9 },
      "aqua-glow-set": { "S": 8, "M": 13, "L": 17, "XL": 8 }
    };
  }

  async getProduct(id: string): Promise<Product | undefined> { return this.products.get(id); }
  async getAllProducts(): Promise<Product[]> { return Array.from(this.products.values()); }
  async getProductsByCollection(collection: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.collection === collection);
  }
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
  async getCollection(id: string): Promise<Collection | undefined> { return this.collections.get(id); }
  async getAllCollections(): Promise<Collection[]> { return Array.from(this.collections.values()); }
  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const id = randomUUID();
    const collection: Collection = { ...insertCollection, id };
    this.collections.set(id, collection);
    return collection;
  }

  // Inventory methods
  async getInventory(): Promise<Inventory> {
    return JSON.parse(JSON.stringify(this.inventory));
  }

  async getProductInventory(productId: string): Promise<Record<string, number> | undefined> {
    return this.inventory[productId] ? { ...this.inventory[productId] } : undefined;
  }

  async decrementStock(productId: string, size: string, qty: number): Promise<{ success: boolean; remaining: number }> {
    if (!this.inventory[productId] || this.inventory[productId][size] === undefined) {
      return { success: false, remaining: 0 };
    }
    const current = this.inventory[productId][size];
    if (current < qty) {
      return { success: false, remaining: current };
    }
    this.inventory[productId][size] = current - qty;
    console.log(`[INVENTORY] ${productId} ${size}: ${current} -> ${this.inventory[productId][size]}`);
    return { success: true, remaining: this.inventory[productId][size] };
  }

  async setStock(productId: string, size: string, qty: number): Promise<void> {
    if (!this.inventory[productId]) this.inventory[productId] = {};
    this.inventory[productId][size] = qty;
    console.log(`[INVENTORY] SET ${productId} ${size}: ${qty}`);
  }
}

export const storage = new MemStorage();
