import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { Product, Collection } from "@shared/schema";

interface ProductInfoProps {
  product: Product;
  collection: Collection;
}

export default function ProductInfo({ product, collection }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <div className="space-y-8">
      {/* Product Header */}
      <div className="flex items-center space-x-3 mb-4">
        <img 
          src={collection.icon} 
          alt="Starfish accent" 
          className="w-6 h-6"
        />
        <h2 className={`text-3xl lg:text-4xl font-serif font-semibold ${collection.color === 'coral' ? 'text-coral' : 'text-teal'}`}>
          {product.name}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-3xl font-bold text-gray-900">SAR {product.price}</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${collection.color === 'coral' ? 'bg-coral-light text-coral' : 'bg-teal-light text-teal'}`}>
          Complete Set
        </span>
      </div>

      {/* Set Includes */}
      <div className="glass-panel p-8 rounded-[2rem]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Includes:</h3>
        <ul className="space-y-2">
          {product.includes.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${collection.color === 'coral' ? 'bg-coral' : 'bg-teal'}`}></span>
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Product Description */}
      <p className="text-gray-700 leading-relaxed">
        {product.description}
      </p>

      {/* Size Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Size</h3>
        <div className="flex space-x-3">
          {product.sizes.map((size) => (
            <button 
              key={size}
              className={`px-5 py-3 border-[3px] rounded-2xl font-bold transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                selectedSize === size 
                  ? collection.color === 'coral' ? 'border-coral bg-coral text-white' : 'border-teal bg-teal text-white'
                  : collection.color === 'coral' ? 'border-coral/20 text-gray-700 hover:border-coral hover:text-coral' : 'border-teal/20 text-gray-700 hover:border-teal hover:text-teal'
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
        <div className="flex items-center space-x-4">
          <button 
            className={`w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-${collection.color} transition-colors`}
            onClick={decreaseQuantity}
          >
            <i className="fas fa-minus text-gray-600"></i>
          </button>
          <span className="text-xl font-medium w-8 text-center">{quantity}</span>
          <button 
            className={`w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-${collection.color} transition-colors`}
            onClick={increaseQuantity}
          >
            <i className="fas fa-plus text-gray-600"></i>
          </button>
        </div>
      </div>

      {/* Order Actions */}
      <div className="space-y-6 pt-4">
        <Link to="/checkout" className="block">
          <Button 
            className={`w-full rounded-[1.5rem] shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_25px_rgba(0,0,0,0.15)] ${
              collection.color === 'coral' ? 'bg-coral hover:bg-coral/90' : 'bg-teal hover:bg-teal/90'
            } text-white text-xl py-8 font-serif font-bold tracking-wide`}
          >
            <i className="fas fa-shopping-bag mr-3"></i>
            Add to Cart
          </Button>
        </Link>
        
        <div className={`${collection.color === 'coral' ? 'bg-gradient-to-br from-coral to-[#ff5252]' : 'bg-gradient-to-br from-teal to-[#22a699]'} text-white p-8 rounded-[2rem] shadow-lg space-y-5 overflow-hidden relative group`}>
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <h3 className="text-xl font-semibold">Contact to Order</h3>
          <div className="space-y-3">
            <a href="mailto:contact@moonyswimwear.com" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <i className="fas fa-envelope"></i>
              <span>contact@moonyswimwear.com</span>
            </a>
            <a href="tel:+1234567890" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <i className="fas fa-phone"></i>
              <span>+1 (234) 567-890</span>
            </a>
            <a href="https://www.instagram.com/moonyswimwear" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <i className="fab fa-instagram"></i>
              <span>@moonyswimwear</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
