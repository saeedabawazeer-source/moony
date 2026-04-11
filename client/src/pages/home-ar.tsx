import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CheckoutOverlay from "@/components/product/checkout-overlay";
import { products as staticProducts, collections as staticCollections } from "@/data/products";
import type { Product, Collection } from "@shared/schema";

export default function HomeAR() {
  const [, setLocation] = useLocation();
  const [selectedCollection, setSelectedCollection] = useState("daydream");
  const [selectedSize, setSelectedSize] = useState("M");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 20;
    const velocityThreshold = 200;
    // In RTL, swipe directions might be inverted or the same depending on UX preference.
    // We'll keep them consistent with the logical "next/prev" flow.
    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      setCurrentImageIndex(prev => (prev + 1) % currentProduct.images.length);
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      setCurrentImageIndex(prev => (prev - 1 + currentProduct.images.length) % currentProduct.images.length);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-[#e5815c]" dir="rtl">
      {/* Global Grain Texture Overlay */}
      <div className="noise-overlay" />
      {/* Static Global Frame Border */}
      <div className="fixed-master-frame" />

      {/* Internal Scrollable Content with Snapping */}
      <div className="internal-scroll-area">
        
        {/* Section 1: The Brand */}
        <section className="snap-slide relative overflow-hidden">
          <Header />
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-grow flex flex-col justify-center items-center text-center px-4 lg:px-8 relative z-10"
          >
            <h1 className="text-6xl lg:text-[8rem] leading-[0.85] tracking-tighter mb-8 font-black">
              تمتعي <br />
              <span className="text-[#e5815c] italic">بالأناقة.</span>
            </h1>
            <div className="space-y-4 mb-12">
              <p className="font-sans font-black uppercase tracking-[0.4em] text-[10px] lg:text-sm opacity-40">
                بوتيك راقٍ للأزياء المحتشمة
              </p>
              <p className="font-serif font-black italic text-lg lg:text-3xl text-[#e5815c] tracking-tight">صُمم في جدة</p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToShop}
              className="px-10 py-5 rounded-full bg-[#6bb7b3] text-white font-black text-xs lg:text-sm uppercase tracking-[0.2em] shadow-2xl hover:brightness-110 transition-all duration-500"
            >
              تصفحي الموديلات
            </motion.button>
          </motion.div>
        </section>

        {/* Section 2: The Cinematic Shop */}
        <section id="boutique-shop" className="snap-slide h-[100dvh] flex flex-col pt-0 overflow-hidden">
          <div className="flex flex-col items-start w-full max-w-xl mx-auto h-full space-y-3 lg:space-y-4">
            
            {/* Gallery */}
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Selector */}
            <div className="w-full flex justify-center space-x-6 space-x-reverse pb-2 px-8 lg:px-0">
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
                        layoutId="activeStarAR"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#5d4037] rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="w-full space-y-1 lg:space-y-2 px-8 lg:px-0 text-right">
                <p className="font-sans font-black uppercase tracking-[0.4em] text-[8px] lg:text-[9px] text-[#e5815c]">
                  طقم مكون من 5 قطع
                </p>
                <h2 className="text-3xl lg:text-5xl font-serif font-black text-[#000000] tracking-tighter leading-none">
                  {currentProduct.name}
                </h2>
                <p className="text-xl lg:text-2xl font-black text-[#000000] pt-1 leading-none">{currentProduct.price} ريال</p>

              {/* Purchase Block */}
              <div className="w-full space-y-3 lg:space-y-4 pb-2">
                <div className="flex items-center justify-start gap-4 flex-row-reverse">
                  {/* Size Selector */}
                  <div className="flex gap-2 flex-row-reverse">
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

                  {/* Quantity */}
                  <div className="flex items-center flex-row-reverse bg-white/50 rounded-xl px-2 py-1 border-2 border-[#5d4037]/10 h-9 lg:h-14">
                    <button onClick={() => setQuantity(quantity + 1)} className="w-6 h-6 flex items-center justify-center font-black text-[#5d4037]">+</button>
                    <span className="px-3 font-black text-[10px] lg:text-sm text-[#5d4037] min-w-[1.5rem] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-6 h-6 flex items-center justify-center font-black text-[#5d4037]">-</button>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full pt-1">
                  <button className="flex-1 py-4 lg:py-6 rounded-full border-2 border-[#5d4037] text-[#5d4037] text-[10px] lg:text-sm font-black hover:bg-[#5d4037] hover:text-white transition-all uppercase tracking-widest leading-none">
                    أضف إلى السلة
                  </button>
                  <button 
                    onClick={handleCheckout}
                    className="flex-[2] btn-premium-gradient py-4 lg:py-6 text-[11px] lg:text-base font-black shadow-lg uppercase tracking-widest leading-none"
                  >
                    إتمام الشراء
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
                <p className="text-[7px] font-black tracking-[0.2em] uppercase mb-1">عرض تفاصيل القطعة</p>
                <i className="fas fa-chevron-down text-[8px]"></i>
              </motion.button>
            </div>
          </div>
        </section>

        {/* Section 2.5: Anatomy (RTL Mirrored) */}
        <section id="anatomy-section" className="snap-slide h-[100dvh] px-4 lg:px-20 py-4 lg:py-16 flex flex-col justify-center overflow-hidden bg-[#fef8e1]">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-20 items-center h-full">
            
            {/* Right: Why you'll love it (High-Impact Stats) - Mirrored To Right in RTL */}
            <div className="space-y-4 lg:space-y-12 flex flex-col justify-center text-right order-1 lg:order-2">
               <div className="space-y-1">
                  <p className="font-sans font-black uppercase tracking-[0.4em] text-[8px] lg:text-[10px] text-[#6bb7b3]">أداء عالي</p>
                  <h2 className="text-xl lg:text-5xl font-serif font-black tracking-tighter leading-tight">لماذا ستحبين موني؟</h2>
               </div>
               
               <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-10">
                {[
                  { title: "أناقة واحتشام ★", text: "تغطية كاملة مع أناقة لا تضاهى." },
                  { title: "راحة طوال اليوم ★", text: "أقمشة تسمح بمرور الهواء لأداء مريح." },
                  { title: "حماية من الشمس ★", text: "حماية مدمجة من الأشعة فوق البنفسجية." },
                  { title: "سريع الجفاف ★", text: "جاهز للمغامرة القادمة في وقت قياسي." }
                ].map((spec, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-0.5 lg:space-y-1"
                  >
                    <h4 className="font-serif font-black text-xs lg:text-2xl text-[#000000]">{spec.title}</h4>
                    <p className="text-[9px] lg:text-base font-bold opacity-40 leading-tight italic max-w-xs">
                      {spec.text}
                    </p>
                  </motion.div>
                ))}
               </div>
            </div>

            {/* Left: Pieces Cluster - Mirrored To Left in RTL */}
            <div className="relative h-[45vh] lg:h-[75vh] w-full flex items-center justify-center order-2 lg:order-1">
              <div className="relative w-full h-full max-w-lg mx-auto transform scale-[0.75] lg:scale-100">
                {/* 1. Turban */}
                <div className="absolute top-[2%] left-1/2 -translate-x-1/2 w-[30%] z-30">
                  <img src="/images/pieces/turban.png" className="w-full h-auto drop-shadow-xl" alt="Turban" />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute -top-4 -left-4 flex items-center space-x-1 flex-row-reverse"
                  >
                    <span className="font-serif font-black italic text-[11px] lg:text-sm text-[#000000]">توربان</span>
                    <svg className="w-6 h-6 scale-x-[-1]" viewBox="0 0 40 40" fill="none">
                      <path d="M2 38C15 30 25 15 38 2" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                </div>

                {/* 2. Top */}
                <div className="absolute top-[16%] right-[5%] w-[54%] z-20">
                  <img src="/images/pieces/top.png" className="w-full h-auto drop-shadow-xl" alt="Top" />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                    className="absolute top-4 -right-8 flex items-center space-x-1 flex-row-reverse"
                  >
                    <span className="font-serif font-black italic text-[11px] lg:text-sm text-[#000000]">بلوزة</span>
                    <svg className="w-6 h-6 scale-x-[-1]" viewBox="0 0 40 40" fill="none">
                      <path d="M38 38C25 30 15 15 2 2" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                </div>

                {/* 3. Leggings */}
                <div className="absolute top-[48%] left-[2%] w-[44%] z-10">
                  <img src="/images/pieces/leggings.png" className="w-full h-auto drop-shadow-2xl" alt="Leggings" />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
                    className="absolute bottom-4 -left-10 flex flex-col items-center"
                  >
                    <span className="font-serif font-black italic text-[11px] lg:text-sm text-[#000000]">ليجنز</span>
                    <svg className="w-6 h-6 rotate-90 scale-x-[-1]" viewBox="0 0 40 40" fill="none">
                      <path d="M2 2C15 10 25 25 38 38" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                </div>

                {/* 4. Short Coverup */}
                <div className="absolute bottom-[28%] right-[2%] w-[40%] z-40">
                  <img src="/images/pieces/short-coverup.png" className="w-full h-auto drop-shadow-xl" alt="Short Coverup" />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
                    className="absolute -bottom-4 -right-4 flex flex-col items-center"
                  >
                    <span className="font-serif font-black italic text-[10px] lg:text-[11px] text-[#000000] mb-0.5">كيمونو قصير</span>
                    <svg className="w-5 h-5 -rotate-[135deg] scale-x-[-1]" viewBox="0 0 40 40" fill="none">
                      <path d="M2 38C15 30 25 15 38 2" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                </div>

                {/* 5. Whole Coverup */}
                <div className="absolute bottom-[5%] left-[20%] w-[50%] z-10 opacity-90">
                  <img src="/images/pieces/whole-coverup.png" className="w-full h-auto drop-shadow-xl" alt="Whole Coverup" />
                   <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                    className="absolute bottom-0 lg:-bottom-2 left-8 lg:left-4 flex flex-col items-start"
                   >
                    <span className="font-serif font-black italic text-[11px] lg:text-sm text-[#000000] mb-0.5">كيمونو كامل</span>
                    <svg className="w-10 h-4 scale-x-[-1]" viewBox="0 0 60 20" fill="none">
                      <path d="M2 2C20 15 40 15 58 2" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Finale */}
        <section id="details-section" className="snap-slide px-4 lg:px-20 py-12 lg:py-24 flex flex-col justify-center overflow-hidden bg-white">
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-12 lg:space-y-20">
            
            {/* WhatsApp Newsletter Card */}
            <div className="w-full bg-[#fef8e1] p-12 lg:p-20 rounded-[4rem] border-2 border-[#5d4037]/5 space-y-10">
               <div className="space-y-4 lg:space-y-6">
                  <div className="flex justify-center space-x-3 text-[#e5815c] text-xl">
                    <span>★</span><span>★</span><span>★</span>
                  </div>
                  <h3 className="text-4xl lg:text-7xl font-serif font-black tracking-tighter italic">
                    دائرة موني المقربة
                  </h3>
                  <p className="text-xs lg:text-lg font-bold opacity-50 uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
                    اشتركي في نشرتنا عبر واتساب للحصول على خصم 10% إضافي على أول طقم لك.
                  </p>
               </div>

               <div className="flex flex-col items-center">
                 <a href="https://wa.me/" className="group flex items-center space-x-6 space-x-reverse bg-[#000000] text-white px-12 py-6 rounded-full hover:bg-[#25D366] transition-all transform hover:scale-105 shadow-2xl">
                    <i className="fab fa-whatsapp text-2xl lg:text-3xl"></i>
                    <span className="font-black uppercase tracking-widest text-sm lg:text-lg">اشتركي عبر واتساب</span>
                 </a>
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
        isArabic={true}
      />
    </div>
  );
}
