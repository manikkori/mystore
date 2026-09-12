import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, LogOut, Shield, X, Phone } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await logout();
      setIsMobileMenuOpen(false);
      navigate("/");
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button 
              className="sm:hidden p-2 -ml-2 text-brand-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link
              to="/"
              className="font-display font-bold text-2xl tracking-tighter text-pink-600"
            >
              GIRLS FASHION
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-8 font-medium text-sm tracking-wide">
            <Link to="/" className="hover:text-pink-600 transition-colors">
              Home
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="hover:text-brand-900 flex items-center gap-1 transition-colors font-bold"
              >
                <Shield size={16} /> Admin Panel
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  to="/account"
                  className="flex items-center gap-1 text-sm font-medium hover:text-brand-900 transition-colors"
                >
                  <User size={18} /> My Account
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1 text-sm font-medium hover:text-brand-900 transition-colors"
              >
                <User size={18} /> Login
              </Link>
            )}

            {/* Cart Icon - Desktop Only */}
            <Link
              to="/checkout"
              className="relative p-2 text-brand-900 hover:bg-brand-50 rounded-full transition-colors hidden sm:block"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-900 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Call Icon - Mobile Only */}
            <a
              href={`tel:${import.meta.env.VITE_STORE_PHONE || "+919876543210"}`}
              className="p-2 text-brand-900 hover:bg-brand-50 rounded-full transition-colors sm:hidden"
            >
              <Phone size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-brand-100 absolute w-full left-0 py-4 px-4 shadow-lg flex flex-col gap-4 z-50 max-h-[80vh] overflow-y-auto">
          <Link 
            to="/" 
            className="text-lg font-medium text-gray-800 hover:text-pink-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          
          {user?.role === "admin" && (
            <div className="flex flex-col gap-3 bg-brand-50 p-4 rounded-xl mt-2">
              <span className="text-sm font-bold text-brand-900 uppercase tracking-wider mb-1 flex items-center gap-2">
                <Shield size={16} /> Admin Controls
              </span>
              <Link to="/admin" className="text-base font-medium text-gray-700 hover:text-brand-900" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/admin/products" className="text-base font-medium text-gray-700 hover:text-brand-900" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
              <Link to="/admin/add-product" className="text-base font-medium text-gray-700 hover:text-brand-900" onClick={() => setIsMobileMenuOpen(false)}>Add Product</Link>
              <Link to="/admin/orders" className="text-base font-medium text-gray-700 hover:text-brand-900" onClick={() => setIsMobileMenuOpen(false)}>Orders</Link>
              <Link to="/admin/users" className="text-base font-medium text-gray-700 hover:text-brand-900" onClick={() => setIsMobileMenuOpen(false)}>Users</Link>
              <Link to="/admin/audit-logs" className="text-base font-medium text-gray-700 hover:text-brand-900" onClick={() => setIsMobileMenuOpen(false)}>Audit Logs</Link>
            </div>
          )}

          <div className="h-px bg-gray-100 my-2"></div>

          {user ? (
            <>
              <Link
                to="/account"
                className="text-lg font-medium text-gray-800 flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={20} /> My Account
              </Link>
              <button
                onClick={handleLogout}
                className="text-lg font-medium text-red-600 flex items-center gap-2 text-left"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-lg font-medium text-gray-800 flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User size={20} /> Login / Register
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
