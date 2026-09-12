import { Link, useLocation } from "react-router-dom";
import { Home, Grid, ShoppingBag, User } from "lucide-react";
import { useCart } from "../../context/CartContext";

const BottomNav = () => {
  const location = useLocation();
  const { cart } = useCart();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path) =>
    location.pathname === path ? "text-brand-900" : "text-gray-400";

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-brand-100 pb-safe z-40">
      <div className="flex justify-around items-center h-16 px-4">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 ${isActive("/")}`}
        >
          <Home size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: document.getElementById("shop-grid")?.offsetTop || 500, behavior: "smooth" })}
          className={`flex flex-col items-center gap-1 ${isActive("/collections") || location.pathname === "/" ? "text-gray-400 hover:text-brand-900" : "text-gray-400"}`}
        >
          <Grid size={20} />
          <span className="text-[10px] font-medium">Shop</span>
        </Link>
        <Link
          to="/checkout"
          className={`flex flex-col items-center gap-1 relative ${isActive("/checkout")}`}
        >
          <div className="relative">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-brand-900 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </Link>
        <Link
          to="/account"
          className={`flex flex-col items-center gap-1 ${isActive("/account")}`}
        >
          <User size={20} />
          <span className="text-[10px] font-medium">Account</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
