import { useQuery } from "@tanstack/react-query";
import ProductGallery from "@/components/product/product-gallery";
import ProductInfo from "@/components/product/product-info";
import { products as staticProducts, collections as staticCollections } from "@/data/products";
import type { Product, Collection } from "@shared/schema";

export default function Home() {
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

  // Hardcode to the primary one item 
  const currentProduct = products[0];
  const currentCollectionData = collections[0];
  
  if (!products.length || !collections.length) {
    return (
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-serif text-gray-900 mb-4 animate-pulse">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-[#f8fdfe] via-[#f0fafb] to-[#fceceb] flex flex-col lg:flex-row relative">
      
      {/* Absolute Logo */}
      <div className="absolute top-6 left-6 lg:top-8 lg:left-8 z-50 flex items-center space-x-3 drop-shadow-md">
        <img src="/images/starfish-coral.png" className="w-10 h-10 object-contain" alt="Moony Logo"/>
        <span className="text-3xl font-serif font-bold text-gray-900 tracking-tight">moony</span>
      </div>

      {/* Left Pane: Visuals (Top on Mobile) */}
      <div className="h-[45dvh] lg:h-full lg:w-1/2 relative bg-white">
        <ProductGallery product={currentProduct} />
      </div>

      {/* Right Pane: Actions & Information (Bottom on Mobile) */}
      <div className="h-[55dvh] lg:h-full lg:w-1/2 overflow-y-auto px-6 py-6 lg:p-16 flex flex-col justify-center glass-panel shadow-none border-t lg:border-t-0 lg:border-l border-white/50 relative">
        <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl -z-10"></div>
        <ProductInfo product={currentProduct} collection={currentCollectionData} />
      </div>

    </div>
  );
}
