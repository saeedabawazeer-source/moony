import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductGallery from "@/components/product/product-gallery";
import ProductInfo from "@/components/product/product-info";
import { products as staticProducts, collections as staticCollections } from "@/data/products";
import type { Product, Collection } from "@shared/schema";

export default function Home() {
  const [selectedCollection, setSelectedCollection] = useState("daydream");
  
  const { data: apiProducts, isError: productsError } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    retry: 1,
  });

  const { data: apiCollections, isError: collectionsError } = useQuery<Collection[]>({
    queryKey: ["/api/collections"],
    retry: 1,
  });

  const products = apiProducts && !productsError ? apiProducts : staticProducts;
  const collections = apiCollections && !collectionsError ? apiCollections : staticCollections;

  const currentProduct = products.find(p => p.collection === selectedCollection) || products[0];
  const currentCollectionData = collections.find(c => c.id === selectedCollection) || collections[0];
  
  if (!products.length || !collections.length) {
    return (
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-serif text-gray-900 mb-4 animate-pulse">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fdfe] via-[#f0fafb] to-[#fceceb] flex flex-col relative overflow-x-hidden">
      
      <Header />

      <main className="flex-grow pt-24 pb-16 lg:pt-36 lg:pb-32 relative">
        {/* Decorative floating background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-teal/5 rounded-full blur-3xl animate-float pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-coral/5 rounded-full blur-3xl animate-float-delayed pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header Typography */}
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-teal font-medium tracking-widest uppercase text-sm mb-4 block">New Season</span>
            <h1 className="text-4xl lg:text-6xl font-serif text-gray-900 leading-tight">
              Embrace Elegance.<br/><span className="text-gradient italic">Modest Swimwear.</span>
            </h1>
          </div>

          {/* Collection Options (Model Toggle) */}
          <div className="flex justify-center flex-wrap gap-4 lg:gap-8 mb-12 max-w-3xl mx-auto">
            {collections.map((collection, idx) => (
              <div 
                key={collection.id}
                className={`flex items-center space-x-4 px-6 py-4 rounded-full cursor-pointer transition-all duration-500 animate-fade-in-up ${
                  selectedCollection === collection.id 
                    ? 'bg-white shadow-lg border-[3px] scale-105 border-teal' 
                    : 'glass-panel hover:bg-white hover:scale-105 border-transparent border-[3px] hover:border-teal/30'
                }`}
                style={{ animationDelay: `${0.2 + (idx * 0.1)}s` }}
                onClick={() => setSelectedCollection(collection.id)}
              >
                <img 
                  src={collection.icon} 
                  alt={`${collection.name} Collection`} 
                  className={`w-10 h-10 object-contain transition-transform duration-500 ${selectedCollection === collection.id ? 'rotate-12 scale-110' : ''}`}
                />
                <span className={`font-serif font-bold text-xl tracking-wide ${
                  collection.color === 'coral' ? 'text-coral' : 'text-teal'
                } ${selectedCollection === collection.id ? 'opacity-100' : 'opacity-70'}`}>
                  {collection.name}
                </span>
              </div>
            ))}
          </div>

          {/* Massive Interactive Glass Card for Product */}
          <div className="glass-panel rounded-[3rem] p-6 lg:p-12 shadow-2xl backdrop-blur-2xl border border-white/60 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <ProductGallery product={currentProduct} />
              <ProductInfo product={currentProduct} collection={currentCollectionData} />
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
