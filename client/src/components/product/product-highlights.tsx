interface ProductHighlight {
  icon: string;
  title: string;
  description: string;
}

interface ProductHighlightsProps {
  highlights: ProductHighlight[];
}

export default function ProductHighlights({ highlights }: ProductHighlightsProps) {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-serif font-semibold text-center text-gray-900 mb-12">
          Product Highlights
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="text-center space-y-4">
              <img 
                src={highlight.icon} 
                alt={highlight.title} 
                className="w-12 h-12 mx-auto"
              />
              <h3 className="text-xl font-semibold text-gray-900">{highlight.title}</h3>
              <p className="text-gray-600 text-sm">{highlight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
