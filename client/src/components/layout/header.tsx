import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";

export default function Header() {
  const [location] = useLocation();
  const isArabic = location === "/ar";

  return (
    <div className="sticky top-6 lg:top-10 z-[60] w-full px-6 lg:px-10" dir="ltr">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Left: Logo (always LTR, always English font) */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Link href={isArabic ? "/ar" : "/"}>
            <div className="flex items-center space-x-2 lg:space-x-3 cursor-pointer group">
              <img 
                src="/images/starfish-black.png" 
                alt="Moony Logo" 
                className="w-6 h-6 lg:w-9 lg:h-9 group-hover:rotate-45 transition-transform duration-700"
              />
              <span
                className="text-2xl lg:text-4xl font-black text-[#000000] tracking-tighter"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', serif" }}
              >
                moony
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Right: Lang toggle only */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center space-x-4 lg:space-x-6"
        >
          <Link href={isArabic ? "/" : "/ar"}>
            <a className="font-sans font-black text-lg lg:text-xl text-[#5d4037] hover:text-[#e5815c] transition-all uppercase tracking-widest">
              {isArabic ? "EN" : "ع"}
            </a>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
