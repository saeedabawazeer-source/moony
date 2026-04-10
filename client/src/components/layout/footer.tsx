export default function Footer() {
  return (
    <footer className="bg-[#C4B494] text-gray-900 py-12 border-none shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center items-center space-x-2">
            <img 
              src="/images/starfish-coral.png" 
              alt="Moony Starfish Logo" 
              className="w-8 h-8"
            />
            <span className="text-2xl font-serif font-semibold">moony</span>
          </div>
          
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-300">
            <a href="mailto:contact@moonyswimwear.com" className="hover:text-coral transition-colors">
              contact@moonyswimwear.com
            </a>
            <a href="tel:+1234567890" className="hover:text-coral transition-colors">
              +1 (234) 567-890
            </a>
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            <a href="https://www.instagram.com/moonyswimwear" className="text-gray-300 hover:text-coral transition-colors">
              <i className="fab fa-instagram text-2xl"></i>
            </a>
          </div>
          
          <div className="border-t border-gray-700 pt-6 text-gray-400 text-sm">
            <p>&copy; 2024 Moony Swimwear. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
