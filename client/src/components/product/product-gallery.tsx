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
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
        <img 
          src="https://v0-moony.vercel.app/images/starfish-coral.png" 
          alt="Starfish accent" 
          className="absolute top-4 left-4 w-8 h-8 z-10"
        />
        <img 
          src={product.images[currentImageIndex]} 
          alt={`${product.name} main view`} 
          className="w-full h-96 lg:h-[500px] object-cover"
        />
        {/* Navigation arrows */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
          onClick={previousImage}
        >
          <i className="fas fa-chevron-left text-gray-700"></i>
        </button>
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
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
            className={`w-full h-20 object-cover rounded-lg cursor-pointer border-2 shadow-sm transition-colors ${
              index === currentImageIndex ? 'border-coral' : 'border-transparent hover:border-coral'
            }`}
            onClick={() => selectThumbnail(index)}
          />
        ))}
      </div>
    </div>
  );
}
