import { useState } from "react";
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
    setIsCheckoutOpen(true);
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
            <h1 className="text-6xl lg:text-[8.5rem] leading-[0.82] tracking-tighter mb-8 font-black">
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
        <section id="boutique-shop" className="snap-slide h-[100dvh] flex flex-col pt-0 overflow-hidden px-2 lg:px-8 bg-[#fef8e1]">
          <div className="flex flex-col items-start w-full max-w-4xl mx-auto h-full space-y-3 lg:space-y-6 pt-12">
            
            {/* 1. Swipeable Model Visual (Ultra Smooth Gallery) */}
            <motion.div 
              animate={{ y: [-6, 6, -6], rotate: [-0.5, 0.5, -0.5] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="w-full relative h-[60vh] lg:h-[80vh] overflow-hidden rounded-[2rem] lg:rounded-[3rem] shadow-2xl bg-[#fef8e1] border-[8px] lg:border-[10px] border-white"
            >
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
                          ? 'drop-shadow-[0_0_15px_rgba(229,129,92,0.4)] scale-110 grayscale-0 opacity-100' 
                          : 'grayscale-[80%] opacity-30 hover:opacity-60'
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
                
                <div className="flex gap-4 w-full pt-1">
                  <button className="flex-1 py-5 lg:py-8 rounded-full border-2 border-[#5d4037] text-[#5d4037] text-[10px] lg:text-sm font-black hover:bg-[#5d4037] hover:text-white transition-all uppercase tracking-widest leading-none">
                    ADD TO CART
                  </button>
                  <button 
                    onClick={handleCheckout}
                    className="flex-[2] btn-premium-gradient py-5 lg:py-8 text-xs lg:text-xl font-black shadow-lg uppercase tracking-widest leading-none"
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

        {/* Section 2.5: Anatomy */}
        <section id="anatomy-section" className="snap-slide h-[100dvh] px-4 lg:px-8 py-8 lg:py-16 flex flex-col justify-center overflow-hidden bg-[#fef8e1]">
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
                  { title: "Elegant & Modest", text: "Full coverage, unmatched elegance." },
                  { title: "All-Day Comfort", text: "Breathable fabric performance." },
                  { title: "Sun Protection", text: "Integrated UV shielding." },
                  { title: "Quick-Drying", text: "Ready for the next adventure." }
                ].map((spec, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-1 lg:space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                       <h4 className="font-serif font-black text-sm lg:text-3xl text-[#000000] tracking-tight">{spec.title}</h4>
                       <i className="fas fa-star text-[10px] lg:text-sm text-[#e5815c]"></i>
                    </div>
                    <p className="text-[10px] lg:text-lg font-bold opacity-60 leading-tight italic max-w-sm">
                      {spec.text}
                    </p>
                  </motion.div>
                ))}
               </div>
            </div>
          </div>
        </section>

        {/* Section 3: The Final Chapter (Signup + Footer) */}
        <section id="details-section" className="snap-slide px-4 lg:px-20 py-12 lg:py-24 flex flex-col justify-center overflow-hidden bg-[#fef8e1]">
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-10 lg:space-y-16">
            
            {/* Glowing Reviews (Social Proof) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 w-full lg:px-20">
               {[
                 { text: "The perfect balance of elegance and modesty. I feel amazing in it!", author: "Sarah J." },
                 { text: "Fastest delivery I've ever had in Jeddah. The quality is unmatched.", author: "Lina M." },
                 { text: "Finally, a swimwear brand that understands my needs. ★★★★★", author: "Mariam A." }
               ].map((review, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="space-y-2 text-center lg:text-left"
                 >
                   <p className="text-[11px] lg:text-sm font-bold italic opacity-60 leading-relaxed">"{review.text}"</p>
                   <p className="text-[9px] font-black uppercase tracking-widest text-[#e5815c]">— {review.author}</p>
                 </motion.div>
               ))}
            </div>

            {/* WhatsApp Newsletter Card (Slim 2-bar Pill) */}
            <div className="w-full bg-white p-6 lg:p-10 rounded-[2.5rem] lg:rounded-full border-2 border-[#5d4037]/5 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6 shadow-xl">
               <div className="text-center lg:text-left space-y-0.5">
                  <h3 className="text-2xl lg:text-4xl font-serif font-black tracking-tighter italic leading-none">
                    Moony Inner Circle
                  </h3>
                  <p className="text-[9px] lg:text-[11px] font-black text-[#e5815c] uppercase tracking-widest leading-none">
                    Subscibe for an extra 10% off
                  </p>
               </div>

               <div className="flex flex-col items-center lg:items-end w-full lg:w-auto space-y-4">
                 <form className="flex w-full lg:w-[420px] items-center bg-[#fef8e1]/50 rounded-full p-1.5 border-2 border-[#5d4037]/10 group focus-within:border-[#e5815c]/30 transition-all">
                   <div className="pl-4 pr-2 border-r border-[#5d4037]/10 text-[10px] lg:text-xs font-black opacity-40">
                      +966
                   </div>
                   <input 
                     type="tel" 
                     placeholder="5XXXXXXXX"
                     className="flex-1 bg-transparent px-3 py-2 outline-none font-sans font-bold text-xs lg:text-base placeholder:opacity-30 min-w-0"
                   />
                   <button className="flex-shrink-0 bg-[#000000] text-white px-6 lg:px-10 py-3 rounded-full font-black uppercase tracking-widest text-[9px] lg:text-xs hover:bg-[#25D366] transition-all shadow-lg active:scale-95">
                      JOIN
                   </button>
                 </form>
                 <p className="hidden lg:block text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
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
