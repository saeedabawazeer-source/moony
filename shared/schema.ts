import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  collection: text("collection").notNull(),
  mainImage: text("main_image").notNull(),
  images: json("images").$type<string[]>().notNull(),
  includes: json("includes").$type<string[]>().notNull(),
  highlights: json("highlights").$type<{
    icon: string;
    title: string;
    description: string;
  }[]>().notNull(),
  material: text("material").notNull(),
  careInstructions: text("care_instructions").notNull(),
  uvProtection: boolean("uv_protection").default(true),
  quickDrying: boolean("quick_drying").default(true),
  sizes: json("sizes").$type<string[]>().notNull().default(['S', 'M', 'L', 'XL']),
  inStock: boolean("in_stock").default(true),
});

export const collections = pgTable("collections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertCollectionSchema = createInsertSchema(collections).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type Collection = typeof collections.$inferSelect;
