import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductGallery from "@/components/product/product-gallery";
import ProductInfo from "@/components/product/product-info";
import ProductHighlights from "@/components/product/product-highlights";
import type { Product, Collection } from "@shared/schema";

export default function Home() {
  const [selectedCollection, setSelectedCollection] = useState("daydream");
  
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: collections = [] } = useQuery<Collection[]>({
    queryKey: ["/api/collections"],
  });

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section with Collection Showcase */}
        <section id="home" className="bg-white py-12 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-6xl font-serif font-semibold text-gray-900 mb-6 italic">
                Modest Swimwear Collection
              </h1>
              
              {/* Collection Options */}
              <div className="flex justify-center space-x-8 lg:space-x-16 mb-12">
                {collections.map((collection) => (
                  <div 
                    key={collection.id}
                    className="text-center group cursor-pointer" 
                    onClick={() => setSelectedCollection(collection.id)}
                  >
                    <img 
                      src={collection.icon} 
                      alt={`${collection.name} Collection`} 
                      className="w-16 h-16 mx-auto mb-2 group-hover:scale-110 transition-transform"
                    />
                    <span className={`font-medium text-lg ${collection.color === 'coral' ? 'text-coral' : 'text-teal'}`}>
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
