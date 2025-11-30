import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">About Us</h3>
            <p className="text-sm">
              We offer the best products with great customer service and fast delivery across the country.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-cyan-400 transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-cyan-400 transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span> Barodameo Alwar, RJ 301021</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-cyan-400" />
                <span>+91 97-8596-7653</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-400" />
                <span>decormitra11@gmail.com</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=100091545564519&rdid=LBkC6V5CCyZG9U3T&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F17St9zJX4r%2F#" // Replace with your actual Facebook page
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-cyan-400 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#" // Replace with your actual Twitter page
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-cyan-400 transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/decormitra.shop?igsh=MTVwenUxbDJrcjFoYQ==" // Replace with your actual Instagram page
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-cyan-400 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
            <Link to="/about" className="hover:text-cyan-400 transition-colors">
              About Us
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/privacy" className="hover:text-cyan-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/return-policy" className="hover:text-cyan-400 transition-colors">
              Return & Refund Policy
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/shipping" className="hover:text-cyan-400 transition-colors">
              Shipping Policy
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/faqs" className="hover:text-cyan-400 transition-colors">
              FAQs
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/cancel-order" className="hover:text-cyan-400 transition-colors">
              Cancel Order
            </Link>
          </div>
          <p className="text-center text-sm">&copy; {new Date().getFullYear()} DecorMitra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};