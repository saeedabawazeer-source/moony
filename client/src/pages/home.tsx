import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductGallery from "@/components/product/product-gallery";
import ProductInfo from "@/components/product/product-info";
import { products as staticProducts, collections as staticCollections } from "@/data/products";
import type { Product, Collection } from "@shared/schema";

export default function Home() {
  const [selectedCollection, setSelectedCollection] = useState("daydream");
  
  const { data: apiProducts, isError: productsError } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    retry: 1,
  });

  const { data: apiCollections, isError: collectionsError } = useQuery<Collection[]>({
    queryKey: ["/api/collections"],
    retry: 1,
  });

  const products = apiProducts && !productsError ? apiProducts : staticProducts;
  const collections = apiCollections && !collectionsError ? apiCollections : staticCollections;

  const currentProduct = products.find(p => p.collection === selectedCollection) || products[0];
  const currentCollectionData = collections.find(c => c.id === selectedCollection) || collections[0];
  
  if (!products.length || !collections.length) {
    return (
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-[#EDE6D3]">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-serif text-gray-900 mb-4"
        >
          Loading...
        </motion.h1>
      </div>
    );
  }

  const toggleCollection = () => {
    setSelectedCollection(prev => prev === "daydream" ? "aqua-glow" : "daydream");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="site-frame flex flex-col"
    >
      <Header />

      <main className="flex-grow pt-24 lg:pt-32 pb-12 lg:pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          
          {/* Boutique Hero - Scroll Reveal */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 lg:mb-32"
          >
            <h1 className="text-5xl lg:text-[10rem] leading-[0.8] tracking-tighter mb-8 font-black">
              Embrace <br />
              <span className="text-[#ee786e] italic">Elegance.</span>
            </h1>
            <div className="flex flex-col items-center space-y-4">
              <p className="font-sans font-black uppercase tracking-[0.4em] text-[10px] lg:text-sm opacity-40">
                Premium Modest Boutique • Organic • Vegan
              </p>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-px h-16 bg-[#5d4037]/20"
              />
            </div>
          </motion.div>

          {/* Boutique Toggle - Sticky-ish */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center gap-4 mb-20 max-w-2xl mx-auto"
          >
            {collections.map((collection) => (
              <button 
                key={collection.id}
                onClick={() => setSelectedCollection(collection.id)}
                className={`flex-1 py-4 lg:py-6 rounded-3xl font-black text-xs lg:text-sm uppercase tracking-[0.2em] transition-all duration-700 border-2 ${
                  selectedCollection === collection.id 
                    ? 'bg-[#5d4037] text-white border-[#5d4037] shadow-2xl scale-105' 
                    : 'bg-white/50 text-[#5d4037] border-transparent hover:border-[#5d4037]/20'
                }`}
              >
                {collection.name}
              </button>
            ))}
          </motion.div>

          {/* Main Product Showcase - Side-by-Side Clean Grid */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedCollection}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="bg-white/40 rounded-[3rem] lg:rounded-[5rem] p-4 lg:p-12 border border-[#5d4037]/5 shadow-sm"
            >
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
                {/* Gallery Section */}
                <div className="w-full">
                  <ProductGallery key={currentProduct.id} product={currentProduct} onStarClick={toggleCollection} />
                </div>

                {/* Info Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-full py-8"
                >
                  <ProductInfo product={currentProduct} collection={currentCollectionData} />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
