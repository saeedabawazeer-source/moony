import { type Product, type Collection, type InsertProduct, type InsertCollection } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Product methods
  getProduct(id: string): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCollection(collection: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Collection methods
  getCollection(id: string): Promise<Collection | undefined>;
  getAllCollections(): Promise<Collection[]>;
  createCollection(collection: InsertCollection): Promise<Collection>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private collections: Map<string, Collection>;

  constructor() {
    this.products = new Map();
    this.collections = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize collections
    const collections: Collection[] = [
      {
        id: "daydream",
        name: "Daydream",
        description: "Elegant coral-themed modest swimwear collection",
        icon: "https://v0-moony.vercel.app/images/starfish-coral.png",
        color: "coral"
      },
      {
        id: "aqua-glow",
        name: "Aqua Glow",
        description: "Refreshing teal-themed modest swimwear collection",
        icon: "https://v0-moony.vercel.app/images/starfish-teal.png",
        color: "teal"
      }
    ];

    collections.forEach(collection => {
      this.collections.set(collection.id, collection);
    });

    // Initialize products
    const products: Product[] = [
      {
        id: "daydream-set",
        name: "Daydream",
        price: "596.25",
        description: "Elegant and modest swimwear designed for comfort and style. Our premium fabric provides UV protection while the beautiful patterns make a statement at the beach or pool.",
        collection: "daydream",
        mainImage: "https://v0-moony.vercel.app/images/daydream-1.jpeg",
        images: [
          "https://v0-moony.vercel.app/images/daydream-1.jpeg",
          "https://v0-moony.vercel.app/images/daydream-2.jpeg",
          "https://v0-moony.vercel.app/images/daydream-3.jpeg",
          "https://v0-moony.vercel.app/images/daydream-4.jpeg"
        ],
        includes: [
          "Top",
          "Leggings", 
          "Short Coverup",
          "Whole Coverup",
          "Turban"
        ],
        highlights: [
          {
            icon: "https://v0-moony.vercel.app/images/starfish-teal.png",
            title: "Premium Design",
            description: "Elegant and modest swimwear designed for the modern woman with full coverage while maintaining a stylish look."
          },
          {
            icon: "https://v0-moony.vercel.app/images/starfish-coral.png",
            title: "Complete Set",
            description: "Includes top, leggings, short coverup, whole coverup, and matching turban for multiple styling options."
          },
          {
            icon: "https://v0-moony.vercel.app/images/starfish-black.png",
            title: "UV Protection",
            description: "UPF 50+ sun protection for all-day wear, keeping you safe from harmful rays."
          },
          {
            icon: "https://v0-moony.vercel.app/images/starfish-teal.png",
            title: "Quick-Drying",
            description: "Premium fabric that dries quickly after swimming for comfort throughout the day."
          },
          {
            icon: "https://v0-moony.vercel.app/images/starfish-coral.png",
            title: "Material",
            description: "80% Polyamide, 20% Elastane for durability, comfort and stretch."
          },
          {
            icon: "https://v0-moony.vercel.app/images/starfish-black.png",
            title: "Care Instructions",
            description: "Hand wash in cold water. Do not bleach. Hang to dry in shade. Rinse after use in chlorinated or salt water."
          },
          {
            icon: "https://v0-moony.vercel.app/images/starfish-teal.png",
            title: "Signature Details",
            description: "Neon accents and Moony starfish branding make this swimwear uniquely stylish."
          },
          {
            icon: "https://v0-moony.vercel.app/images/starfish-coral.png",
            title: "Versatile Styling",
            description: "Multiple ways to wear for different occasions, from swimming to beach lounging."
          }
        ],
        material: "80% Polyamide, 20% Elastane",
        careInstructions: "Hand wash in cold water. Do not bleach. Hang to dry in shade. Rinse after use in chlorinated or salt water.",
        uvProtection: true,
        quickDrying: true,
        sizes: ["S", "M", "L", "XL"],
        inStock: true
      },
      {
        id: "aqua-glow-set",
        name: "Aqua Glow",
        price: "596.25",
        description: "Refreshing teal-themed modest swimwear designed for comfort and elegance. Premium fabric with UV protection and quick-drying technology.",
        collection: "aqua-glow",
        mainImage: "https://v0-moony.vercel.app/images/daydream-1.jpeg",
        images: [
          "https://v0-moony.vercel.app/images/daydream-1.jpeg",
          "https://v0-moony.vercel.app/images/daydream-2.jpeg",
          "https://v0-moony.vercel.app/images/daydream-3.jpeg",
          "https://v0-moony.vercel.app/images/daydream-4.jpeg"
        ],
        includes: [
          "Top",
          "Leggings",
          "Short Coverup", 
          "Whole Coverup",
          "Turban"
        ],
        highlights: [
          {
            icon: "https://v0-moony.vercel.app/images/starfish-teal.png",
            title: "Premium Design",
            description: "Elegant and modest swimwear designed for the modern woman with full coverage while maintaining a stylish look."
          },
          {
            icon: "https://v0-moony.vercel.app/images/starfish-coral.png",
            title: "Complete Set",
            description: "Includes top, leggings, short coverup, whole coverup, and matching turban for multiple styling options."
          },
          {
            icon: "https://v0-moony.vercel.app/images/starfish-black.png",
            title: "UV Protection",
            description: "UPF 50+ sun protection for all-day wear, keeping you safe from harmful rays."
          },
          {
            icon: "https://v0-moony.vercel.app/images/starfish-teal.png",
            title: "Quick-Drying",
            description: "Premium fabric that dries quickly after swimming for comfort throughout the day."
          },
          {
            icon: "https://v0-moony.vercel.app/images/starfish-coral.png",
            title: "Material",
            description: "80% Polyamide, 20% Elastane for durability, comfort and stretch."
          },
          {
            icon: "https://v0-moony.vercel.app/images/starfish-black.png",
            title: "Care Instructions",
            description: "Hand wash in cold water. Do not bleach. Hang to dry in shade. Rinse after use in chlorinated or salt water."
          },
          {
            icon: "https://v0-moony.vercel.app/images/starfish-teal.png",
            title: "Signature Details",
            description: "Neon accents and Moony starfish branding make this swimwear uniquely stylish."
          },
          {
            icon: "https://v0-moony.vercel.app/images/starfish-coral.png",
            title: "Versatile Styling",
            description: "Multiple ways to wear for different occasions, from swimming to beach lounging."
          }
        ],
        material: "80% Polyamide, 20% Elastane",
        careInstructions: "Hand wash in cold water. Do not bleach. Hang to dry in shade. Rinse after use in chlorinated or salt water.",
        uvProtection: true,
        quickDrying: true,
        sizes: ["S", "M", "L", "XL"],
        inStock: true
      }
    ];

    products.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  // Product methods
  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCollection(collection: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.collection === collection
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  // Collection methods
  async getCollection(id: string): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async getAllCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values());
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const id = randomUUID();
    const collection: Collection = { ...insertCollection, id };
    this.collections.set(id, collection);
    return collection;
  }
}

export const storage = new MemStorage();
