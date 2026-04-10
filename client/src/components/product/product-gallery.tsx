import { useState } from "react";
import type { Product } from "@shared/schema";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev < product.images.length - 1 ? prev + 1 : 0
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : product.images.length - 1
    );
  };

  const selectThumbnail = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="h-full w-full relative group">
      {/* Main Image */}
      <div className="absolute inset-0 bg-white overflow-hidden">
        <img 
          src="/images/starfish-coral.png" 
          alt="Starfish accent" 
          className="hidden lg:block absolute top-6 left-6 w-10 h-10 z-10 opacity-80"
        />
        <img 
          src={product.images[currentImageIndex]} 
          alt={`${product.name} main view`} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        {/* Navigation arrows */}
        <button 
          className="absolute left-6 top-1/2 transform -translate-y-1/2 glass-panel hover:bg-white rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={previousImage}
        >
          <i className="fas fa-chevron-left text-gray-700"></i>
        </button>
        <button 
          className="absolute right-6 top-1/2 transform -translate-y-1/2 glass-panel hover:bg-white rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={nextImage}
        >
          <i className="fas fa-chevron-right text-gray-700"></i>
        </button>
      </div>
      
      {/* Thumbnail Overlay */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-white/20 backdrop-blur-md px-4 py-3 rounded-full border border-white/30 drop-shadow-xl z-20">
        {product.images.map((image, index) => (
          <div 
            key={index}
            className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden cursor-pointer border-[2px] transition-all duration-300 shadow-sm ${
              index === currentImageIndex ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
            }`}
            onClick={() => selectThumbnail(index)}
          >
            <img 
              src={image} 
              alt={`${product.name} thumbnail ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
