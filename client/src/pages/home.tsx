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
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col relative overflow-x-hidden">
      
      <Header />

      <main className="flex-grow pt-24 pb-16 lg:pt-36 lg:pb-32 relative">
        {/* Minimal Decorative elements */}
        
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
                className={`flex items-center space-x-4 px-8 py-4 rounded-[1.5rem] cursor-pointer transition-all duration-300 ${
                  selectedCollection === collection.id 
                    ? 'bg-white shadow-sm border-[2px] scale-105 border-gray-900' 
                    : 'bg-white/50 hover:bg-white border-transparent border-[2px] hover:border-gray-300'
                }`}
                style={{ animationDelay: `${0.2 + (idx * 0.1)}s` }}
                onClick={() => setSelectedCollection(collection.id)}
              >
                <img 
                  src={collection.icon} 
                  alt={`${collection.name} Collection`} 
                  className="w-8 h-8 object-contain"
                />
                <span className={`font-serif font-bold text-lg tracking-wide text-gray-900 ${selectedCollection === collection.id ? 'opacity-100' : 'opacity-60'}`}>
                  {collection.name}
                </span>
              </div>
            ))}
          </div>

          {/* Cleaner Interactive Card for Product */}
          <div className="bg-white rounded-3xl p-6 lg:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
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
