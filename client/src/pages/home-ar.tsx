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

export default function HomeAR() {
  const [, setLocation] = useLocation();
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
    refetchInterval: 30000,
  });

  const products = apiProducts && !productsError ? apiProducts : staticProducts;
  const collections = apiCollections && !collectionsError ? apiCollections : staticCollections;

  const currentProduct = products.find(p => p.collection === selectedCollection) || products[0];
  
  if (!products.length || !collections.length) {
    return (
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-[#fef8e1]" dir="rtl">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-serif text-gray-900 mb-4 font-black"
        >
          جاري التحميل...
        </motion.h1>
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
    <div className="relative h-[100dvh] w-screen bg-[#e5815c] overflow-hidden" dir="rtl">
      {/* Global Grain Texture Overlay */}
      <div className="noise-overlay" />
      {/* Static Global Frame Border */}
      <div className="fixed-master-frame" />

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
            <div className="relative z-30 mb-2 lg:mb-4 w-full max-w-6xl mx-auto py-8 lg:py-20 px-4" dir="ltr">
              <h1 
                key={selectedCollection + "-text"}
                className="uppercase font-black w-full text-center tracking-normal text-transparent bg-clip-text bg-cover bg-center"
                style={{
                  backgroundImage: `url(${selectedCollection === 'daydream' ? '/images/models/daydream/VIDDD.gif' : '/images/models/aquaglow/VIDAG.gif'})`,
                  fontSize: "clamp(3.8rem, 10vw, 9rem)",
                  lineHeight: "1.3",
                  fontFamily: "'Noto Kufi Arabic', sans-serif",
                  WebkitTextStroke: "4px transparent"
                }}
              >
                <span dir="rtl" className="block">استمتعي<br/>بكل<br/>موجة.</span>
              </h1>
            </div>
            <div className="relative z-30 mb-4 lg:mb-6">
              <p className="font-sans font-bold text-sm lg:text-lg text-[#5d4037] font-kufi">
                من بحر جدة لِباب بيتك.
              </p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToShop}
              className="relative z-30 px-10 py-5 rounded-full bg-[#eda78b] text-white font-black text-xs lg:text-sm uppercase border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-kufi"
            >
              اختاري موديلك
            </motion.button>
          </motion.div>
          {/* Section 1 Ambient Starfish Overlay */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-hidden">
            <motion.img src="/images/starfish-coral.png" className="absolute top-[10%] right-[3%] w-12 lg:w-20 pointer-events-none" animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
            <motion.img src="/images/starfish-teal.png" className="absolute bottom-[10%] left-[3%] w-16 lg:w-24 pointer-events-none" animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
            <motion.img src="/images/starfish-coral.png" className="absolute top-[45%] left-[1%] w-10 lg:w-16 pointer-events-none" animate={{ x: [0, 15, 0], rotate: [0, 360] }} transition={{ x: { duration: 10, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 40, repeat: Infinity, ease: "linear" } }} />
            <motion.img src="/images/starfish-teal.png" className="absolute top-[15%] left-[8%] w-8 lg:w-12 pointer-events-none" animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 5, repeat: Infinity }} />
            <motion.img src="/images/starfish-coral.png" className="absolute top-[80%] right-[6%] w-14 lg:w-22 pointer-events-none" animate={{ x: [0, -30, 0], y: [0, 15, 0] }} transition={{ duration: 9, repeat: Infinity }} />
          </div>
        </section>

        {/* Section 2: The Cinematic Shop */}
        <section id="boutique-shop" className="snap-slide h-full flex flex-col lg:flex-row pt-0 overflow-hidden bg-[#fef8e1]" dir="rtl">
          {/* 1. Swipeable Model Visual - pure CSS, no framer */}
          <div 
            className="w-full lg:w-[45%] h-[56vh] lg:h-full relative overflow-hidden rounded-b-[2rem] lg:rounded-none lg:rounded-l-[2.5rem] border-[3px] border-t-0 lg:border-t-0 border-black"
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
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10" dir="ltr">
              {currentProduct.images.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === currentImageIndex ? 'bg-white scale-125' : 'bg-white/40'}`} />
              ))}
            </div>
          </div>

          {/* Right/Bottom Info Area */}
          <div className="flex-1 flex flex-col items-center justify-center w-full lg:w-[55%] space-y-2 lg:space-y-4 px-8 lg:px-12 py-2 lg:py-0">

            {/* Selector — clear named pill toggle */}
            <div className="w-full flex justify-center">
              <div className="inline-flex items-center bg-[#f0e8d5] border-2 border-[#5d4037]/15 rounded-full p-1 gap-1 shadow-inner" dir="ltr">
                {[...collections].reverse().map((col) => {
                  const isActive = selectedCollection === col.id;
                  const arName = col.id === 'daydream' ? 'دايدريم' : 'أكوا جلو';
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
                        alt={arName}
                      />
                      <span className="font-kufi">{arName}</span>
                      {col.id === 'daydream' && !isActive && (
                        <span className="bg-[#e5815c]/15 text-[#e5815c] text-[7px] font-black px-1.5 py-0.5 rounded-full font-kufi">كمية محدودة</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full space-y-1 lg:space-y-2 px-8 lg:px-0 text-right">
                <p className="font-sans font-black uppercase text-[8px] lg:text-[9px] text-[#e5815c]">
                  طقم مكون من 5 قطع
                </p>
                <h2 className="text-3xl lg:text-5xl font-serif font-black text-[#000000] tracking-tighter leading-none font-kufi">
                  {currentProduct.name}
                </h2>
                <p className="text-xl lg:text-2xl font-black text-[#000000] pt-1 leading-none">{currentProduct.price} ريال</p>
                <p className="text-[10px] lg:text-xs font-black text-[#5d4037] pt-0.5">يشمل جميع القطع الخمس.</p>

              {/* Purchase Block */}
              <div className="w-full space-y-2 lg:space-y-3 pb-2">
                <div className="flex items-center justify-start gap-4 flex-row-reverse">
                  {/* Size Selector */}
                  <div className="flex gap-2 flex-row-reverse">
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

                  {/* Quantity */}
                  <div className="flex items-center flex-row-reverse bg-white/50 rounded-xl px-2 py-1 border-2 border-[#5d4037]/10 h-9 lg:h-14">
                    <button onClick={() => setQuantity(quantity + 1)} className="w-6 h-6 flex items-center justify-center font-black text-[#5d4037]">+</button>
                    <span className="px-3 font-black text-[10px] lg:text-sm text-[#5d4037] min-w-[1.5rem] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-6 h-6 flex items-center justify-center font-black text-[#5d4037]">-</button>
                  </div>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="w-full h-14 lg:h-20 bg-[#eda78b] text-black border-[3px] border-black rounded-2xl lg:rounded-3xl font-black text-xs lg:text-xl uppercase tracking-tighter shadow-[8px_8px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all flex items-center justify-center gap-3 active:translate-x-2 active:translate-y-2 active:shadow-none"
                >
                  <i className="fas fa-shopping-cart text-lg lg:text-2xl"></i>
                  إضافة للسلة
                </button>
                <p className="text-[10px] font-bold text-[#5d4037]/40 uppercase text-center mt-4 font-black">
                  يشمل جميع القطع الـ 5.
                </p>
              </div>

              {/* Navigation Hint */}
              <motion.button 
                onClick={() => document.getElementById('anatomy-section')?.scrollIntoView({ behavior: 'smooth' })}
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full flex flex-col items-center mt-1 hover:opacity-80 transition-opacity"
              >
                <p className="text-[8px] lg:text-[10px] font-black uppercase mb-0.5 text-black">شاهدي القطع الخمس ↓</p>
              </motion.button>
            </div>
          </div>
        </section>

        {/* Section 2.5: Anatomy */}
        <section id="anatomy-section" className="snap-slide h-[100dvh] px-3 lg:px-8 pt-4 pb-8 lg:py-12 flex flex-col justify-center bg-[#fef8e1] overflow-hidden" dir="rtl">
          <div className="max-w-[95vw] lg:max-w-[90vw] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-16 items-center h-full">

            {/* Left/Top: Pieces Cluster */}
            <div className="flex flex-col items-center justify-center w-full order-1 lg:order-1 py-1 lg:py-2">
              <div className="mb-2 text-center lg:text-right w-full">
                <p className="text-[9px] lg:text-xs font-black uppercase text-[#e5815c] mb-0.5">المواصفات</p>
                <h3 className="text-xl lg:text-5xl font-serif font-black tracking-tighter italic leading-tight">الطقم الكامل المتكامل</h3>
              </div>

              {/* Piece Stack */}
              <div className="flex flex-col items-center w-full justify-center" dir="ltr">

                {/* Turban */}
                <motion.div initial={{ opacity: 0, y: -5 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex items-center justify-center w-full relative z-30">
                  <div className="w-20 lg:w-32 shrink-0"/>
                  <img src="/images/pieces/aqua-2.png" className="scale-x-[-1] drop-shadow-md h-[10vh] lg:h-[14vh] w-auto object-contain" alt="توربان" />
                  <div className="flex items-center gap-1 ml-2 w-20 lg:w-32">
                    <svg className="w-3 h-3 lg:w-5 lg:h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M19 12l-7-7M19 12l-7 7"/></svg>
                    <span className="font-serif font-black italic text-[11px] lg:text-lg">توربان</span>
                  </div>
                </motion.div>

                {/* Top */}
                <motion.div initial={{ opacity: 0, y: -5 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-center w-full -mt-[9vh] lg:-mt-[13vh] relative z-20">
                  <div className="flex items-center justify-end gap-1 mr-2 w-20 lg:w-32">
                    <span className="font-serif font-black italic text-[11px] lg:text-lg">بلوزة</span>
                    <svg className="w-3 h-3 lg:w-5 lg:h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
                  </div>
                  <img src="/images/pieces/aqua-1.png" className="scale-x-[-1] drop-shadow-md h-[32vh] lg:h-[42vh] w-auto object-contain" alt="بلوزة" />
                  <div className="ml-2 w-20 lg:w-32 shrink-0"/>
                </motion.div>

                {/* Leggings */}
                <motion.div initial={{ opacity: 0, y: -5 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex items-center justify-center w-full -mt-[10vh] lg:-mt-[14vh] relative z-10">
                  <div className="w-20 lg:w-32 shrink-0"/>
                  <img src="/images/pieces/aqua-4.png" className="scale-x-[-1] drop-shadow-md h-[24vh] lg:h-[32vh] w-auto object-contain" alt="ليقنز" />
                  <div className="flex items-center gap-1 ml-2 w-20 lg:w-32">
                    <svg className="w-3 h-3 lg:w-5 lg:h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M19 12l-7-7M19 12l-7 7"/></svg>
                    <span className="font-serif font-black italic text-[11px] lg:text-lg">ليقنز</span>
                  </div>
                </motion.div>

                {/* Coverups */}
                <motion.div initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center w-full gap-2 -mt-[8vh] lg:-mt-[12vh] relative z-40">
                  
                  {/* Short Coverup (Left Tag, points right ->) */}
                  <div className="flex items-center justify-end gap-1 w-14 lg:w-24 text-right">
                    <span className="font-serif font-black italic text-[9px] lg:text-sm leading-tight">تنوره<br/>قصيره</span>
                    <svg className="w-3 h-3 lg:w-4 lg:h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
                  </div>
                  
                  <img src="/images/pieces/aqua-3.png" className="scale-x-[-1] drop-shadow-md h-[22vh] lg:h-[30vh] w-auto object-contain" alt="تنوره قصيره" />
                  
                  <img src="/images/pieces/aqua-5.png" className="scale-x-[-1] drop-shadow-md h-[26vh] lg:h-[36vh] w-auto object-contain" alt="كاش مايو" />
                  
                  {/* Whole Coverup (Right Tag, points left <-) */}
                  <div className="flex items-center gap-1 w-14 lg:w-24 text-left">
                    <svg className="w-3 h-3 lg:w-4 lg:h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M19 12l-7-7M19 12l-7 7"/></svg>
                    <span className="font-serif font-black italic text-[9px] lg:text-sm leading-tight">كاش<br/>مايو</span>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Right/Bottom: Why you'll love it */}
            <div className="flex flex-col justify-center order-2 lg:order-2 w-full -mt-6 lg:-mt-10" dir="rtl">
               
               {/* 4 points in a 2x2 grid on mobile so they take up less vertical space */}
               <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-2 gap-y-4 px-2 w-full lg:px-0">
                {[
                  { title: "ما يلصق في الجسم.", text: "مصمم عشان يعطيك حريتك." },
                  { title: "راحة طول اليوم.", text: "قماش خفيف وما كأنك لابسة شي." },
                  { title: "حماية من الشمس.", text: "UPF 50+ منسوج في القماش." },
                  { title: "ينشف بسرعة.", text: "تقنية تجفيف سريعة تودعين الإحراج." }
                ].map((spec, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-start lg:items-end text-right w-full space-y-1" dir="rtl"
                  >
                    <div className="flex items-center gap-1.5 w-full">
                       <img 
                         src={selectedCollection === 'daydream' ? '/images/starfish-coral.png' : '/images/starfish-teal.png'}
                         className="w-4 h-4 lg:w-5 lg:h-5 shrink-0"
                         alt=""
                       />
                       <h4 className="font-serif font-black text-sm lg:text-xl text-[#000000] tracking-tight">{spec.title}</h4>
                    </div>
                     <p className="text-xs lg:text-sm font-bold text-[#5d4037] leading-tight italic break-words w-full">
                      {spec.text}
                    </p>
                  </motion.div>
                ))}
               </div>
            </div>

          </div>
        </section>

        {/* Section 4: The Final Chapter (Signup + Footer) */}
        <section id="details-section" className="snap-slide h-[100dvh] overflow-hidden px-4 lg:px-20 pt-6 pb-2 lg:pt-16 lg:pb-10 flex flex-col justify-center bg-[#fef8e1]">
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-3 lg:space-y-6">
            
            {/* Reviews Title */}
            <div className="space-y-0.5" dir="rtl">
              <p className="font-sans font-black uppercase text-[8px] lg:text-[9px] text-[#e5815c] font-kufi">آراء النجمات</p>
              <h2 className="text-xl lg:text-4xl font-serif font-black tracking-tighter leading-none font-kufi">نجمات موني</h2>
            </div>

            {/* Glowing Reviews (UGC Masonry Grid) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 w-full mt-1 lg:mt-4 pb-2 lg:pb-20" dir="rtl">
               {[
                 { img: "/images/daydream-1.jpeg", quote: "مرة حبيت الطقم، يجنن!", author: "سارة ج." },
                 { img: "/images/daydream-2.jpeg", quote: "أخيراً لقيت لبس سباحة ما يلصق في الجسم!", author: "لينا م." },
                 { img: "/images/daydream-3.jpeg", quote: "التوصيل كان مرة سريع!", author: "مريم أ." },
                 { img: "/images/daydream-4.jpeg", quote: "يستاهل كل ريال تدفعينه فيه.", author: "نوف ر." }
               ].map((review, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className={`relative group overflow-hidden rounded-2xl lg:rounded-3xl border-2 border-black aspect-square lg:aspect-auto lg:h-[40vh] ${i % 2 === 0 ? 'lg:-translate-y-4' : 'lg:translate-y-4'}`}
                 >
                   <img src={review.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="UGC" />
                   
                   {/* Gradient Overlay for Text Legibility */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                   
                   {/* Review Text */}
                   <div className="absolute bottom-0 left-0 w-full p-3 lg:p-5 flex flex-col justify-end h-full">
                     <div className="flex items-center space-x-0.5 space-x-reverse mb-1 lg:mb-2">
                       {[...Array(5)].map((_, i) => (
                         <svg key={i} className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 text-[#C0FF72]" fill="currentColor" viewBox="0 0 20 20">
                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                         </svg>
                       ))}
                     </div>
                     <p className="text-white font-serif font-black italic text-[11px] lg:text-lg leading-tight mb-1 lg:mb-2 font-kufi" dir="rtl">"{review.quote}"</p>
                     <p className="text-white/80 font-sans font-bold uppercase text-[8px] lg:text-[10px] font-kufi" dir="rtl">{review.author}</p>
                   </div>
                 </motion.div>
               ))}
            </div>

            <p className="text-[10px] lg:text-base font-serif font-black italic text-[#5d4037] mt-0 mb-0 font-kufi" dir="rtl">
              اطلبي اليوم ويوصلك في نفس اليوم داخل جدة.
            </p>
          </div>
          
          <div className="w-full pt-4 lg:pt-8">
            <Footer />
          </div>
          {/* Section 4 Ambient Starfish Overlay */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
            <motion.img src="/images/starfish-coral.png" className="absolute top-[10%] right-[3%] w-12 lg:w-20 pointer-events-none" animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
            <motion.img src="/images/starfish-teal.png" className="absolute bottom-[10%] left-[3%] w-16 lg:w-24 pointer-events-none" animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
            <motion.img src="/images/starfish-coral.png" className="absolute top-[45%] left-[1%] w-10 lg:w-16 pointer-events-none opacity-40" animate={{ x: [0, 15, 0], rotate: [0, 360] }} transition={{ x: { duration: 10, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 40, repeat: Infinity, ease: "linear" } }} />
            <motion.img src="/images/starfish-teal.png" className="absolute top-[15%] left-[8%] w-8 lg:w-12 pointer-events-none opacity-30" animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 5, repeat: Infinity }} />
            <motion.img src="/images/starfish-coral.png" className="absolute top-[80%] right-[6%] w-14 lg:w-22 pointer-events-none opacity-20" animate={{ x: [0, -30, 0], y: [0, 15, 0] }} transition={{ duration: 9, repeat: Infinity }} />
          </div>
        </section>
      </div>
    </div>
  );
}
