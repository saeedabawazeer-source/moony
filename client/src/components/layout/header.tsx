import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";

export default function Header() {
  const [location] = useLocation();
  const isArabic = location === "/ar";

  return (
    <div className="sticky top-6 lg:top-10 z-[60] w-full px-4 lg:px-8">
      <div className={`grid grid-cols-3 items-center max-w-7xl mx-auto ${isArabic ? 'flex-row-reverse' : ''}`}>
        
        {/* Left/Right: Language Toggle */}
        <motion.div 
          initial={{ x: isArabic ? 20 : -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`flex ${isArabic ? 'justify-end order-3' : 'justify-start'}`}
        >
          <Link href={isArabic ? "/" : "/ar"}>
            <a className="font-sans font-black text-xl lg:text-2xl text-[#5d4037] hover:text-[#e5815c] transition-all uppercase tracking-widest">
              {isArabic ? 'EN' : 'ع'}
            </a>
          </Link>
        </motion.div>

        {/* Center: Monolithic Brand Identity */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center justify-center space-y-1 lg:space-y-2 order-2"
        >
          <Link href={isArabic ? "/ar" : "/"}>
            <div className="flex items-center space-x-2 lg:space-x-3 cursor-pointer group">
              <img 
                src="/images/starfish-black.png" 
                alt="Moony Logo" 
                className="w-6 h-6 lg:w-9 lg:h-9 group-hover:rotate-45 transition-transform duration-700"
              />
              <span className="text-2xl lg:text-4xl font-serif font-black text-[#000000] tracking-tighter">moony</span>
            </div>
          </Link>
          <nav className={`hidden lg:flex space-x-6 ${isArabic ? 'space-x-reverse' : ''} text-[9px] font-black uppercase tracking-[0.25em] text-[#000000]/40`}>
            <a href="#" className="hover:text-[#e5815c]">{isArabic ? 'تسوق' : 'Shop'}</a>
            <a href="#" className="hover:text-[#e5815c]">{isArabic ? 'قصتنا' : 'Our Story'}</a>
            <a href="#" className="hover:text-[#e5815c]">{isArabic ? 'البوتيك' : 'Boutique'}</a>
          </nav>
        </motion.div>

        {/* Right/Left: Personal Bag */}
        <motion.div 
          initial={{ x: isArabic ? -20 : 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`flex ${isArabic ? 'justify-start order-1' : 'justify-end'}`}
        >
          <Link href="/checkout">
            <a className="text-[#5d4037] hover:text-[#e5815c] transition-all transform hover:scale-110">
              <i className="fas fa-shopping-bag text-xl lg:text-2xl"></i>
            </a>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
