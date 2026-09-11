import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, LogOut, Shield } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button className="sm:hidden p-2 -ml-2 text-brand-900">
              <Menu size={24} />
            </button>
            <Link
              to="/"
              className="font-display font-bold text-2xl tracking-tighter"
            >
              BRAND.
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-8 font-medium text-sm tracking-wide">
            <Link to="/" className="hover:text-gray-600 transition-colors">
              Shop
            </Link>
            <Link
              to="/collections"
              className="hover:text-gray-600 transition-colors"
            >
              Collections
            </Link>
            <Link to="/about" className="hover:text-gray-600 transition-colors">
              About
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
                className="hidden sm:block p-2 text-brand-900 hover:bg-brand-50 rounded-full transition-colors"
              >
                <User size={20} />
              </Link>
            )}

            <Link
              to="/checkout"
              className="relative p-2 text-brand-900 hover:bg-brand-50 rounded-full transition-colors"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-900 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
