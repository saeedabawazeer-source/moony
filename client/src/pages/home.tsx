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
    <div className="relative h-screen w-screen bg-[#ffecd9]">
      {/* Static Global Frame */}
      <div className="fixed-master-frame" />

      {/* Internal Scrollable Content */}
      <div className="internal-scroll-area">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 lg:px-8 space-y-32 py-24">
          
          {/* Section 1: Brand Hero */}
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <h1 className="text-6xl lg:text-[7rem] leading-[0.85] tracking-tighter mb-8 font-black">
              Embrace <br />
              <span className="text-[#ee786e] italic">Elegance.</span>
            </h1>
            <p className="font-sans font-black uppercase tracking-[0.4em] text-[10px] lg:text-sm opacity-40 mb-12">
              Premium Modest Boutique • Organic • Vegan
            </p>
            <div className="flex justify-center opacity-20">
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-px h-16 bg-[#5d4037]"
              />
            </div>
          </motion.section>

          {/* Section 2: Interaction/Shop */}
          <section className="space-y-12">
            <div className="flex justify-center gap-4 max-w-xl mx-auto w-full">
              {collections.map((collection) => (
                <button 
                  key={collection.id}
                  onClick={() => setSelectedCollection(collection.id)}
                  className={`flex-1 py-3 lg:py-5 rounded-3xl font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] transition-all duration-500 border-2 ${
                    selectedCollection === collection.id 
                      ? 'bg-[#5d4037] text-white border-[#5d4037] shadow-xl' 
                      : 'bg-white/60 text-[#5d4037] border-transparent hover:border-[#5d4037]/10'
                  }`}
                >
                  {collection.name}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedCollection}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start"
              >
                <div className="lg:sticky lg:top-32">
                  <ProductGallery key={currentProduct.id} product={currentProduct} onStarClick={toggleCollection} />
                </div>
                <div className="space-y-12">
                  <ProductInfo product={currentProduct} collection={currentCollectionData} />
                  
                  {/* Integrated Details */}
                  <div className="bg-white/40 p-8 lg:p-12 rounded-[3rem] border border-[#5d4037]/5 space-y-8">
                    <div className="space-y-2">
                      <h4 className="font-black uppercase tracking-widest text-xs opacity-50 text-[#ee786e]">Boutique Breakdown</h4>
                      <h3 className="text-3xl font-serif">What's in the box?</h3>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentProduct.includes.map((item, i) => (
                        <li key={i} className="flex items-center space-x-3 text-sm font-bold opacity-80">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#ee786e]"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-6 border-t border-[#5d4037]/5 font-medium opacity-60 italic text-sm">
                      Recycled materials • Chlorine Resistant • UPF 50+
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
}
