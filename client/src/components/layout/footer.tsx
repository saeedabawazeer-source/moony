import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="py-2 lg:py-4 border-t border-[#5d4037]/10 relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-1">
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
            <a href="https://instagram.com/moonyswimwear" target="_blank" rel="noopener noreferrer" className="hover:text-[#e5815c] transition-colors"><i className="fab fa-instagram lg:text-lg"></i></a>
            <a href="https://tiktok.com/@moonyswimwear" target="_blank" rel="noopener noreferrer" className="hover:text-[#e5815c] transition-colors"><i className="fab fa-tiktok lg:text-lg"></i></a>
            <a href="https://wa.me/?text=Hi%20Moony!" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors"><i className="fab fa-whatsapp lg:text-lg"></i></a>
          </div>

          {/* Policy Links + Copyright */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="flex items-center gap-3 text-[9px] font-bold text-[#5d4037]/40">
              <Link href="/policies#refund" className="hover:text-[#e5815c] transition-colors">Refund Policy</Link>
              <span>·</span>
              <Link href="/policies#terms" className="hover:text-[#e5815c] transition-colors">Terms</Link>
              <span>·</span>
              <Link href="/policies#privacy" className="hover:text-[#e5815c] transition-colors">Privacy</Link>
            </div>
            <p className="text-[7px] font-black opacity-30 uppercase tracking-[0.2em] text-[#5d4037]">
              &copy; 2025 Moony Boutique. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
