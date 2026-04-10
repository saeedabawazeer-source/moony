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
    <div className="snap-container bg-[#c2d1c0]">
      {/* Slide 1: The Brand */}
      <section className="snap-slide px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="site-frame h-full flex flex-col justify-between"
        >
          <Header />
          <div className="flex-grow flex flex-col justify-center text-center">
            <h1 className="text-6xl lg:text-[8rem] leading-[0.85] tracking-tighter mb-8 font-black">
              Embrace <br />
              <span className="text-[#ee786e] italic">Elegance.</span>
            </h1>
            <p className="font-sans font-black uppercase tracking-[0.4em] text-[10px] lg:text-sm opacity-40">
              Premium Modest Boutique • Organic • Vegan
            </p>
          </div>
          <div className="flex justify-center pb-8 opacity-20">
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-px h-12 bg-[#5d4037]"
            />
          </div>
        </motion.div>
      </section>

      {/* Slide 2: The Shop */}
      <section className="snap-slide px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="site-frame h-full flex flex-col pt-8 lg:pt-16"
        >
          {/* Collection Selection */}
          <div className="flex justify-center gap-4 mb-8 lg:mb-12 max-w-xl mx-auto w-full">
            {collections.map((collection) => (
              <button 
                key={collection.id}
                onClick={() => setSelectedCollection(collection.id)}
                className={`flex-1 py-3 lg:py-5 rounded-3xl font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] transition-all duration-500 border-2 ${
                  selectedCollection === collection.id 
                    ? 'bg-[#5d4037] text-white border-[#5d4037] shadow-xl' 
                    : 'bg-white/40 text-[#5d4037] border-transparent hover:border-[#5d4037]/10'
                }`}
              >
                {collection.name}
              </button>
            ))}
          </div>

          {/* Product Gallery & Selection */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedCollection}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center flex-grow overflow-hidden"
            >
              <div className="h-full max-h-[40vh] lg:max-h-full">
                <ProductGallery key={currentProduct.id} product={currentProduct} onStarClick={toggleCollection} />
              </div>
              <div className="overflow-y-auto max-h-[40vh] lg:max-h-full boutique-scrollbar pr-2 pb-8">
                <ProductInfo product={currentProduct} collection={currentCollectionData} />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Slide 3: The Details & Footer */}
      <section className="snap-slide px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="site-frame h-full flex flex-col justify-between pt-12 lg:pt-24"
        >
          <div className="max-w-4xl mx-auto w-full space-y-12 mb-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl lg:text-6xl font-serif font-black tracking-tighter">Boutique Breakdown</h2>
              <p className="font-sans font-bold uppercase tracking-[0.3em] text-[10px] opacity-40">Precision Engineering for Modest Comfort</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="bg-white/40 p-8 rounded-[3rem] border border-[#5d4037]/5 space-y-4">
                <h4 className="font-black uppercase tracking-widest text-xs">Included Items</h4>
                <ul className="space-y-3">
                  {currentProduct.includes.map((item, i) => (
                    <li key={i} className="flex items-center space-x-3 text-sm font-bold opacity-80">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ee786e]"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#a2ccb6]/20 p-8 rounded-[3rem] border border-[#5d4037]/5 space-y-4">
                <h4 className="font-black uppercase tracking-widest text-xs">Materials & Care</h4>
                <p className="text-sm lg:text-base font-medium opacity-70 leading-relaxed italic">
                  Crafted from high-performance recycled nylon and premium Italian spandex. Salt-water and chlorine resistant for long-lasting boutique quality.
                </p>
              </div>
            </div>
          </div>

          <Footer />
        </motion.div>
      </section>
    </div>
  );
}
