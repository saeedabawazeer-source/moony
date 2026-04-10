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
      {/* Main Image Container */}
      <div className="relative bg-[#EDE6D3] rounded-2xl shadow-sm overflow-hidden h-[30vh] lg:h-[600px] group transition-all duration-500">
        
        {/* Loading Skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-[#EAE4D3] animate-pulse flex items-center justify-center">
            <img src="/images/starfish-black.png" className="w-12 h-12 opacity-10" alt="Loading..." />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.img 
            key={`${product.id}-${currentImageIndex}`}
            src={product.images[currentImageIndex]} 
            alt={`${product.name} view`} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onLoad={() => setIsLoaded(true)}
            fetchpriority="high"
            loading="eager"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        </AnimatePresence>

        {/* The Star (Starfish Toggle) */}
        <motion.img 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          whileTap={{ scale: 0.9 }}
          src={product.collection === 'daydream' ? "/images/starfish-coral.png" : "/images/starfish-teal.png"}
          alt="Starfish collection toggle" 
          className="absolute top-4 left-4 lg:top-8 lg:left-8 w-8 h-8 lg:w-12 lg:h-12 z-20 cursor-pointer drop-shadow-md"
          onClick={onStarClick}
        />

        {/* Navigation arrows */}
        <div className="absolute inset-x-4 lg:inset-x-6 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none z-20">
          <button 
            className="pointer-events-auto bg-white/20 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-full w-8 h-8 lg:w-12 lg:h-12 flex items-center justify-center opacity-0 lg:group-hover:opacity-100 transition-all duration-300 border border-white/30"
            onClick={previousImage}
          >
            <i className="fas fa-chevron-left text-xs lg:text-base"></i>
          </button>
          <button 
            className="pointer-events-auto bg-white/20 backdrop-blur-md hover:bg-white/40 text-gray-900 rounded-full w-8 h-8 lg:w-12 lg:h-12 flex items-center justify-center opacity-0 lg:group-hover:opacity-100 transition-all duration-300 border border-white/30"
            onClick={nextImage}
          >
            <i className="fas fa-chevron-right text-xs lg:text-base"></i>
          </button>
        </div>
      </div>
      
      {/* Thumbnail Grid - Hidden on mobile to save space */}
      <div className="hidden lg:grid grid-cols-4 gap-4 px-2">
        {product.images.map((image, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
              index === currentImageIndex ? 'border-gray-900 shadow-md scale-100' : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-300'
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
