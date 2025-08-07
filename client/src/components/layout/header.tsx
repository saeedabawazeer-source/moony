export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="https://v0-moony.vercel.app/images/starfish-coral.png" 
              alt="Moony Starfish Logo" 
              className="w-8 h-8"
            />
            <span className="text-2xl font-serif font-semibold text-gray-900">moony</span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-teal hover:text-coral transition-colors font-medium">Home</a>
            <a href="#collections" className="text-gray-700 hover:text-coral transition-colors font-medium">Collections</a>
            <a href="#about" className="text-gray-700 hover:text-coral transition-colors font-medium">About</a>
            <a href="#contact" className="text-gray-700 hover:text-coral transition-colors font-medium">Contact</a>
          </nav>
          
          {/* Shopping Bag */}
          <div className="flex items-center space-x-4">
            <a href="/checkout" className="text-teal hover:text-coral transition-colors">
              <i className="fas fa-shopping-bag text-xl"></i>
            </a>
          </div>
          
          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-gray-700 hover:text-coral">
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
