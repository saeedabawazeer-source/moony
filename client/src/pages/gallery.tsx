import { useState, useEffect } from "react";

export default function Gallery() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/gallery-images");
        if (res.ok) {
          const data = await res.json();
          setImages(data.images);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-y-auto -webkit-overflow-scrolling-touch bg-gray-50 p-4 md:p-8 font-sans z-50">
      <div className="max-w-7xl mx-auto pb-20">
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-center mt-6 mb-4">Moony Ad Archive</h1>
        <p className="text-center text-gray-500 mb-10">All generated ad variations and concepts.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((src, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img src={src} className="w-full h-auto object-cover" loading="lazy" />
              <div className="p-3 bg-white border-t">
                <p className="text-xs text-gray-400 truncate">{src.split('/').pop()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
