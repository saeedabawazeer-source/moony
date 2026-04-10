import { motion } from "framer-motion";

export default function Header() {
  return (
    <div className="sticky top-6 lg:top-10 z-[60] w-full px-4 lg:px-8">
      <div className="grid grid-cols-3 items-center max-w-7xl mx-auto">
        
        {/* Left: Arabic Language Toggle */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex justify-start"
        >
          <a href="#" className="font-sans font-black text-xl lg:text-2xl text-[#5d4037] hover:text-[#e5815c] transition-all uppercase tracking-widest">
            ع
          </a>
        </motion.div>

        {/* Center: Monolithic Brand Identity */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center justify-center space-y-1 lg:space-y-2"
        >
          <div className="flex items-center space-x-2 lg:space-x-3 cursor-pointer group">
            <img 
              src="/images/starfish-black.png" 
              alt="Moony Logo" 
              className="w-6 h-6 lg:w-9 lg:h-9 group-hover:rotate-45 transition-transform duration-700"
            />
            <span className="text-2xl lg:text-4xl font-serif font-black text-[#000000] tracking-tighter">moony</span>
          </div>
          <nav className="hidden lg:flex space-x-6 text-[9px] font-black uppercase tracking-[0.25em] text-[#000000]/40">
            <a href="#" className="hover:text-[#e5815c]">Shop</a>
            <a href="#" className="hover:text-[#e5815c]">Our Story</a>
            <a href="#" className="hover:text-[#e5815c]">Boutique</a>
          </nav>
        </motion.div>

        {/* Right: Personal Bag */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex justify-end"
        >
          <a href="/checkout" className="text-[#5d4037] hover:text-[#e5815c] transition-all transform hover:scale-110">
            <i className="fas fa-shopping-bag text-xl lg:text-2xl"></i>
          </a>
        </motion.div>

      </div>
    </div>
  );
}
