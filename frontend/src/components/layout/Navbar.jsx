import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, LogOut, Shield, X, Search } from "lucide-react";
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
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">

          {/* Left: Hamburger (mobile) */}
          <div className="flex items-center gap-3">
            <button
              className="sm:hidden p-1.5 -ml-1 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="font-display font-bold text-xl sm:text-2xl tracking-tighter text-[#1a1a2e]"
            >
              GIRLS FASHION
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <div className="hidden sm:flex items-center gap-7 font-medium text-sm text-gray-600">
            <Link to="/" className="hover:text-[#1a1a2e] transition-colors">
              Home
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-brand-700 hover:text-brand-900 font-semibold transition-colors"
              >
                <Shield size={15} />
                Admin
              </Link>
            )}
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Cart */}
            <Link
              to="/checkout"
              className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-brand-700 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Account (desktop) */}
            {user ? (
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  to="/account"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#1a1a2e] p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User size={18} />
                  <span>Account</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#1a1a2e] p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ─── Mobile Slide-down Menu ─────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-xl z-50">
          <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col gap-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-3 text-gray-800 font-medium rounded-xl hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            {user?.role === "admin" && (
              <div className="mt-1 mb-1">
                <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Shield size={12} /> Admin Panel
                </div>
                {[
                  { name: "Dashboard", path: "/admin" },
                  { name: "Products", path: "/admin/products" },
                  { name: "Add Product", path: "/admin/add-product" },
                  { name: "Orders", path: "/admin/orders" },
                  { name: "Users", path: "/admin/users" },
                  { name: "Audit Logs", path: "/admin/audit-logs" },
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-900 rounded-xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="border-t border-gray-100 my-1" />

            {user ? (
              <>
                <Link
                  to="/account"
                  className="flex items-center gap-3 px-3 py-3 text-gray-800 font-medium rounded-xl hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={18} />
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-3 text-red-600 font-medium rounded-xl hover:bg-red-50 text-left"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-3 px-3 py-3 text-gray-800 font-medium rounded-xl hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={18} />
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
