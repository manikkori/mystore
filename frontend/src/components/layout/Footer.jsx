import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-brand-100 pt-12 pb-24 sm:pb-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link to="/" className="font-display font-bold text-2xl tracking-tighter text-pink-600 block">
              GIRLS FASHION
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your ultimate destination for the latest trends in girls' fashion. We bring you stylish, comfortable, and premium quality clothing for every occasion.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-500 hover:text-pink-600 transition-colors text-sm">Shop Latest</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-500 hover:text-pink-600 transition-colors text-sm">Login / Register</Link>
              </li>
              <li>
                <Link to="/account" className="text-gray-500 hover:text-pink-600 transition-colors text-sm">My Account</Link>
              </li>
              <li>
                <Link to="/checkout" className="text-gray-500 hover:text-pink-600 transition-colors text-sm">Cart</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-display font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors text-sm">Shipping Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors text-sm">Returns & Exchanges</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors text-sm">Size Guide</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors text-sm">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-pink-600 shrink-0 mt-0.5" />
                <span className="text-gray-500 text-sm">123 Fashion Street, New Delhi, India 110001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-pink-600 shrink-0" />
                <a href="tel:+919876543210" className="text-gray-500 hover:text-pink-600 transition-colors text-sm">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-pink-600 shrink-0" />
                <a href="mailto:support@girlsfashion.com" className="text-gray-500 hover:text-pink-600 transition-colors text-sm">support@girlsfashion.com</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Girls Fashion. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Secure Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
