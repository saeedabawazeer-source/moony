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
    <div className="min-h-screen bg-[#ffecd9] flex flex-col relative overflow-x-hidden text-[#5d4037]">
      {/* Whimsical Floating Starfish */}
      <motion.img 
        src="/images/starfish-coral.png"
        className="fixed top-32 -left-12 w-32 h-32 opacity-10 animate-bop pointer-events-none"
      />
      <motion.img 
        src="/images/starfish-teal.png"
        className="fixed bottom-24 -right-12 w-48 h-48 opacity-10 animate-bop pointer-events-none"
        style={{ animationDelay: '1s' }}
      />
      
      <Header />

      <main className="flex-grow pt-24 lg:pt-32 pb-12 lg:pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          
          {/* Boutique Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 lg:mb-20"
          >
            <h1 className="text-4xl lg:text-8xl leading-[0.9] tracking-tighter mb-4">
              Embrace Elegance. <br />
              <span className="italic font-light text-[#ee786e]">Modest Boutique.</span>
            </h1>
            <p className="font-sans font-bold uppercase tracking-[0.3em] text-[10px] lg:text-xs opacity-60">
              Positively Natural • Vegan • Hand-Packed
            </p>
          </motion.div>

          {/* Boutique Toggle */}
          <div className="flex justify-center gap-3 mb-16 max-w-xl mx-auto">
            {collections.map((collection) => (
              <button 
                key={collection.id}
                onClick={() => setSelectedCollection(collection.id)}
                className={`flex-1 py-3 lg:py-4 rounded-full font-bold text-xs lg:text-sm uppercase tracking-widest transition-all duration-500 border-2 ${
                  selectedCollection === collection.id 
                    ? 'bg-[#5d4037] text-white border-[#5d4037] scale-105 shadow-xl' 
                    : 'bg-white/40 text-[#5d4037] border-[#5d4037]/10 hover:border-[#5d4037]/40'
                }`}
              >
                {collection.name}
              </button>
            ))}
          </div>

          {/* Asymmetric Product Display */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedCollection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: "circOut" }}
              className="relative"
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-start lg:gap-0">
                {/* Gallery - The Base */}
                <div className="w-full lg:w-[60%] z-10 boutique-card p-0 overflow-hidden rounded-[3rem]">
                  <ProductGallery key={currentProduct.id} product={currentProduct} onStarClick={toggleCollection} />
                </div>

                {/* Info Card - The Overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 20 }}
                  className="w-[92%] lg:w-[45%] -mt-12 lg:mt-24 lg:-ml-24 z-20 boutique-card p-8 lg:p-12"
                >
                  <ProductInfo product={currentProduct} collection={currentCollectionData} />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      <Footer />
    </div>
  );
}
