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
    <div className="space-y-6">
      {/* Main Image */}
      <div className="relative bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] overflow-hidden group">
        <img 
          src="/images/starfish-coral.png" 
          alt="Starfish accent" 
          className="absolute top-6 left-6 w-10 h-10 z-10 opacity-80"
        />
        <img 
          src={product.images[currentImageIndex]} 
          alt={`${product.name} main view`} 
          className="w-full h-96 lg:h-[500px] object-cover"
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
      
      {/* Thumbnail Images */}
      <div className="grid grid-cols-4 gap-3">
        {product.images.map((image, index) => (
          <img 
            key={index}
            src={image} 
            alt={`${product.name} thumbnail ${index + 1}`} 
            className={`w-full h-24 object-cover rounded-2xl cursor-pointer border-[3px] shadow-sm transition-all duration-300 hover:shadow-md ${
              index === currentImageIndex ? 'border-teal opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100 hover:border-teal/50'
            }`}
            onClick={() => selectThumbnail(index)}
          />
        ))}
      </div>
    </div>
  );
}
