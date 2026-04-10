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

  const scrollToShop = () => {
    document.getElementById('boutique-shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-screen w-screen bg-[#e5815c]">
      {/* Static Global Frame Border */}
      <div className="fixed-master-frame" />

      {/* Internal Scrollable Content with Snapping */}
      <div className="internal-scroll-area">
        
        {/* Section 1: The Brand */}
        <section className="snap-slide">
          <Header />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-grow flex flex-col justify-center items-center text-center px-4 lg:px-8"
          >
            <h1 className="text-6xl lg:text-[8rem] leading-[0.85] tracking-tighter mb-8 font-black">
              Embrace <br />
              <span className="text-[#e5815c] italic">Elegance.</span>
            </h1>
            <div className="space-y-4 mb-12">
              <p className="font-sans font-black uppercase tracking-[0.4em] text-[10px] lg:text-sm opacity-40">
                Premium Modest Boutique • Organic • Vegan
              </p>
              <p className="font-serif font-black italic text-lg lg:text-3xl text-[#e5815c] tracking-tight">DESIGN IN JEDDAH</p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToShop}
              className="px-10 py-5 rounded-full bg-[#5d4037] text-white font-black text-xs lg:text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-[#e5815c] transition-colors duration-500"
            >
              VIEW MODELS
            </motion.button>
          </motion.div>
        </section>

        {/* Section 2: The Model interaction */}
        <section id="boutique-shop" className="snap-slide px-4 lg:px-8">
          <div className="max-w-5xl mx-auto w-full py-8 lg:py-12 space-y-6 lg:space-y-10">
            <div className="flex justify-center gap-3 max-w-md mx-auto w-full">
              {collections.map((collection) => (
                <button 
                  key={collection.id}
                  onClick={() => setSelectedCollection(collection.id)}
                  className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 border-2 ${
                    selectedCollection === collection.id 
                      ? 'bg-[#5d4037] text-white border-[#5d4037] shadow-lg' 
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
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
              >
                <div className="w-full max-w-sm mx-auto aspect-[4/5] lg:aspect-auto">
                  <ProductGallery key={currentProduct.id} product={currentProduct} onStarClick={toggleCollection} />
                </div>
                <div className="w-full">
                  <ProductInfo product={currentProduct} collection={currentCollectionData} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Section 3: The Details & Footer */}
        <section className="snap-slide px-4 lg:px-8 py-12 lg:py-20">
          <div className="max-w-5xl mx-auto h-full flex flex-col justify-between">
            <div className="space-y-10 lg:space-y-16 py-8">
              <div className="text-center space-y-3">
                <h2 className="text-3xl lg:text-5xl font-serif font-black tracking-tighter">Boutique Breakdown</h2>
                <p className="font-sans font-bold uppercase tracking-[0.3em] text-[10px] opacity-40">Precision Engineering • Italian Fabrics</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                <div className="bg-white/50 p-8 rounded-[3rem] border border-[#5d4037]/5 space-y-4 shadow-sm">
                  <h4 className="font-black uppercase tracking-widest text-xs opacity-50">Included</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {currentProduct.includes.map((item, i) => (
                      <li key={i} className="flex items-center space-x-2 text-[10px] lg:text-xs font-bold opacity-80">
                        <div className="w-1 h-1 rounded-full bg-[#e5815c]"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#6bb7b3]/10 p-8 rounded-[3rem] border border-[#5d4037]/5 flex items-center shadow-sm">
                  <p className="text-xs lg:text-base font-medium opacity-70 leading-relaxed italic">
                    Designed in Jeddah. Crafted with premium Italian Spandex. Breathable, quick-dry, and eco-certified.
                  </p>
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </section>
      </div>
    </div>
  );
}
