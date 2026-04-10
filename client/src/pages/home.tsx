import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { products as staticProducts, collections as staticCollections } from "@/data/products";
import type { Product, Collection } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedCollection, setSelectedCollection] = useState("daydream");
  const [selectedSize, setSelectedSize] = useState("M");
  
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
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-[#fef8e1]">
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

  const handleCheckout = () => {
    localStorage.setItem('moony_cart', JSON.stringify({ 
      product: currentProduct.id, 
      size: selectedSize, 
      quantity: 1 
    }));
    setLocation('/checkout');
  };

  return (
    <div className="relative h-screen w-screen bg-[#e5815c]">
      {/* Global Grain Texture Overlay */}
      <div className="noise-overlay" />
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
              className="px-10 py-5 rounded-full bg-[#6bb7b3] text-white font-black text-xs lg:text-sm uppercase tracking-[0.3em] shadow-2xl hover:brightness-110 transition-all duration-500"
            >
              VIEW MODELS
            </motion.button>
          </motion.div>
        </section>

        {/* Section 2: The Cinematic Shop */}
        <section id="boutique-shop" className="snap-slide h-screen flex flex-col pt-0">
          <div className="flex flex-col items-center w-full max-w-xl mx-auto h-full space-y-4 lg:space-y-6">
            
            {/* 1. Full-Width Model Visual (Fills the frame) */}
            <motion.div 
              key={currentProduct.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full aspect-[4/5] lg:aspect-[3.5/4] bg-[#fef8e1] rounded-t-[2rem] lg:rounded-t-[3.5rem] overflow-hidden shadow-xl"
            >
              <img 
                src={currentProduct.mainImage} 
                alt={currentProduct.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* 2. Selection: The OTHER Model Star & Name */}
            <div className="flex flex-col items-center space-y-4 px-4 lg:px-8">
              <div className="flex items-center space-x-4">
                {collections.filter(c => c.id !== selectedCollection).map((otherCollection) => (
                  <motion.button
                    key={otherCollection.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedCollection(otherCollection.id);
                      setSelectedSize("M");
                    }}
                    className="flex items-center bg-white/40 backdrop-blur-sm pl-4 pr-6 py-2 rounded-full border border-white/20 space-x-3 group"
                  >
                    <img 
                      src={otherCollection.id === 'daydream' ? "/images/starfish-coral.png" : "/images/starfish-teal.png"}
                      className="w-8 h-8 lg:w-10 lg:h-10 transition-transform group-hover:rotate-12"
                      alt="Other Collection Star"
                    />
                    <div className="text-left">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Switch to</p>
                      <p className="text-sm lg:text-base font-serif font-black text-[#000000]">{otherCollection.name}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* 3. Branding for Selective context */}
              <div className="text-center space-y-1">
                <h2 className="text-4xl lg:text-5xl font-serif font-black text-[#000000] tracking-tighter">
                  {currentProduct.name}
                </h2>
                <p className="font-sans font-black uppercase tracking-[0.4em] text-[10px] text-[#e5815c]">
                  5 PIECE SET
                </p>
              </div>

              {/* 4. Purchase Block */}
              <div className="w-full space-y-4 lg:space-y-6 pt-2">
                <div className="flex justify-center gap-2">
                  {currentProduct.sizes.map((size) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-11 h-11 lg:w-14 lg:h-14 rounded-2xl font-black text-xs lg:text-sm border-2 transition-all ${
                        selectedSize === size 
                          ? 'bg-[#5d4037] text-white border-[#5d4037] scale-110 shadow-lg' 
                          : 'bg-white/50 text-[#5d4037] border-white/50 hover:border-[#5d4037]/20'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="btn-premium-gradient w-full py-5 lg:py-7 text-lg lg:text-xl font-black shadow-2xl"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>

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
