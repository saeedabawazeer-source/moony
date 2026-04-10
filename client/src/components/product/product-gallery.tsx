import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@shared/schema";

interface ProductGalleryProps {
  product: Product;
  onStarClick?: () => void;
}

export default function ProductGallery({ product, onStarClick }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset loading state and index when product changes
  useEffect(() => {
    setIsLoaded(false);
    setCurrentImageIndex(0);
  }, [product.id]);

  const nextImage = () => {
    setIsLoaded(false);
    setCurrentImageIndex((prev) => 
      prev < product.images.length - 1 ? prev + 1 : 0
    );
  };

  const previousImage = () => {
    setIsLoaded(false);
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : product.images.length - 1
    );
  };

  const selectThumbnail = (index: number) => {
    if (index !== currentImageIndex) {
      setIsLoaded(false);
      setCurrentImageIndex(index);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Container - The Boutique Frame */}
      <div className="relative bg-[#EDE6D3] rounded-[2.5rem] lg:rounded-[3rem] border-[1.5px] border-[#5d4037]/10 shadow-[0_12px_45px_-15px_rgba(93,64,55,0.15)] overflow-hidden h-[35vh] lg:h-[70vh] lg:max-h-[800px] group transition-all duration-700">
        
        {/* Loading Skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-[#fceeb5] animate-pulse flex items-center justify-center">
            <img src="/images/starfish-black.png" className="w-12 h-12 opacity-15 animate-spin-slow" alt="Loading..." />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.img 
            key={`${product.id}-${currentImageIndex}`}
            src={product.images[currentImageIndex]} 
            alt={`${product.name} view`} 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            onLoad={() => setIsLoaded(true)}
            fetchpriority="high"
            loading="eager"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        </AnimatePresence>

        {/* Floating Starfish Toggle */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={onStarClick}
          className="absolute top-4 left-4 lg:top-8 lg:left-8 z-20 cursor-pointer bg-white/90 backdrop-blur-md p-2 lg:p-3 rounded-2xl shadow-lg border border-[#5d4037]/5 group/star"
        >
          <img 
            src="/images/starfish-black.png"
            alt="Toggle collection" 
            className="w-6 h-6 lg:w-9 lg:h-9 drop-shadow-sm group-hover/star:rotate-12 transition-transform"
          />
        </motion.div>

        {/* Navigation arrows - Boutique Minimalist */}
        <div className="absolute inset-x-4 lg:inset-x-8 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none z-20">
          <button 
            className="pointer-events-auto bg-white/90 backdrop-blur-md hover:bg-white text-[#5d4037] rounded-full w-9 h-9 lg:w-12 lg:h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-[#5d4037]/10 boutique-shadow"
            onClick={previousImage}
          >
            <i className="fas fa-chevron-left text-xs lg:text-sm"></i>
          </button>
          <button 
            className="pointer-events-auto bg-white/90 backdrop-blur-md hover:bg-white text-[#5d4037] rounded-full w-9 h-9 lg:w-12 lg:h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-[#5d4037]/10 boutique-shadow"
            onClick={nextImage}
          >
            <i className="fas fa-chevron-right text-xs lg:text-sm"></i>
          </button>
        </div>
      </div>
      
      {/* Thumbnail Grid - Boutique Style */}
      <div className="flex justify-center gap-3 lg:gap-4 px-2">
        {product.images.map((image, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            className={`relative w-16 h-16 lg:w-24 lg:h-24 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-500 boutique-shadow ${
              index === currentImageIndex ? 'border-[#ee786e] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            onClick={() => selectThumbnail(index)}
          >
            <img 
              src={image} 
              alt={`${product.name} thumb ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
