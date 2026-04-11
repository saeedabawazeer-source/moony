import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="py-6 lg:py-10 border-t border-[#5d4037]/10 relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12 items-center text-center">
          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <img 
              src="/images/starfish-black.png" 
              alt="Moony Logo" 
              className="w-5 h-5"
            />
            <span className="text-xl lg:text-2xl font-serif font-black text-[#5d4037] tracking-tighter">moony</span>
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center space-x-8 text-[#5d4037]">
            <motion.a whileHover={{ y: -3, scale: 1.1 }} href="#" className="transition-all hover:text-[#e5815c]">
              <i className="fab fa-instagram text-xl lg:text-2xl"></i>
            </motion.a>
            <motion.a whileHover={{ y: -3, scale: 1.1 }} href="#" className="transition-all hover:text-[#e5815c]">
              <i className="fab fa-tiktok text-xl lg:text-2xl"></i>
            </motion.a>
            <motion.a whileHover={{ y: -3, scale: 1.1 }} href="https://wa.me/" className="transition-all hover:text-[#25D366]">
              <i className="fab fa-whatsapp text-xl lg:text-2xl"></i>
            </motion.a>
            <motion.a whileHover={{ y: -3, scale: 1.1 }} href="mailto:hello@moonyswimwear.com" className="transition-all hover:text-[#e5815c]">
              <i className="fas fa-envelope text-xl lg:text-2xl"></i>
            </motion.a>
          </div>
          
          {/* Copyright */}
          <div className="md:text-right text-[#5d4037]">
            <p className="text-[8px] font-bold opacity-30 uppercase tracking-[0.2em]">
              &copy; 2024 Moony Boutique. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
