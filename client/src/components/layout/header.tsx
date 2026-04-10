export default function Header() {
  return (
    <header className="fixed w-full top-0 z-50 bg-[#C4B494] shadow-none border-none transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group">
            <img 
              src="/images/starfish-coral.png" 
              alt="Moony Starfish Logo" 
              className="w-10 h-10 group-hover:rotate-12 transition-transform duration-300"
            />
            <span className="text-3xl font-serif font-bold text-gray-900 tracking-tight group-hover:text-coral transition-colors">moony</span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-10">
            {['Home', 'Collections', 'About', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="relative text-gray-800 font-medium text-sm tracking-wide uppercase group hover:text-teal transition-colors"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>
          
          {/* Shopping Bag */}
          <div className="flex items-center space-x-4">
            <a href="/checkout" className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-teal-light transition-colors">
              <i className="fas fa-shopping-bag text-gray-700 group-hover:text-teal transition-colors"></i>
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
