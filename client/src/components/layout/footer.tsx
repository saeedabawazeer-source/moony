import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="py-6 lg:py-10 border-t border-[#5d4037]/10 relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-center text-center md:text-left">
          {/* Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <img 
                src="/images/starfish-black.png" 
                alt="Moony Logo" 
                className="w-6 h-6 lg:w-8 lg:h-8"
              />
              <span className="text-2xl lg:text-3xl font-serif font-black text-[#5d4037] tracking-tighter">moony</span>
            </div>
            <p className="font-sans font-bold text-[10px] uppercase tracking-[0.2em] text-[#5d4037]/60 leading-loose">
              Positively Natural • Vegan <br />
              Hand-Packed with Love
            </p>
          </div>
          
          {/* Social Links & Contact Icons */}
          <div className="flex justify-center space-x-8 text-[#5d4037]">
            <motion.a whileHover={{ y: -5, scale: 1.1 }} href="#" className="transition-all hover:text-[#e5815c]" title="Instagram">
              <i className="fab fa-instagram text-2xl lg:text-3xl"></i>
            </motion.a>
            <motion.a whileHover={{ y: -5, scale: 1.1 }} href="#" className="transition-all hover:text-[#e5815c]" title="TikTok">
              <i className="fab fa-tiktok text-2xl lg:text-3xl"></i>
            </motion.a>
            <motion.a whileHover={{ y: -5, scale: 1.1 }} href="https://wa.me/" className="transition-all hover:text-[#25D366]" title="WhatsApp">
              <i className="fab fa-whatsapp text-2xl lg:text-3xl"></i>
            </motion.a>
            <motion.a whileHover={{ y: -5, scale: 1.1 }} href="mailto:hello@moonyswimwear.com" className="transition-all hover:text-[#e5815c]" title="Email">
              <i className="fas fa-envelope text-2xl lg:text-3xl"></i>
            </motion.a>
          </div>
          
          {/* Copyright Information */}
          <div className="space-y-4 md:text-right text-[#5d4037]">
            <p className="text-[9px] font-bold opacity-30 uppercase tracking-[0.3em] leading-loose">
              &copy; 2024 Moony Boutique. All rights reserved. <br className="hidden lg:block" />
              Positively Natural • Vegan
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
