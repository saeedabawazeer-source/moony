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
            <div className="w-full relative h-[52vh] lg:h-[65vh] overflow-hidden rounded-[2rem] lg:rounded-[3.5rem] shadow-xl bg-[#fef8e1]">
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
                
                <div className="flex gap-2 w-full pt-1">
                  <button className="flex-1 py-4 lg:py-6 rounded-full border-2 border-[#5d4037] text-[#5d4037] text-[10px] lg:text-sm font-black hover:bg-[#5d4037] hover:text-white transition-all uppercase tracking-widest leading-none">
                    ADD TO CART
                  </button>
                  <button 
                    onClick={handleCheckout}
                    className="flex-[2] btn-premium-gradient py-4 lg:py-6 text-[11px] lg:text-base font-black shadow-lg uppercase tracking-widest leading-none"
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              </div>

              {/* Navigation Hint */}
              <motion.button 
                onClick={() => document.getElementById('anatomy-section')?.scrollIntoView({ behavior: 'smooth' })}
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full flex flex-col items-center pt-1 opacity-20 hover:opacity-100 transition-opacity"
              >
                <p className="text-[7px] font-black tracking-[0.3em] uppercase mb-1">View Piece Anatomy</p>
                <i className="fas fa-chevron-down text-[8px]"></i>
              </motion.button>
            </div>
          </div>
        </section>

        {/* Section 2.5: The Unified Anatomy Hub (Dissected Anatomy + Specs) */}
        <section id="anatomy-section" className="snap-slide h-[100dvh] px-4 lg:px-20 py-2 lg:py-16 flex flex-col justify-center overflow-hidden bg-[#fef8e1]">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-20 items-center h-full">
            
            {/* Left: The Dissected Pieces (Floating, Clean, No-BG) */}
            <div className="relative h-[42vh] lg:h-[80vh] w-full flex items-center justify-center lg:translate-y-0">
              <div className="relative w-full h-full max-w-xl mx-auto transform scale-[0.8] lg:scale-100">
                {/* 1. Turban */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[32%] z-30">
                  <img src="/images/pieces/turban.png" className="w-full h-auto drop-shadow-xl" alt="Turban" />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute -top-4 -right-2 flex items-center space-x-1"
                  >
                    <span className="font-serif font-black italic text-[11px] lg:text-sm text-[#000000]">Turban</span>
                    <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
                      <path d="M2 38C15 30 25 15 38 2" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                      <path d="M38 2L32 2M38 2L38 8" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                </div>

                {/* 2. Top (Tunic) */}
                <div className="absolute top-[12%] left-[8%] w-[55%] z-20">
                  <img src="/images/pieces/top.png" className="w-full h-auto drop-shadow-xl" alt="Top" />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute top-0 -left-6 flex items-center space-x-1"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
                      <path d="M38 38C25 30 15 15 2 2" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                      <path d="M2 2L8 2M2 2L2 8" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    <span className="font-serif font-black italic text-[11px] lg:text-sm text-[#000000]">Top</span>
                  </motion.div>
                </div>

                {/* 3. Leggings */}
                <div className="absolute top-[32%] right-[5%] w-[45%] z-10">
                  <img src="/images/pieces/leggings.png" className="w-full h-auto drop-shadow-2xl" alt="Leggings" />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute bottom-4 -right-4 flex flex-col items-center"
                  >
                    <svg className="w-6 h-6 rotate-90" viewBox="0 0 40 40" fill="none">
                      <path d="M2 2C15 10 25 25 38 38" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                      <path d="M38 38L32 38M38 38L38 32" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    <span className="font-serif font-black italic text-[11px] lg:text-sm text-[#000000]">Leggings</span>
                  </motion.div>
                </div>

                {/* 4. Short Coverup */}
                <div className="absolute bottom-[20%] left-[2%] w-[40%] z-40">
                  <img src="/images/pieces/short-coverup.png" className="w-full h-auto drop-shadow-xl" alt="Short Coverup" />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute -bottom-2 -left-2 flex flex-col items-center"
                  >
                    <span className="font-serif font-black italic text-[10px] lg:text-[11px] text-[#000000] mb-0.5">Short Coverup</span>
                    <svg className="w-5 h-5 -rotate-[135deg]" viewBox="0 0 40 40" fill="none">
                      <path d="M2 38C15 30 25 15 38 2" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                </div>

                {/* 5. Whole Coverup */}
                <div className="absolute bottom-2 right-[18%] w-[48%] z-10 opacity-90">
                  <img src="/images/pieces/whole-coverup.png" className="w-full h-auto drop-shadow-xl" alt="Whole Coverup" />
                   <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute -bottom-2 right-4 flex flex-col items-end"
                   >
                    <span className="font-serif font-black italic text-[11px] lg:text-sm text-[#000000] mb-0.5">Whole Coverup</span>
                    <svg className="w-10 h-4" viewBox="0 0 60 20" fill="none">
                      <path d="M2 2C20 15 40 15 58 2" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                      <path d="M58 2L52 2M58 2L58 8" stroke="#000000" strokeWidth="4" strokeLinecap="round" transform="rotate(-15 58 2)" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Right: Why you'll love Moony + Join the family (Consolidated) */}
            <div className="space-y-3 lg:space-y-8 flex flex-col justify-center transform lg:translate-x-4">
              <div className="space-y-0.5">
                 <p className="font-sans font-black uppercase tracking-[0.4em] text-[8px] lg:text-[10px] text-[#6bb7b3]">Moony Excellence</p>
                 <h2 className="text-xl lg:text-5xl font-serif font-black tracking-tighter leading-tight">Why you'll love it:</h2>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-5">
                {[
                  { title: "1- Elegant and Modest 💙", text: "Full coverage swim elegance." },
                  { title: "2- All-Day Comfort ☁️", text: "Breathable fabric performance." },
                  { title: "3- Sun Protection ☀️", text: "Integrated safe UV shielding." },
                  { title: "4- Quick-Drying 💧", text: "Fast-drying, adventure ready." }
                ].map((spec, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-0.5"
                  >
                    <h4 className="font-serif font-black text-[10px] lg:text-base text-[#000000]">{spec.title}</h4>
                    <p className="text-[8px] lg:text-xs font-bold opacity-40 leading-tight italic max-w-sm">
                      {spec.text}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Simplified "Join the family" Bulletin */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="pt-2 lg:pt-8 border-t border-[#000000]/5 flex flex-col space-y-2 lg:space-y-3"
              >
                <p className="font-sans font-black uppercase tracking-widest text-[8px] lg:text-[10px] text-[#e5815c]">Join the Moony Stars family</p>
                <div className="grid grid-cols-1 gap-1">
                  {['Exclusive collection drops', 'Dazzling community stories'].map((item, i) => (
                    <div key={i} className="flex items-center space-x-2 text-[9px] lg:text-xs font-black text-[#5d4037]">
                      <span className="text-[10px]">🌟</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 3: Brand Sign-off & Footer */}
        <section id="details-section" className="snap-slide px-4 lg:px-8 py-12 lg:py-20 flex flex-col justify-end overflow-hidden">
          <div className="max-w-5xl mx-auto w-full space-y-12 lg:space-y-20">
            <div className="text-center space-y-12">
               <div className="space-y-4">
                  <h3 className="text-4xl lg:text-7xl font-serif font-black tracking-tighter text-[#e5815c] italic">
                    Let's shine together like stars 🌟
                  </h3>
                  <div className="flex justify-center space-x-8 pt-4">
                    <a href="#" className="flex items-center space-x-3 text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-[#5d4037] hover:brightness-150 transition-all">
                      <i className="fab fa-instagram text-xl"></i>
                      <span>Instagram</span>
                    </a>
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
