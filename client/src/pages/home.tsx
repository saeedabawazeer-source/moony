import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CanvasWave from "@/components/ui/canvas-wave";
import { useCart } from "@/context/cart-context";
import { products as staticProducts, collections as staticCollections } from "@/data/products";
import type { Product, Collection } from "@shared/schema";

export default function Home() {
  const [location, setLocation] = useLocation();
  const isAr = location === "/ar";
  const [selectedCollection, setSelectedCollection] = useState("aqua-glow");
  const [selectedSize, setSelectedSize] = useState("M");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, openCart } = useCart();

  // Eagerly preload all product images into browser cache on mount
  useEffect(() => {
    const allImages = [
      "/images/models/daydream/1.JPG",
      "/images/models/daydream/_HTM3935.JPEG",
      "/images/models/daydream/_HTM4121.JPEG",
      "/images/models/daydream/_HTM4179.JPEG",
      "/images/models/daydream/_HTM4610.JPEG",
      "/images/models/aquaglow/1.JPG",
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
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
          <img src="/images/starfish-coral.png" alt="Loading" className="w-16 opacity-50" />
        </motion.div>
      </div>
    );
  }

  const scrollToShop = () => {
    document.getElementById('boutique-shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCart = () => {
    addToCart(currentProduct, selectedSize, quantity);
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
          
          <div className="absolute inset-x-0 bottom-0 top-[55%] z-20 pointer-events-none">
            <CanvasWave />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-grow flex flex-col justify-center items-center text-center px-4 lg:px-8 relative w-full"
          >
            <div className="relative z-30 mb-2 lg:mb-4 w-full max-w-6xl mx-auto py-8 lg:py-20 px-4">
              <h1 
                key={selectedCollection + "-text"}
                className="uppercase font-black w-full text-center tracking-normal text-transparent bg-clip-text bg-cover bg-center"
                style={{
                  backgroundImage: `url(${selectedCollection === 'daydream' ? '/images/models/daydream/VIDDD.gif' : '/images/models/aquaglow/VIDAG.gif'})`,
                  fontSize: isAr ? "clamp(5rem, 12vw, 9rem)" : "clamp(5rem, 12vw, 9rem)",
                  lineHeight: "1.3",
                  fontFamily: isAr ? "'Noto Kufi Arabic', sans-serif" : "inherit",
                  WebkitTextStroke: "4px #000000"
                }}
              >
                {isAr ? <span dir="rtl" className="block">اجعلي<br/>كل موجة<br/>تحسب.</span> : <>Make<br/>Every Wave<br/>Count.</>}
              </h1>
            </div>
            
            <div className="relative z-30 mb-4 lg:mb-6">
              <p className={`font-sans font-bold text-sm lg:text-lg text-[#5d4037] ${isAr ? "font-kufi" : ""}`}>
                {isAr ? "من شواطئ جدة إلى باب بيتك." : "From Jeddah shores to your front door."}
              </p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToShop}
              className={`relative z-30 px-10 py-5 rounded-full bg-[#eda78b] text-white font-black text-xs lg:text-sm uppercase tracking-[0.3em] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 ${isAr ? "font-kufi" : ""}`}
            >
              {isAr ? "اختاري الموديل" : "PICK YOUR MODEL"}
            </motion.button>
          </motion.div>
          {/* Section 1 Ambient Starfish Overlay */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-hidden">
            <motion.img src="/images/starfish-coral.png" className="absolute top-[10%] right-[5%] w-12 lg:w-20 pointer-events-none" animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
            <motion.img src="/images/starfish-teal.png" className="absolute top-[85%] left-[5%] w-16 lg:w-24 pointer-events-none" animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
            <motion.img src="/images/starfish-coral.png" className="absolute top-[45%] left-[2%] w-10 lg:w-16 pointer-events-none" animate={{ x: [0, 15, 0], rotate: [0, 360] }} transition={{ x: { duration: 10, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 40, repeat: Infinity, ease: "linear" } }} />
            <motion.img src="/images/starfish-teal.png" className="absolute top-[15%] left-[10%] w-8 lg:w-12 pointer-events-none" animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 5, repeat: Infinity }} />
            <motion.img src="/images/starfish-coral.png" className="absolute top-[80%] right-[8%] w-14 lg:w-22 pointer-events-none" animate={{ x: [0, -30, 0], y: [0, 15, 0] }} transition={{ duration: 9, repeat: Infinity }} />
          </div>
        </section>

        {/* Section 2: The Cinematic Shop */}
        <section id="boutique-shop" className="snap-slide h-full flex flex-col lg:flex-row pt-0 overflow-hidden bg-[#fef8e1]">
          {/* 1. Swipeable Model Visual - pure CSS, no framer */}
          <div 
            className="w-full lg:w-[45%] h-[56vh] lg:h-full relative overflow-hidden rounded-b-[2rem] lg:rounded-none lg:rounded-r-[2.5rem] border-[3px] border-t-0 lg:border-t-0 border-black"
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
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {currentProduct.images.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === currentImageIndex ? 'bg-white scale-125' : 'bg-white/40'}`} />
              ))}
            </div>
          </div>

          {/* Right/Bottom Info Area */}
          <div className="flex-1 flex flex-col items-center justify-center w-full lg:w-[55%] space-y-2 lg:space-y-4 px-8 lg:px-12 py-2 lg:py-0">

            {/* 2. Model Switcher — clear named pill toggle */}
            <div className="w-full lg:flex lg:justify-center">
              <div className="inline-flex items-center bg-[#f0e8d5] border-2 border-[#5d4037]/15 rounded-full p-1 gap-1 shadow-inner">
                {[...collections].reverse().map((col) => {
                  const isActive = selectedCollection === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => {
                        setSelectedCollection(col.id);
                        setCurrentImageIndex(0);
                        setSelectedSize("M");
                        setQuantity(1);
                      }}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-full font-black text-[11px] lg:text-sm transition-all duration-300 ${
                        isActive
                          ? 'bg-white text-[#5d4037] shadow-md scale-[1.02]'
                          : 'text-[#5d4037]/50 hover:text-[#5d4037]/80'
                      }`}
                    >
                      <img
                        src={col.id === 'daydream' ? "/images/starfish-coral.png" : "/images/starfish-teal.png"}
                        className={`w-4 h-4 lg:w-5 lg:h-5 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}
                        alt={col.name}
                      />
                      <span>{col.name}</span>
                      {col.id === 'daydream' && !isActive && (
                        <span className="bg-[#e5815c]/15 text-[#e5815c] text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">Low Stock</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full space-y-1 lg:space-y-3 px-0 lg:text-center">
                <p className="font-sans font-black uppercase tracking-[0.5em] text-[8px] lg:text-[10px] text-[#e5815c]">
                  5 PIECE SET
                </p>
                <h2 className="text-3xl lg:text-6xl font-serif font-black text-[#000000] tracking-tighter leading-none">
                  {currentProduct.name}
                </h2>
                <p className="text-xl lg:text-3xl font-black text-[#000000] pt-1 leading-none">SAR {currentProduct.price}</p>
                <p className="text-[10px] lg:text-sm font-black text-[#5d4037] pt-0.5 lg:pt-2">Includes all 5 pieces.</p>
            </div>

              {/* 3. Purchase Block */}
              <div className="w-full space-y-2 lg:space-y-4 pb-2 lg:max-w-md lg:mx-auto">
                <div className="flex items-center justify-start lg:justify-center gap-4">
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
                          className={`w-9 h-9 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-base border-2 transition-all relative ${
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
                  <div className="flex items-center bg-white/50 rounded-xl lg:rounded-2xl px-2 lg:px-4 py-1 border-2 border-[#5d4037]/10 h-9 lg:h-16">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center font-black text-[#5d4037] text-lg lg:text-2xl hover:scale-125 transition-transform"
                    >
                      -
                    </button>
                    <span className="px-3 lg:px-4 font-black text-[10px] lg:text-lg text-[#5d4037] min-w-[1.5rem] lg:min-w-[2rem] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center font-black text-[#5d4037] text-lg lg:text-2xl hover:scale-125 transition-transform"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="w-full h-14 lg:h-20 bg-[#eda78b] text-black border-[3px] border-black rounded-2xl lg:rounded-3xl font-black text-xs lg:text-xl uppercase tracking-tighter shadow-[8px_8px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all flex items-center justify-center gap-3 active:translate-x-2 active:translate-y-2 active:shadow-none"
                >
                  <i className="fas fa-shopping-cart text-lg lg:text-2xl"></i>
                  ADD TO CART
                </button>
                <p className="text-[10px] lg:text-xs font-bold text-[#5d4037]/40 uppercase tracking-widest text-center mt-4">
                  Includes all 5 pieces.
                </p>
              </div>

              {/* Navigation Hint */}
              <motion.button 
                onClick={() => document.getElementById('anatomy-section')?.scrollIntoView({ behavior: 'smooth' })}
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full flex flex-col items-center mt-1 hover:opacity-80 transition-opacity"
              >
                <p className="text-[8px] lg:text-[10px] font-black tracking-[0.2em] uppercase mb-0.5 text-[#5d4037]">See all 5 pieces ↓</p>
              </motion.button>
            </div>
        </section>

        {/* Section 2.5: Anatomy */}
        <section id="anatomy-section" className="snap-slide h-[100dvh] px-3 lg:px-8 pt-4 pb-8 lg:py-12 flex flex-col justify-center bg-[#fef8e1] overflow-hidden">
          <div className="max-w-[95vw] lg:max-w-[90vw] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-16 items-center h-full">
            
            {/* Left/Top: Pieces Cluster */}
            <div className="flex flex-col items-center justify-center w-full order-1 lg:order-1 py-1 lg:py-2">
              <div className="mb-2 text-center lg:text-left w-full">
                <p className="text-[9px] lg:text-xs font-black uppercase tracking-[0.3em] text-[#e5815c] mb-0.5">The Breakdown</p>
                <h3 className="text-xl lg:text-5xl font-serif font-black tracking-tighter italic leading-tight">The Full Modular Set</h3>
              </div>

              {/* Piece Stack — realistic mannequin sizing, uncropped */}
              <div className="flex flex-col items-center w-full justify-center">

                {/* Turban — small head piece */}
                <motion.div initial={{ opacity: 0, y: -5 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex items-center justify-center w-full relative z-30">
                  <div className="flex items-center justify-end gap-1 mr-2 w-20 lg:w-32">
                    <span className="font-serif font-black italic text-[11px] lg:text-lg">Turban</span>
                    <svg className="w-3 h-3 lg:w-5 lg:h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M19 12l-7-7M19 12l-7 7"/></svg>
                  </div>
                  <img src="/images/pieces/aqua-2.png" className="drop-shadow-md h-[10vh] lg:h-[14vh] w-auto object-contain" alt="Turban" />
                  <div className="ml-2 w-20 lg:w-32 shrink-0"/>
                </motion.div>

                {/* Top — largest piece (torso) */}
                <motion.div initial={{ opacity: 0, y: -5 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-center w-full -mt-[9vh] lg:-mt-[13vh] relative z-20">
                  <div className="w-20 lg:w-32 shrink-0"/>
                  <img src="/images/pieces/aqua-1.png" className="drop-shadow-md h-[32vh] lg:h-[42vh] w-auto object-contain" alt="Top" />
                  <div className="flex items-center gap-1 ml-2 w-20 lg:w-32">
                    <svg className="w-3 h-3 lg:w-5 lg:h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
                    <span className="font-serif font-black italic text-[11px] lg:text-lg">Top</span>
                  </div>
                </motion.div>

                {/* Leggings — tall and narrow */}
                <motion.div initial={{ opacity: 0, y: -5 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex items-center justify-center w-full -mt-[10vh] lg:-mt-[14vh] relative z-10">
                  <div className="flex items-center justify-end gap-1 mr-2 w-20 lg:w-32">
                    <span className="font-serif font-black italic text-[11px] lg:text-lg">Leggings</span>
                    <svg className="w-3 h-3 lg:w-5 lg:h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M19 12l-7-7M19 12l-7 7"/></svg>
                  </div>
                  <img src="/images/pieces/aqua-4.png" className="drop-shadow-md h-[24vh] lg:h-[32vh] w-auto object-contain" alt="Leggings" />
                  <div className="ml-2 w-20 lg:w-32 shrink-0"/>
                </motion.div>

                {/* Both Coverups side by side */}
                <motion.div initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center w-full gap-2 -mt-[8vh] lg:-mt-[12vh] relative z-40">
                  {/* Short Coverup (Left Tag) */}
                  <div className="flex items-center justify-end gap-1 w-14 lg:w-24 text-right">
                    <span className="font-serif font-black italic text-[9px] lg:text-sm leading-tight">Short<br/>Coverup</span>
                    <svg className="w-3 h-3 lg:w-4 lg:h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
                  </div>
                  
                  <img src="/images/pieces/aqua-3.png" className="drop-shadow-md h-[22vh] lg:h-[30vh] w-auto object-contain" alt="Short Coverup" />
                  
                  <img src="/images/pieces/aqua-5.png" className="drop-shadow-md h-[26vh] lg:h-[36vh] w-auto object-contain" alt="Whole Coverup" />
                  
                  {/* Whole Coverup (Right Tag) */}
                  <div className="flex items-center gap-1 w-14 lg:w-24 text-left">
                    <svg className="w-3 h-3 lg:w-4 lg:h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M19 12l-7-7M19 12l-7 7"/></svg>
                    <span className="font-serif font-black italic text-[9px] lg:text-sm leading-tight">Whole<br/>Coverup</span>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Right/Bottom: Why you'll love it (4 points explicitly visible at bottom) */}
            <div className="flex flex-col justify-center order-2 lg:order-2 w-full mt-2 lg:mt-0">
               <div className="space-y-0.5 hidden lg:block mb-4">
                  <p className="font-sans font-black uppercase tracking-[0.4em] text-[10px] text-[#6bb7b3]">High Performance</p>
                  <h2 className="text-5xl font-serif font-black tracking-tighter leading-tight">Why you'll love Moony:</h2>
               </div>
               
               {/* 4 points in a 2x2 grid on mobile so they take up less vertical space */}
               <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-2 gap-y-4 px-2 w-full lg:px-0">
                {[
                  { title: "Zero Cling.", text: "Engineered fabric that never sticks." },
                  { title: "All-Day Comfort.", text: "Breathable, lightweight performance." },
                  { title: "Built-In UV Shield.", text: "UPF 50+ protection woven in." },
                  { title: "Quick-Dry.", text: "Dries before you reach the car." }
                ].map((spec, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-start text-left w-full space-y-1"
                  >
                    <div className="flex items-center gap-1.5">
                       <img 
                         src={selectedCollection === 'daydream' ? '/images/starfish-coral.png' : '/images/starfish-teal.png'}
                         className="w-4 h-4 lg:w-5 lg:h-5 shrink-0"
                         alt=""
                       />
                       <h4 className="font-serif font-black text-sm lg:text-xl text-[#000000] tracking-tight">{spec.title}</h4>
                    </div>
                     <p className="text-xs lg:text-sm font-bold text-[#5d4037] leading-tight italic break-words">
                      {spec.text}
                    </p>
                  </motion.div>
                ))}
               </div>
            </div>
          </div>
        </section>

        {/* Section 4: The Final Chapter (Signup + Footer) */}
        <section id="details-section" className="snap-slide !h-auto min-h-[100dvh] px-4 lg:px-20 pt-8 pb-4 lg:pt-16 lg:pb-10 flex flex-col justify-between bg-[#fef8e1]">
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-5 lg:space-y-8">
            
            {/* Reviews Title */}
            <div className="space-y-1">
              <p className="font-sans font-black uppercase tracking-[0.4em] text-[8px] lg:text-[9px] text-[#e5815c]">What They Say</p>
              <h2 className="text-xl lg:text-4xl font-serif font-black tracking-tighter leading-none">Moony Stars</h2>
            </div>

            {/* Glowing Reviews (UGC Masonry Grid) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 w-full mt-2 lg:mt-4 pb-8 lg:pb-20">
               {[
                 { img: "/images/daydream-1.jpeg", quote: "Obsessed with this fit!", author: "Sarah J." },
                 { img: "/images/daydream-2.jpeg", quote: "No clinging at all. Finally.", author: "Lina M." },
                 { img: "/images/daydream-3.jpeg", quote: "Delivery was incredibly fast", author: "Mariam A." },
                 { img: "/images/daydream-4.jpeg", quote: "Worth every single Riyal", author: "Nouf R." }
               ].map((review, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className={`relative group overflow-hidden rounded-2xl lg:rounded-3xl border-2 border-black aspect-square lg:aspect-auto lg:h-[40vh] ${i % 2 === 0 ? 'lg:-translate-y-4' : 'lg:translate-y-4'}`}
                 >
                   <img src={review.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="UGC" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#5d4037]/90 via-[#5d4037]/20 to-transparent flex flex-col justify-end p-3 lg:p-5 text-left">
                      <div className="flex items-center space-x-1 mb-1">
                        <span className="text-[#C0FF72] text-[8px] lg:text-xs">★★★★★</span>
                      </div>
                      <p className="text-xs lg:text-base font-bold text-white leading-tight mb-1.5 lg:mb-2">"{review.quote}"</p>
                      <p className="text-[9px] lg:text-[11px] font-black uppercase tracking-widest text-[#fef8e1]">— {review.author}</p>
                   </div>
                 </motion.div>
               ))}
            </div>

            <p className="text-xs lg:text-base font-serif font-black italic text-[#5d4037] mt-0 mb-6 lg:mb-12">
              Order today and get same day delivery in Jeddah.
            </p>
          </div>
          
          <div className="w-full mt-auto pt-8">
            <Footer />
          </div>

          {/* Section 4 Ambient Starfish Overlay */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
            <motion.img src="/images/starfish-coral.png" className="absolute top-[10%] right-[5%] w-12 lg:w-20 pointer-events-none" animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
            <motion.img src="/images/starfish-teal.png" className="absolute top-[85%] left-[5%] w-16 lg:w-24 pointer-events-none" animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
            <motion.img src="/images/starfish-coral.png" className="absolute top-[45%] left-[2%] w-10 lg:w-16 pointer-events-none opacity-40" animate={{ x: [0, 15, 0], rotate: [0, 360] }} transition={{ x: { duration: 10, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 40, repeat: Infinity, ease: "linear" } }} />
            <motion.img src="/images/starfish-teal.png" className="absolute top-[15%] left-[10%] w-8 lg:w-12 pointer-events-none opacity-30" animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 5, repeat: Infinity }} />
            <motion.img src="/images/starfish-coral.png" className="absolute top-[80%] right-[8%] w-14 lg:w-22 pointer-events-none opacity-20" animate={{ x: [0, -30, 0], y: [0, 15, 0] }} transition={{ duration: 9, repeat: Infinity }} />
          </div>
        </section>
      </div>
    </div>
  );
}
