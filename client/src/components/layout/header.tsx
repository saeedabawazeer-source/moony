import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-[#a2ccb6] border-b-[1.5px] border-[#5d4037]/10 w-full"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 lg:h-16">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#5d4037]/5">
              <img 
                src="/images/starfish-coral.png" 
                alt="Moony Logo" 
                className="w-5 h-5 lg:w-6 lg:h-6 group-hover:rotate-12 transition-transform"
              />
            </div>
            <span className="text-xl lg:text-3xl font-serif font-black text-[#5d4037] tracking-tighter">moony</span>
          </motion.div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8 lg:space-x-12">
            {['Shop', 'Our Story', 'Boutique', 'Contact'].map((item) => (
              <a 
                key={item} 
                href="#"
                className="text-[#5d4037] font-bold text-xs lg:text-sm tracking-wide uppercase hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
          
          {/* Shopping Bag */}
          <div className="flex items-center space-x-4">
            <motion.a 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href="/checkout" 
              className="flex items-center justify-center w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-white text-[#5d4037] border border-[#5d4037]/10 shadow-sm"
            >
              <i className="fas fa-shopping-bag text-sm lg:text-lg"></i>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
