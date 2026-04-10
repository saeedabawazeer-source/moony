import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-[#ee786e] text-white py-16 border-t-[1.5px] border-[#5d4037]/10 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
          {/* Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-[#5d4037]/5">
                <img 
                  src="/images/starfish-coral.png" 
                  alt="Moony Logo" 
                  className="w-6 h-6"
                />
              </div>
              <span className="text-3xl font-serif font-black tracking-tighter">moony</span>
            </div>
            <p className="font-sans font-bold text-[10px] uppercase tracking-[0.2em] opacity-80 leading-loose">
              Positively Natural • Vegan <br />
              Hand-Packed with Love
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center space-x-8">
            <motion.a whileHover={{ y: -5 }} href="#" className="transition-transform">
              <i className="fab fa-instagram text-2xl lg:text-3xl"></i>
            </motion.a>
            <motion.a whileHover={{ y: -5 }} href="#" className="transition-transform">
              <i className="fab fa-tiktok text-2xl lg:text-3xl"></i>
            </motion.a>
            <motion.a whileHover={{ y: -5 }} href="#" className="transition-transform">
              <i className="fab fa-pinterest text-2xl lg:text-3xl"></i>
            </motion.a>
          </div>
          
          {/* Contact */}
          <div className="space-y-4 md:text-right">
            <p className="font-sans font-black uppercase tracking-widest text-[9px] opacity-60">Get in touch</p>
            <a href="mailto:hello@moonyswimwear.com" className="block text-xl font-serif italic hover:underline">
              hello@moonyswimwear.com
            </a>
            <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest leading-loose">
              &copy; 2024 Moony Boutique. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
