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
        <span className="text-3xl font-bold text-gray-900">${product.price}</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${collection.color === 'coral' ? 'bg-coral-light text-coral' : 'bg-teal-light text-teal'}`}>
          Complete Set
        </span>
      </div>

      {/* Set Includes */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
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
              className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                selectedSize === size 
                  ? `border-${collection.color} bg-${collection.color} text-white`
                  : `border-gray-300 text-gray-700 hover:border-${collection.color} hover:text-${collection.color}`
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
      <div className="space-y-4">
        <Link to="/checkout">
          <Button 
            className={`w-full ${collection.color === 'coral' ? 'bg-coral hover:bg-coral/90' : 'bg-teal hover:bg-teal/90'} text-white text-lg py-6`}
          >
            <i className="fas fa-shopping-bag mr-2"></i>
            Add to Cart
          </Button>
        </Link>
        
        <div className={`${collection.color === 'coral' ? 'bg-coral' : 'bg-teal'} text-white p-6 rounded-2xl space-y-4`}>
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
