import { Link, useLocation } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

// Inline social icons (lucide-react doesn't have Instagram/Facebook)
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#1a1a2e] text-white pt-12 pb-24 sm:pb-12 mt-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="font-display font-bold text-2xl tracking-tighter text-white block">
              GIRLS FASHION
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate destination for the latest trends. Stylish, comfortable, and premium quality clothing for every occasion.
            </p>
            <div className="flex gap-3 pt-1">
              <a href="#" className="p-2 bg-white/10 rounded-lg text-gray-300 hover:bg-brand-600 hover:text-white transition-all">
                <InstagramIcon />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white transition-all">
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Shop Latest", to: "/" },
                { label: "My Account", to: "/account" },
                { label: "My Cart", to: "/checkout" },
                { label: "Login / Register", to: "/login" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-brand-400 shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">123 Fashion Street, New Delhi, India 110001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-brand-400 shrink-0" />
                <a
                  href={`tel:${import.meta.env.VITE_STORE_PHONE || "+919876543210"}`}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {import.meta.env.VITE_STORE_PHONE || "+91 98765 43210"}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-brand-400 shrink-0" />
                <a
                  href="mailto:support@girlsfashion.com"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  support@girlsfashion.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Girls Fashion. All rights reserved.
          </p>
          <span className="text-gray-600 text-xs uppercase tracking-wider font-medium">
            🔒 Secure Checkout
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
