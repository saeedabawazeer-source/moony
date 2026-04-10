import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import type { Product, Collection } from "@shared/schema";

interface ProductInfoProps {
  product: Product;
  collection: Collection;
}

export default function ProductInfo({ product, collection }: ProductInfoProps) {
  const [, setLocation] = useLocation();
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleBuyNow = () => {
    localStorage.setItem('moony_cart', JSON.stringify({ 
      product: product.id, 
      size: selectedSize, 
      quantity 
    }));
    setLocation('/checkout');
  };

  return (
    <div className="space-y-6 lg:space-y-8 text-[#5d4037]">
      {/* Product Header */}
      <div className="space-y-1">
        <p className="font-sans font-black uppercase tracking-[0.3em] text-[10px] opacity-60">Hand-Picked Selection</p>
        <h2 className="text-4xl lg:text-6xl font-serif font-black leading-tight tracking-tighter">
          {product.name}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-3xl lg:text-4xl font-black">SAR {product.price}</span>
        <div className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center shadow-sm border border-[#5d4037]/10 ${collection.color === 'coral' ? 'bg-[#ee786e] text-white' : 'bg-[#a2ccb6] text-white'}`}>
          <i className="fas fa-sparkles mr-2 animate-pulse"></i>
          5-Piece Set
        </div>
      </div> 

      {/* Boutique Details */}
      <div className="bg-[#ffecd9]/50 p-5 rounded-[2rem] border border-[#5d4037]/5">
        <h3 className="text-[10px] font-black text-[#5d4037]/40 uppercase tracking-[0.2em] mb-4 flex items-center">
          <i className="fas fa-box-open mr-2"></i>
          Included in the Box
        </h3>
        <ul className="grid grid-cols-2 gap-3">
          {product.includes.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${collection.color === 'coral' ? 'bg-[#ee786e]' : 'bg-[#a2ccb6]'}`}></div>
              <span className="text-xs lg:text-sm font-bold opacity-80">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Size Selection */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-[#5d4037]/40 uppercase tracking-[0.2em]">Select Your Fit</h3>
        <div className="flex flex-wrap gap-3">
          {product.sizes.map((size) => (
            <button 
              key={size}
              className={`w-12 h-12 lg:w-14 lg:h-14 border-[1.5px] rounded-2xl font-black text-lg transition-all duration-300 flex items-center justify-center ${
                selectedSize === size 
                  ? 'border-[#5d4037] bg-[#5d4037] text-white shadow-xl scale-110'
                  : 'border-[#5d4037]/10 text-[#5d4037]/60 bg-white hover:border-[#5d4037]/40 hover:text-[#5d4037]'
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button 
          onClick={handleBuyNow}
          className="btn-premium-gradient flex-1 px-8 py-6 lg:py-8 text-lg lg:text-xl font-black shadow-2xl"
        >
          Secure Checkout
        </Button>
      </div>
    </div>
  );
}
