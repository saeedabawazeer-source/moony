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
    <div className="space-y-8">
      {/* Product Header */}
      <div className="flex items-center space-x-3 mb-4">
        <img 
          src={collection.icon} 
          alt="Starfish accent" 
          className="w-6 h-6"
        />
        <h2 className={`text-3xl lg:text-5xl font-serif font-bold ${collection.color === 'coral' ? 'text-coral' : 'text-teal'}`}>
          {product.name}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-4xl font-bold text-gray-900">SAR {product.price}</span>
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase ${collection.color === 'coral' ? 'bg-coral-light text-coral' : 'bg-teal-light text-teal'}`}>
          Complete Set
        </span>
      </div>

      {/* Set Includes */}
      <div className="bg-white/40 p-6 rounded-[2rem] border border-white/60">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Set Includes:</h3>
        <ul className="grid grid-cols-2 gap-3">
          {product.includes.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${collection.color === 'coral' ? 'bg-coral' : 'bg-teal'}`}></span>
              <span className="text-gray-800 font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Size Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Size</h3>
        <div className="flex space-x-3">
          {product.sizes.map((size) => (
            <button 
              key={size}
              className={`w-14 h-14 border-[3px] rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex items-center justify-center ${
                selectedSize === size 
                  ? collection.color === 'coral' ? 'border-coral bg-coral text-white shadow-md' : 'border-teal bg-teal text-white shadow-md'
                  : collection.color === 'coral' ? 'border-coral/20 text-gray-700 bg-white hover:border-coral hover:text-coral' : 'border-teal/20 text-gray-700 bg-white hover:border-teal hover:text-teal'
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity & Order Actions */}
      <div className="flex flex-col sm:flex-row gap-6 pt-4">
        <div className="flex items-center space-x-4 glass-panel px-6 py-2 rounded-2xl border border-white/50 w-full sm:w-auto justify-center">
          <button 
            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-${collection.color}/10 transition-colors cursor-pointer`}
            onClick={decreaseQuantity}
          >
            <i className={`fas fa-minus ${collection.color === 'coral' ? 'text-coral' : 'text-teal'}`}></i>
          </button>
          <span className="text-2xl font-bold w-8 text-center">{quantity}</span>
          <button 
            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-${collection.color}/10 transition-colors cursor-pointer`}
            onClick={increaseQuantity}
          >
            <i className={`fas fa-plus ${collection.color === 'coral' ? 'text-coral' : 'text-teal'}`}></i>
          </button>
        </div>

        <Button 
          onClick={handleBuyNow}
          className={`flex-1 rounded-[1.5rem] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
            collection.color === 'coral' ? 'bg-gradient-to-r from-coral to-[#ff5252]' : 'bg-gradient-to-r from-teal to-[#22a699]'
          } text-white text-xl py-8 font-serif font-bold tracking-wide`}
        >
          <i className="fas fa-lock mr-3 opacity-70"></i>
          Secure Checkout
        </Button>
      </div>
    </div>
  );
}
