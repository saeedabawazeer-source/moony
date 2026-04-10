import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed w-full top-0 z-50 bg-[#EDE6D3] shadow-none border-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <img 
              src="/images/starfish-coral.png" 
              alt="Moony Starfish Logo" 
              className="w-10 h-10 group-hover:rotate-12 transition-transform duration-500"
            />
            <span className="text-3xl font-serif font-bold text-gray-900 tracking-tight">moony</span>
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
          <div className="flex items-center space-x-6">
            <motion.a 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href="/checkout" 
              className="group flex items-center justify-center w-12 h-12 rounded-full bg-white/50 hover:bg-white transition-all shadow-sm"
            >
              <i className="fas fa-shopping-bag text-gray-700 group-hover:text-teal transition-colors text-lg"></i>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
