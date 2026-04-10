import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductGallery from "@/components/product/product-gallery";
import ProductInfo from "@/components/product/product-info";
import ProductHighlights from "@/components/product/product-highlights";
import { products as staticProducts, collections as staticCollections } from "@/data/products";
import type { Product, Collection } from "@shared/schema";

export default function Home() {
  const [selectedCollection, setSelectedCollection] = useState("daydream");
  
  // Try to fetch from API first, fallback to static data for deployment
  const { data: apiProducts, isError: productsError } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    retry: 1,
  });

  const { data: apiCollections, isError: collectionsError } = useQuery<Collection[]>({
    queryKey: ["/api/collections"],
    retry: 1,
  });

  // Use API data if available, otherwise use static data
  const products = apiProducts && !productsError ? apiProducts : staticProducts;
  const collections = apiCollections && !collectionsError ? apiCollections : staticCollections;

  const currentProduct = products.find(p => p.collection === selectedCollection) || products[0];
  const currentCollectionData = collections.find(c => c.id === selectedCollection) || collections[0];
  
  if (!products.length || !collections.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-gray-900 mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we load the collection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      
      <main>
        {/* Hero Section with Collection Showcase */}
        <section id="home" className="relative overflow-hidden bg-gradient-to-br from-[#f8fdfe] via-[#f0fafb] to-[#fceceb] pt-24 pb-16 lg:pt-36 lg:pb-24">
          {/* Decorative floating background elements */}
          <div className="absolute top-10 left-10 w-64 h-64 bg-teal/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-coral/5 rounded-full blur-3xl animate-float-delayed"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 animate-fade-in-up">
              <span className="text-teal font-medium tracking-widest uppercase text-sm mb-4 block">New Season</span>
              <h1 className="text-5xl lg:text-7xl font-serif text-gray-900 mb-6 leading-tight">
                Embrace Elegance.<br/><span className="text-gradient italic">Modest Swimwear.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-gray-600 text-lg lg:text-xl">
                Premium fabrics and exquisite tailoring designed for the modern woman who refuses to compromise on style or coverage.
              </p>
            </div>
              
              {/* Collection Options */}
              <div className="flex justify-center flex-wrap gap-6 lg:gap-10 mb-8 max-w-3xl mx-auto">
                {collections.map((collection, idx) => (
                  <div 
                    key={collection.id}
                    className="flex flex-col items-center group cursor-pointer animate-fade-in-up"
                    style={{ animationDelay: `${0.2 + (idx * 0.1)}s` }}
                    onClick={() => setSelectedCollection(collection.id)}
                  >
                    <div className={`p-5 rounded-2xl transition-all duration-500 mb-4 ${
                      selectedCollection === collection.id 
                        ? 'bg-white shadow-xl scale-110 border-b-4 border-teal' 
                        : 'glass-panel hover:scale-105 hover:bg-white/90'
                    }`}>
                      <img 
                        src={collection.icon} 
                        alt={`${collection.name} Collection`} 
                        className="w-14 h-14 object-contain"
                      />
                    </div>
                    <span className={`font-serif font-medium text-xl tracking-wide ${
                      collection.color === 'coral' ? 'text-coral' : 'text-teal'
                    } ${selectedCollection === collection.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                      {collection.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Product Detail Section */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {currentProduct && currentCollectionData ? (
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                <ProductGallery product={currentProduct} />
                <ProductInfo product={currentProduct} collection={currentCollectionData} />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading products...</p>
              </div>
            )}
          </div>
        </section>

        {/* Product Highlights */}
        {currentProduct && (
          <ProductHighlights highlights={currentProduct.highlights} />
        )}
      </main>

      <Footer />
    </div>
  );
}
