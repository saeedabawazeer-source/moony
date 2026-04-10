import type { Product, Collection } from "@shared/schema";

// Static data for deployment - mirrors the data from server/storage.ts
export const collections: Collection[] = [
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

export const products: Product[] = [
  {
    id: "daydream-set",
    name: "Daydream",
    price: "159.00",
    description: "Elegant and modest swimwear designed for comfort and style. Our premium fabric provides UV protection while the beautiful patterns make a statement at the beach or pool.",
    collection: "daydream",
    mainImage: "/images/models/daydream/_HTM3935.JPEG",
    images: [
      "/images/models/daydream/_HTM3935.JPEG",
      "/images/models/daydream/_HTM4121.JPEG",
      "/images/models/daydream/_HTM4179.JPEG",
      "/images/models/daydream/_HTM4610.JPEG"
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
    price: "159.00",
    description: "Refreshing teal-themed modest swimwear designed for comfort and elegance. Premium fabric with UV protection and quick-drying technology.",
    collection: "aqua-glow",
    mainImage: "/images/models/aquaglow/_HTM3828.JPEG",
    images: [
      "/images/models/aquaglow/_HTM3828.JPEG",
      "/images/models/aquaglow/_HTM3832.JPEG",
      "/images/models/aquaglow/_HTM3856.JPEG",
      "/images/models/aquaglow/_HTM3883.JPEG"
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
