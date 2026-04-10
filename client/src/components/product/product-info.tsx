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
      <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#EAE6E1]">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Set Includes</h3>
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
              className={`w-14 h-14 border-[2px] rounded-xl font-medium text-lg transition-all duration-300 flex items-center justify-center ${
                selectedSize === size 
                  ? 'border-gray-900 bg-gray-900 text-white shadow-md'
                  : 'border-gray-200 text-gray-600 bg-white hover:border-gray-900 hover:text-gray-900'
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity & Order Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <div className="flex items-center space-x-4 bg-white px-4 py-2 rounded-xl border border-gray-200 w-full sm:w-auto justify-center shadow-sm">
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer text-gray-500 hover:text-gray-900"
            onClick={decreaseQuantity}
          >
            <i className="fas fa-minus"></i>
          </button>
          <span className="text-xl font-semibold w-8 text-center text-gray-900">{quantity}</span>
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer text-gray-500 hover:text-gray-900"
            onClick={increaseQuantity}
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>

        <Button 
          onClick={handleBuyNow}
          className="flex-1 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg bg-gray-900 hover:bg-gray-800 text-white text-lg py-7 font-serif tracking-wide"
        >
          <i className="fas fa-lock mr-3 opacity-70"></i>
          Secure Checkout
        </Button>
      </div>
    </div>
  );
}
