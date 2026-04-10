import { motion } from "framer-motion";

export default function Header() {
  return (
    <div className="sticky top-6 lg:top-10 z-[60] w-full px-4 lg:px-8">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        
        {/* Logo (No Pill) */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center space-x-2 cursor-pointer group z-50"
        >
          <div className="flex items-center space-x-2 cursor-pointer group">
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-[#ee786e]/10 rounded-full flex items-center justify-center border border-[#ee786e]/20">
              <img 
                src="/images/starfish-coral.png" 
                alt="Moony Logo" 
                className="w-5 h-5 lg:w-6 lg:h-6 group-hover:rotate-12 transition-transform"
              />
            </div>
            <span className="text-xl lg:text-3xl font-serif font-black text-[#5d4037] tracking-tighter">moony</span>
          </div>
        </motion.div>

        {/* Navigation Pill (The Meow Meow Centerpiece) */}
        <motion.nav 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="hidden md:flex floating-pill space-x-8 lg:space-x-10"
        >
          {['Shop', 'Our Story', 'Boutique', 'Contact'].map((item) => (
            <a 
              key={item} 
              href="#"
              className="text-[#5d4037] font-bold text-xs lg:text-sm tracking-wide uppercase hover:text-[#ee786e] transition-colors"
            >
              {item}
            </a>
          ))}
        </motion.nav>

        {/* Shopping Pill */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="floating-pill !px-3 !py-3 lg:!px-4 lg:!py-4"
        >
          <a href="/checkout" className="text-[#5d4037] hover:text-[#ee786e] transition-colors">
            <i className="fas fa-shopping-bag text-lg lg:text-xl"></i>
          </a>
        </motion.div>

      </div>
    </div>
  );
}
