import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed w-full top-0 z-50 bg-[#EDE6D3] shadow-none border-none lg:bg-[#EDE6D3]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-10 lg:h-20">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-2 lg:space-x-3 cursor-pointer group"
          >
            <img 
              src="/images/starfish-coral.png" 
              alt="Moony Starfish Logo" 
              className="w-5 h-5 lg:w-10 lg:h-10 group-hover:rotate-12 transition-transform duration-500"
            />
            <span className="hidden lg:block text-2xl lg:text-3xl font-serif font-bold text-gray-900 tracking-tight">moony</span>
          </motion.div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-12">
            {['Home', 'Collections', 'About', 'Contact'].map((item, idx) => (
              <motion.a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className="relative text-gray-800 font-medium text-xs tracking-[0.2em] uppercase group hover:text-teal transition-colors"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal transition-all duration-500 group-hover:w-full"></span>
              </motion.a>
            ))}
          </nav>
          
          {/* Shopping Bag */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            <motion.a 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href="/checkout" 
              className="group flex items-center justify-center w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-white/50 hover:bg-white transition-all shadow-sm"
            >
              <i className="fas fa-shopping-bag text-gray-700 group-hover:text-teal transition-colors text-[10px] lg:text-lg"></i>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
