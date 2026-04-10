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
    <div className="min-h-screen bg-[#EDE6D3] flex flex-col relative overflow-x-hidden text-gray-900">
      {/* Decorative Radial Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40" 
           style={{ background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, transparent 70%)' }}></div>
      
      <Header />

      <main className="flex-grow pt-16 pb-12 lg:pt-36 lg:pb-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 lg:mb-16"
          >
            <h1 className="text-3xl lg:text-7xl font-serif text-gray-900 leading-tight tracking-tight">
              Embrace Elegance.<br/>
              <span className="text-gradient italic font-normal">Modest Swimwear.</span>
            </h1>
          </motion.div>

          {/* Collection Toggle */}
          <div className="flex justify-center gap-3 lg:gap-8 mb-8 lg:mb-16 max-w-3xl mx-auto">
            {collections.map((collection, idx) => (
              <motion.div 
                key={collection.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + (idx * 0.1) }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-3 lg:space-x-5 px-5 py-3 lg:px-10 lg:py-5 rounded-xl lg:rounded-2xl cursor-pointer transition-colors duration-500 flex-1 lg:flex-none justify-center ${
                  selectedCollection === collection.id 
                    ? 'bg-white shadow-xl ring-1 ring-gray-900/5' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                onClick={() => setSelectedCollection(collection.id)}
              >
                <img 
                  src={collection.icon} 
                  alt={collection.name} 
                  className={`w-8 h-8 object-contain transition-transform duration-700 ${selectedCollection === collection.id ? 'rotate-12' : ''}`}
                />
                <span className={`font-serif font-bold text-lg tracking-wide ${selectedCollection === collection.id ? 'opacity-100' : 'opacity-40'}`}>
                  {collection.name}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Featured Product Card */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedCollection}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-[2rem] p-8 lg:p-16 border border-white/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)]"
            >
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                <ProductGallery key={currentProduct.id} product={currentProduct} onStarClick={toggleCollection} />
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
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
