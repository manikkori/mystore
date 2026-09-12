import { Link } from "react-router-dom";
import { Star, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (product.stock > 0) {
      addToCart(product, 1);
      toast.success("Added to cart");
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full relative">
      {/* Badges */}
      {product.stock === 0 && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
          OUT OF STOCK
        </span>
      )}

      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden bg-gray-50 relative">
        <img
          src={
            product.images[0] ||
            "https://via.placeholder.com/400x500?text=No+Image"
          }
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        
        {/* Quick Add Button (Desktop Hover) */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hidden md:block">
          <button 
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className="w-full bg-white/90 backdrop-blur-sm text-brand-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={18} />
            Quick Add
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <p className="text-xs text-brand-500 font-semibold uppercase tracking-wider mb-1">
          {product.category || "General"}
        </p>
        <h3 className="font-display font-bold text-gray-900 text-base sm:text-lg mb-2 line-clamp-1 group-hover:text-brand-900 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star size={14} className={product.rating > 0 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
            <span className="text-xs text-gray-500 font-medium">
              {product.rating > 0 ? product.rating.toFixed(1) : "New"} 
              {product.numReviews > 0 && ` (${product.numReviews})`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-sans text-xl font-bold text-brand-900">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            {/* Quick Add Button (Mobile) */}
            <button 
              onClick={handleQuickAdd}
              disabled={product.stock === 0}
              className="md:hidden bg-brand-50 text-brand-900 p-2 rounded-full hover:bg-brand-100 disabled:opacity-50"
            >
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
