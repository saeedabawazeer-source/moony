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
                src="/images/starfish-coral.png" 
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
          
          {/* Social Links */}
          <div className="flex justify-center space-x-8 text-[#5d4037]">
            <motion.a whileHover={{ y: -5, color: '#ee786e' }} href="#" className="transition-all">
              <i className="fab fa-instagram text-2xl lg:text-3xl"></i>
            </motion.a>
            <motion.a whileHover={{ y: -5, color: '#ee786e' }} href="#" className="transition-all">
              <i className="fab fa-tiktok text-2xl lg:text-3xl"></i>
            </motion.a>
            <motion.a whileHover={{ y: -5, color: '#ee786e' }} href="#" className="transition-all">
              <i className="fab fa-pinterest text-2xl lg:text-3xl"></i>
            </motion.a>
          </div>
          
          {/* Contact */}
          <div className="space-y-4 md:text-right text-[#5d4037]">
            <p className="font-sans font-black uppercase tracking-widest text-[9px] opacity-40">Get in touch</p>
            <a href="mailto:hello@moonyswimwear.com" className="block text-xl font-serif italic hover:text-[#ee786e] transition-colors">
              hello@moonyswimwear.com
            </a>
            <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest leading-loose">
              &copy; 2024 Moony Boutique. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
