import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { motion } from "framer-motion";

export default function Success() {
  return (
    <div className="relative min-h-screen bg-[#fef8e1] selection:bg-[#6bb7b3] selection:text-white font-serif overflow-x-hidden flex flex-col">
      {/* Global Grain Texture Overlay */}
      <div className="noise-overlay" />
      {/* Static Global Frame Border */}
      <div className="fixed-master-frame" />

      {/* Ambient Starfish Overlay */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <motion.img src="/images/starfish-coral.png" className="absolute top-[10%] right-[5%] w-12 lg:w-20 pointer-events-none" animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
        <motion.img src="/images/starfish-teal.png" className="absolute top-[85%] left-[5%] w-16 lg:w-24 pointer-events-none" animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.img src="/images/starfish-coral.png" className="absolute top-[45%] left-[2%] w-10 lg:w-16 pointer-events-none opacity-40" animate={{ x: [0, 15, 0], rotate: [0, 360] }} transition={{ x: { duration: 10, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 40, repeat: Infinity, ease: "linear" } }} />
        <motion.img src="/images/starfish-teal.png" className="absolute top-[15%] left-[10%] w-8 lg:w-12 pointer-events-none opacity-30" animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 5, repeat: Infinity }} />
      </div>

      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 lg:py-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white p-8 lg:p-16 rounded-[2.5rem] lg:rounded-[3rem] border-[3px] border-black shadow-[6px_6px_0px_0px_#000] lg:shadow-[12px_12px_0px_0px_#000] max-w-xl w-full text-center space-y-6 lg:space-y-8 relative overflow-hidden"
        >
          {/* Decorative Corner Elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#C0FF72] rounded-full border-[3px] border-black opacity-50" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#e5815c] rounded-full border-[3px] border-black opacity-20" />

          <div className="relative w-24 h-24 lg:w-32 lg:h-32 bg-[#C0FF72] rounded-full border-[3px] border-black flex items-center justify-center mx-auto mb-4 lg:mb-8 shadow-[4px_4px_0px_0px_#000] transform -rotate-3">
            <svg className="w-12 h-12 lg:w-16 lg:h-16 text-black transform rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div className="space-y-2 relative">
            <p className="font-sans font-black uppercase tracking-[0.4em] text-[10px] lg:text-xs text-[#e5815c]">Order Confirmed</p>
            <h1 className="text-4xl lg:text-6xl font-serif font-black italic tracking-tighter leading-none text-[#000000]">
              You're in the club.
            </h1>
          </div>

          <p className="text-sm lg:text-xl font-bold text-[#5d4037] italic leading-snug max-w-md mx-auto relative">
            Your Moony pieces are officially secured. We're packing your order right now, and you'll get a tracking email the second it ships out.
          </p>
          
          <div className="pt-6 relative">
            <Link href="/">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full lg:w-auto bg-[#000000] text-[#fef8e1] px-10 py-5 rounded-full font-black uppercase tracking-widest text-[11px] lg:text-[13px] border-[2px] border-black shadow-[4px_4px_0px_0px_#C0FF72] hover:shadow-[2px_2px_0px_0px_#C0FF72] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Back to Boutique
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
