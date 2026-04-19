import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CheckoutOverlay from "@/components/product/checkout-overlay";
import { products as staticProducts, collections as staticCollections } from "@/data/products";
import type { Product, Collection } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedCollection, setSelectedCollection] = useState("daydream");
  const [selectedSize, setSelectedSize] = useState("M");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Eagerly preload all product images into browser cache on mount
  useEffect(() => {
    const allImages = [
      "/images/models/daydream/_HTM3935.JPEG",
      "/images/models/daydream/_HTM4121.JPEG",
      "/images/models/daydream/_HTM4179.JPEG",
      "/images/models/daydream/_HTM4610.JPEG",
      "/images/models/aquaglow/_HTM3828.JPEG",
      "/images/models/aquaglow/_HTM3832.JPEG",
      "/images/models/aquaglow/_HTM3856.JPEG",
      "/images/models/aquaglow/_HTM3883.JPEG",
    ];
    allImages.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const { data: apiProducts, isError: productsError } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    retry: 1,
  });

  const { data: apiCollections, isError: collectionsError } = useQuery<Collection[]>({
    queryKey: ["/api/collections"],
    retry: 1,
  });

  // Fetch live inventory
  const { data: inventory } = useQuery<Record<string, Record<string, number>>>({
    queryKey: ["/api/inventory"],
    refetchInterval: 30000, // refresh every 30s
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
    setIsCheckoutOpen(true);
  };

  const touchStartX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        setCurrentImageIndex(prev => (prev + 1) % currentProduct.images.length);
      } else {
        setCurrentImageIndex(prev => (prev - 1 + currentProduct.images.length) % currentProduct.images.length);
      }
    }
  };


  return (
    <div className="relative h-[100dvh] w-screen bg-[#e5815c] overflow-hidden">
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
        <section className="snap-slide relative overflow-hidden bg-[#fef8e1]">
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
            <h1 className="text-5xl lg:text-[8rem] leading-[0.85] tracking-tighter mb-6 font-black text-[#000000]">
              Make Every<br />Wave Count.
            </h1>
            <div className="space-y-3 mb-10">
              <p className="font-sans font-bold text-sm lg:text-lg text-[#5d4037]">
                From Jeddah shores to your front door.
              </p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToShop}
              className="px-10 py-5 rounded-full bg-[#6bb7b3] text-white font-black text-xs lg:text-sm uppercase tracking-[0.3em] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
            >
              PICK YOUR MODEL
            </motion.button>
          </motion.div>
        </section>

        {/* Section 2: The Cinematic Shop */}
        <section id="boutique-shop" className="snap-slide h-full flex flex-col pt-0 overflow-hidden bg-[#fef8e1]">
          <div className="flex flex-col items-center w-full h-full space-y-2 lg:space-y-3">
            
            {/* 1. Swipeable Model Visual - pure CSS, no framer */}
            <div 
              className="w-full h-[56vh] lg:h-[72vh] relative overflow-hidden rounded-b-[2rem] lg:rounded-b-[2.5rem] border-[3px] border-t-0 border-black"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {currentProduct.images.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={currentProduct.name}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  loading="eager"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
                  style={{ opacity: i === currentImageIndex ? 1 : 0 }}
                />
              ))}
              {/* Swipe Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {currentProduct.images.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === currentImageIndex ? 'bg-white scale-125' : 'bg-white/40'}`} />
                ))}
              </div>
            </div>

            {/* 2. Model Switcher (Stars in one line) */}
            <div className="w-full flex space-x-8 lg:space-x-12 pb-2 px-8 lg:px-0">
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
                      className={`w-12 h-12 lg:w-16 lg:h-16 transition-all duration-300 ${
                        isActive 
                          ? 'drop-shadow-[0_0_15px_rgba(229,129,92,0.4)] scale-110 opacity-100' 
                          : 'opacity-50 hover:opacity-80'
                      }`}
                      alt={col.name}
                    />
                    {isActive && (
                      <motion.div 
                        layoutId="activeStar"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#5d4037] rounded-full"
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
                <p className="text-[10px] lg:text-xs font-black text-[#5d4037] pt-0.5">Includes all 5 pieces.</p>

              {/* 3. Purchase Block */}
              <div className="w-full space-y-3 lg:space-y-4 pb-2">
                <div className="flex items-center justify-start gap-4">
                  {/* Size Selector */}
                  <div className="flex gap-2">
                    {currentProduct.sizes.map((size) => {
                      const stock = inventory?.[currentProduct.id]?.[size];
                      const soldOut = stock !== undefined && stock <= 0;
                      return (
                        <button 
                          key={size}
                          onClick={() => !soldOut && setSelectedSize(size)}
                          disabled={soldOut}
                          className={`w-9 h-9 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-sm border-2 transition-all relative ${
                            soldOut
                              ? 'bg-white/20 text-[#5d4037]/30 border-white/20 cursor-not-allowed line-through'
                              : selectedSize === size 
                                ? 'bg-[#5d4037] text-white border-[#5d4037] scale-105 shadow-md' 
                                : 'bg-white/50 text-[#5d4037] border-white/50 hover:border-[#5d4037]/20'
                          }`}
                        >
                          {size}
                          {soldOut && <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full"></span>}
                        </button>
                      );
                    })}
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
                
                <button 
                  onClick={handleCheckout}
                  className="w-full py-5 lg:py-7 rounded-full bg-[#C0FF72] text-black text-xs lg:text-base font-black uppercase tracking-widest leading-none border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 active:scale-95"
                >
                  ADD TO CART
                </button>
              </div>

              {/* Navigation Hint */}
              <motion.button 
                onClick={() => document.getElementById('anatomy-section')?.scrollIntoView({ behavior: 'smooth' })}
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full flex flex-col items-center mt-1 hover:opacity-80 transition-opacity"
              >
                <p className="text-[8px] lg:text-[10px] font-black tracking-[0.2em] uppercase mb-0.5 text-black">See all 5 pieces ↓</p>
              </motion.button>
            </div>
          </div>
        </section>

        {/* Section 2.5: Anatomy */}
        <section id="anatomy-section" className="snap-slide h-full px-4 lg:px-8 py-8 lg:py-16 flex flex-col justify-center overflow-hidden bg-[#fef8e1]">
          <div className="max-w-[90vw] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center h-full">
            
            {/* Left: The Moony Blueprint (Centered Piece Cluster) */}
            <div className="relative h-[50vh] lg:h-full w-full flex flex-col items-center justify-center">
              <div className="mb-8 lg:mb-12 text-center lg:text-left w-full lg:max-w-xl lg:-translate-y-12">
                <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-[#e5815c] mb-2">The Breakdown</p>
                <h3 className="text-3xl lg:text-5xl font-serif font-black tracking-tighter italic">The Full Modular Set</h3>
              </div>
              
              <div className="relative w-full h-[60vh] lg:h-[80vh] max-w-xl mx-auto transform scale-[0.85] lg:scale-[1.4]">
                {/* 1. Turban */}
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[32%] z-30">
                  <img src="/images/pieces/turban.png" className="w-full h-auto drop-shadow-xl" alt="Turban" />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute -top-4 -right-4 flex items-center space-x-1"
                  >
                    <span className="font-serif font-black italic text-[11px] lg:text-sm text-[#000000]">Turban</span>
                    <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
                      <path d="M2 38C15 30 25 15 38 2" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                      <path d="M38 2L32 2M38 2L38 8" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                </div>

                {/* 2. Top (Tunic) */}
                <div className="absolute top-[22%] left-[5%] w-[58%] z-20">
                  <img src="/images/pieces/top.png" className="w-full h-auto drop-shadow-xl" alt="Top" />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute top-4 -left-8 flex items-center space-x-1"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
                      <path d="M38 38C25 30 15 15 2 2" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                      <path d="M2 2L8 2M2 2L2 8" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    <span className="font-serif font-black italic text-[11px] lg:text-sm text-[#000000]">Top</span>
                  </motion.div>
                </div>

                {/* 3. Leggings */}
                <div className="absolute top-[42%] right-[5%] w-[48%] z-10">
                  <img src="/images/pieces/leggings.png" className="w-full h-auto drop-shadow-2xl" alt="Leggings" />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute bottom-8 -right-6 flex flex-col items-center"
                  >
                    <svg className="w-6 h-6 rotate-90" viewBox="0 0 40 40" fill="none">
                      <path d="M2 2C15 10 25 25 38 38" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                      <path d="M38 38L32 38M38 38L38 32" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    <span className="font-serif font-black italic text-[11px] lg:text-sm text-[#000000]">Leggings</span>
                  </motion.div>
                </div>

                {/* 4. Short Coverup */}
                <div className="absolute bottom-[28%] left-[5%] w-[45%] z-40">
                  <img src="/images/pieces/short-coverup.png" className="w-full h-auto drop-shadow-xl" alt="Short Coverup" />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute -bottom-2 -left-4 flex flex-col items-center"
                  >
                    <span className="font-serif font-black italic text-[10px] lg:text-[11px] text-[#000000] mb-0.5">Short Coverup</span>
                    <svg className="w-5 h-5 -rotate-[135deg]" viewBox="0 0 40 40" fill="none">
                      <path d="M2 38C15 30 25 15 38 2" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                </div>

                {/* 5. Whole Coverup */}
                <div className="absolute bottom-[10%] right-[20%] w-[52%] z-10 opacity-90">
                  <img src="/images/pieces/whole-coverup.png" className="w-full h-auto drop-shadow-xl" alt="Whole Coverup" />
                   <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute -bottom-4 lg:-bottom-2 right-8 lg:right-4 flex flex-col items-end"
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

            {/* Right: Why you'll love it (High-Impact Stats) */}
            <div className="space-y-6 lg:space-y-16 flex flex-col justify-center h-full lg:-translate-y-24">
               <div className="space-y-1">
                  <p className="font-sans font-black uppercase tracking-[0.4em] text-[8px] lg:text-[10px] text-[#6bb7b3]">High Performance</p>
                  <h2 className="text-xl lg:text-5xl font-serif font-black tracking-tighter leading-tight">Why you'll love Moony:</h2>
               </div>
               
               <div className="grid grid-cols-2 lg:grid-cols-1 gap-6 lg:gap-12">
                {[
                  { title: "Zero Cling. Full Confidence.", text: "Engineered fabric that never sticks. Move freely, look flawless." },
                  { title: "All-Day Comfort.", text: "Breathable, lightweight performance you won't want to take off." },
                  { title: "Built-In UV Shield.", text: "UPF 50+ protection woven into every fiber. No reapplying." },
                  { title: "Dries Before You Reach the Car.", text: "Quick-dry tech means zero wet marks on your way out." }
                ].map((spec, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-1 lg:space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                       <img 
                         src={selectedCollection === 'daydream' ? '/images/starfish-coral.png' : '/images/starfish-teal.png'}
                         className="w-4 h-4 lg:w-5 lg:h-5"
                         alt=""
                       />
                       <h4 className="font-serif font-black text-sm lg:text-3xl text-[#000000] tracking-tight">{spec.title}</h4>
                    </div>
                    <p className="text-[10px] lg:text-lg font-bold text-[#5d4037] leading-tight italic max-w-sm">
                      {spec.text}
                    </p>
                  </motion.div>
                ))}
               </div>
            </div>
          </div>
        </section>

        {/* Section 3: The Final Chapter (Signup + Footer) */}
        <section id="details-section" className="snap-slide px-4 lg:px-20 py-6 lg:py-10 flex flex-col justify-end overflow-hidden bg-[#fef8e1]">
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-5 lg:space-y-8">
            
            {/* Reviews Title */}
            <div className="space-y-1">
              <p className="font-sans font-black uppercase tracking-[0.4em] text-[8px] lg:text-[9px] text-[#e5815c]">What They Say</p>
              <h2 className="text-2xl lg:text-4xl font-serif font-black tracking-tighter leading-none">Loved by Moony Sisters</h2>
            </div>

            {/* Glowing Reviews (Social Proof) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 w-full">
               {[
                 { text: "The perfect balance of elegance and modesty. I feel amazing in it!", author: "Sarah J." },
                 { text: "Fastest delivery I've ever had in Jeddah. The quality is unmatched.", author: "Lina M." },
                 { text: "Finally, a swimwear brand that understands my needs perfectly.", author: "Mariam A." }
               ].map((review, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="space-y-2 text-center lg:text-left"
                 >
                   <div className="flex items-center justify-center lg:justify-start space-x-1">
                     <span className="text-black text-[10px] lg:text-xs">★★★★★</span>
                     <span className="text-[8px] lg:text-[9px] font-black text-green-600 flex items-center"><i className="fas fa-check-circle mr-0.5"></i>Verified</span>
                   </div>
                   <p className="text-[11px] lg:text-sm font-bold italic text-[#5d4037] leading-relaxed">"{review.text}"</p>
                   <p className="text-[9px] font-black uppercase tracking-widest text-[#000000]">— {review.author}</p>
                 </motion.div>
               ))}
            </div>

            {/* WhatsApp Newsletter Card */}
            <div className="w-full bg-white p-6 lg:p-10 rounded-[2.5rem] lg:rounded-full border-[3px] border-black flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6 shadow-[4px_4px_0px_0px_#000]">
               <div className="text-center lg:text-left space-y-0.5">
                  <h3 className="text-2xl lg:text-4xl font-serif font-black tracking-tighter italic leading-none">
                    Moony Inner Circle
                  </h3>
                  <p className="text-[9px] lg:text-[11px] font-black text-[#000000] uppercase tracking-widest leading-none">
                    Get 10% off your first set via WhatsApp.
                  </p>
               </div>

               <div className="flex flex-col items-center lg:items-end w-full lg:w-auto space-y-4">
                 <form className="flex w-full lg:w-[420px] items-center bg-[#fef8e1]/50 rounded-full p-1.5 border-[3px] border-black group focus-within:border-[#01A0A1] transition-all">
                   <div className="pl-4 pr-2 border-r border-black/20 text-[10px] lg:text-xs font-black">
                      +966
                   </div>
                   <input 
                     type="tel" 
                     placeholder="5XXXXXXXX"
                     className="flex-1 bg-transparent px-3 py-2 outline-none font-sans font-bold text-xs lg:text-base placeholder:opacity-30 min-w-0"
                   />
                   <button className="flex-shrink-0 bg-[#C0FF72] text-black px-6 lg:px-10 py-3 rounded-full font-black uppercase tracking-widest text-[9px] lg:text-xs border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-95">
                      JOIN
                   </button>
                 </form>
                 <p className="hidden lg:block text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-[#5d4037]">
                    Join 500+ Moony Sisters ★
                 </p>
               </div>
            </div>

            <Footer />
          </div>
        </section>
      </div>

      <CheckoutOverlay 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={currentProduct}
        size={selectedSize}
        quantity={quantity}
      />
    </div>
  );
}
