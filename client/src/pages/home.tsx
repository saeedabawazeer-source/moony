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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

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

  const scrollToShop = () => {
    document.getElementById('boutique-shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCheckout = () => {
    localStorage.setItem('moony_cart', JSON.stringify({ 
      product: currentProduct.id, 
      size: selectedSize, 
      quantity: quantity 
    }));
    setLocation('/checkout');
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 20;
    const velocityThreshold = 200;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      setCurrentImageIndex(prev => (prev + 1) % currentProduct.images.length);
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      setCurrentImageIndex(prev => (prev - 1 + currentProduct.images.length) % currentProduct.images.length);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-[#e5815c]">
      {/* Global Grain Texture Overlay */}
      <div className="noise-overlay" />
      {/* Static Global Frame Border */}
      <div className="fixed-master-frame" />

      {/* Image Preloader (Hidden) */}
      <div className="hidden">
        {products.flatMap(p => p.images).map((src, i) => (
          <img key={i} src={src} alt="preload" />
        ))}
      </div>

      {/* Internal Scrollable Content with Snapping */}
      <div className="internal-scroll-area">
        
        {/* Section 1: The Brand */}
        <section className="snap-slide relative overflow-hidden">
          <Header />
          
          {/* Ambient Animated Starfish (Repositioned to Edges) */}
          <motion.img 
            src="/images/starfish-coral.png"
            className="absolute top-[10%] right-[5%] w-12 lg:w-20 pointer-events-none"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 15, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img 
            src="/images/starfish-teal.png"
            className="absolute bottom-[10%] left-[5%] w-16 lg:w-24 pointer-events-none"
            animate={{ 
              y: [0, 25, 0],
              rotate: [0, -10, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img 
            src="/images/starfish-coral.png"
            className="absolute top-[45%] left-[2%] w-10 lg:w-16 pointer-events-none opacity-40"
            animate={{ 
              x: [0, 15, 0],
              rotate: [0, 360],
            }}
            transition={{ 
              x: { duration: 10, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 40, repeat: Infinity, ease: "linear" }
            }}
          />
          <motion.img 
            src="/images/starfish-teal.png"
            className="absolute top-[15%] left-[10%] w-8 lg:w-12 pointer-events-none opacity-30"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.img 
            src="/images/starfish-coral.png"
            className="absolute bottom-[20%] right-[8%] w-14 lg:w-22 pointer-events-none opacity-20"
            animate={{ x: [0, -30, 0], y: [0, 15, 0] }}
            transition={{ duration: 9, repeat: Infinity }}
          />

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-grow flex flex-col justify-center items-center text-center px-4 lg:px-8 relative z-10"
          >
            <h1 className="text-6xl lg:text-[8rem] leading-[0.85] tracking-tighter mb-8 font-black">
              Embrace <br />
              <span className="text-[#e5815c] italic">Elegance.</span>
            </h1>
            <div className="space-y-4 mb-12">
              <p className="font-sans font-black uppercase tracking-[0.4em] text-[10px] lg:text-sm opacity-40">
                Premium Modest Boutique
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
        <section id="boutique-shop" className="snap-slide h-[100dvh] flex flex-col pt-0 overflow-hidden">
          <div className="flex flex-col items-start w-full max-w-xl mx-auto h-full space-y-3 lg:space-y-4">
            
            {/* 1. Swipeable Model Visual (Ultra Smooth Gallery) */}
            <div className="w-full relative h-[48vh] lg:h-[60vh] overflow-hidden rounded-[2rem] lg:rounded-[3.5rem] shadow-xl bg-[#fef8e1]">
              <motion.div 
                key={selectedCollection}
                className="flex h-full w-full cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img 
                    key={currentImageIndex}
                    src={currentProduct.images[currentImageIndex]} 
                    alt={currentProduct.name} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                </AnimatePresence>
              </motion.div>
              
              {/* Swipe Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {currentProduct.images.map((_, i) => (
                  <div key={i} className={`w-1 h-1 rounded-full ${i === currentImageIndex ? 'bg-white scale-125' : 'bg-white/40'}`} />
                ))}
              </div>
            </div>

            {/* 2. Model Switcher (Stars in one line) */}
            <div className="w-full flex space-x-6 pb-2 px-8 lg:px-0">
              {collections.map((col) => {
                const isActive = selectedCollection === col.id;
                return (
                  <motion.button
                    key={col.id}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSelectedCollection(col.id);
                      setCurrentImageIndex(0);
                      setSelectedSize("M");
                      setQuantity(1);
                    }}
                    className="relative"
                  >
                    <img 
                      src={col.id === 'daydream' ? "/images/starfish-coral.png" : "/images/starfish-teal.png"}
                      className={`w-10 h-10 lg:w-12 lg:h-12 transition-all duration-300 ${
                        isActive 
                          ? 'drop-shadow-[0_0_15px_rgba(229,129,92,0.4)] scale-110 grayscale-0 opacity-100' 
                          : 'grayscale-[80%] opacity-30 hover:opacity-60'
                      }`}
                      alt={col.name}
                    />
                    {isActive && (
                      <motion.div 
                        layoutId="activeStar"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#5d4037] rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="w-full space-y-1 lg:space-y-2 px-8 lg:px-0">
                <p className="font-sans font-black uppercase tracking-[0.5em] text-[8px] lg:text-[9px] text-[#e5815c]">
                  5 PIECE SET
                </p>
                <h2 className="text-3xl lg:text-5xl font-serif font-black text-[#000000] tracking-tighter leading-none">
                  {currentProduct.name}
                </h2>
                <p className="text-xl lg:text-2xl font-black text-[#000000] pt-1 leading-none">SAR {currentProduct.price}</p>

              {/* 3. Purchase Block */}
              <div className="w-full space-y-3 lg:space-y-4 pb-2">
                <div className="flex items-center justify-start gap-4">
                  {/* Size Selector */}
                  <div className="flex gap-2">
                    {currentProduct.sizes.map((size) => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-9 h-9 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-sm border-2 transition-all ${
                          selectedSize === size 
                            ? 'bg-[#5d4037] text-white border-[#5d4037] scale-105 shadow-md' 
                            : 'bg-white/50 text-[#5d4037] border-white/50 hover:border-[#5d4037]/20'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center bg-white/50 rounded-xl px-2 py-1 border-2 border-[#5d4037]/10 h-9 lg:h-14">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-6 h-6 flex items-center justify-center font-black text-[#5d4037] hover:scale-125 transition-transform"
                    >
                      -
                    </button>
                    <span className="px-3 font-black text-[10px] lg:text-sm text-[#5d4037] min-w-[1.5rem] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="w-6 h-6 flex items-center justify-center font-black text-[#5d4037] hover:scale-125 transition-transform"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full">
                  <button className="flex-1 py-3 lg:py-5 rounded-full border-2 border-[#5d4037] text-[#5d4037] text-[9px] lg:text-sm font-black hover:bg-[#5d4037] hover:text-white transition-all uppercase tracking-widest leading-none">
                    ADD TO CART
                  </button>
                  <button 
                    onClick={handleCheckout}
                    className="flex-[2] btn-premium-gradient py-3 lg:py-5 text-[9px] lg:text-sm font-black shadow-lg uppercase tracking-widest leading-none"
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              </div>

              {/* Navigation Hint */}
              <motion.button 
                onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })}
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full flex flex-col items-center pt-1 opacity-20 hover:opacity-100 transition-opacity"
              >
                <p className="text-[7px] font-black tracking-[0.3em] uppercase mb-1">View More Details</p>
                <i className="fas fa-chevron-down text-[8px]"></i>
              </motion.button>
            </div>
          </div>
        </section>

        {/* Section 3: The Details & Footer */}
        <section id="details-section" className="snap-slide px-4 lg:px-8 py-12 lg:py-20">
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
