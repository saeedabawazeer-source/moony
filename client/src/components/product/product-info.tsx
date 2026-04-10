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
    <div className="space-y-8 lg:space-y-12 text-[#5d4037]">
      {/* Product Header */}
      <div className="space-y-4">
        <p className="font-sans font-black uppercase tracking-[0.4em] text-[10px] lg:text-xs opacity-40">The Signature Piece</p>
        <h2 className="text-5xl lg:text-8xl font-serif font-black leading-[0.85] tracking-tighter">
          {product.name}
        </h2>
      </div>
      
      <div className="flex items-baseline space-x-6">
        <span className="text-4xl lg:text-5xl font-black">SAR {product.price}</span>
        <div className={`px-5 py-2 rounded-full text-[10px] lg:text-xs font-black tracking-widest uppercase flex items-center border-[1.5px] ${collection.color === 'coral' ? 'bg-[#e5815c] text-white border-[#e5815c]' : 'bg-[#6bb7b3] text-white border-[#6bb7b3]'}`}>
          Complete 5-Piece Experience
        </div>
      </div> 

      {/* Size Selection */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-[#5d4037]/30 uppercase tracking-[0.3em]">Personal Size</h3>
        <div className="flex flex-wrap gap-4">
          {product.sizes.map((size) => (
            <button 
              key={size}
              className={`w-14 h-14 lg:w-20 lg:h-20 border-[2px] rounded-3xl font-black text-xl lg:text-2xl transition-all duration-500 flex items-center justify-center ${
                selectedSize === size 
                  ? 'border-[#5d4037] bg-[#5d4037] text-white shadow-2xl scale-110'
                  : 'border-[#5d4037]/10 text-[#5d4037]/40 bg-white/20 hover:border-[#5d4037]'
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-8">
        <Button 
          onClick={handleBuyNow}
          className="btn-premium-gradient w-full px-12 py-8 lg:py-12 text-xl lg:text-3xl font-black shadow-2xl"
        >
          Secure Checkout
        </Button>
      </div>
    </div>
  );
}
