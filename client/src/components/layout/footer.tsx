import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="py-6 lg:py-10 border-t border-[#5d4037]/10 relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/images/starfish-black.png" 
              alt="Moony Logo" 
              className="w-4 h-4"
            />
            <span className="text-lg font-serif font-black text-[#5d4037] tracking-tighter">moony</span>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-6 text-[#5d4037]">
            <a href="#" className="hover:text-[#e5815c] transition-colors"><i className="fab fa-instagram lg:text-lg"></i></a>
            <a href="#" className="hover:text-[#e5815c] transition-colors"><i className="fab fa-tiktok lg:text-lg"></i></a>
            <a href="https://wa.me/" className="hover:text-[#25D366] transition-colors"><i className="fab fa-whatsapp lg:text-lg"></i></a>
            <a href="mailto:hello@moonyswimwear.com" className="hover:text-[#e5815c] transition-colors"><i className="fas fa-envelope lg:text-lg"></i></a>
          </div>
          
          {/* Copyright */}
          <div className="text-[#5d4037]">
            <p className="text-[7px] font-black opacity-30 uppercase tracking-[0.2em]">
              &copy; 2024 Moony Boutique. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
