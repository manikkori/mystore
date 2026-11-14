import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { setCachedProduct } from "../../utils/productCache";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);

  // Pre-cache product when card is rendered
  if (product && product._id) {
    setCachedProduct(product._id, product);
  }

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product, 1);
      toast.success("Added to cart!");
    }
  };

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked((prev) => !prev);
    toast.success(!isLiked ? "Saved to wishlist!" : "Removed from wishlist");
  };

  const handleMouseEnter = () => {
    // Preload full image into browser cache on hover
    if (product.images?.[0]) {
      const img = new Image();
      img.src = product.images[0];
    }
  };

  const imageUrl =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80";

  return (
    <Link
      to={`/product/${product._id}`}
      state={{ product }}
      onMouseEnter={handleMouseEnter}
      className="group block bg-[#fbf9f7] sm:bg-white rounded-2xl sm:rounded-3xl overflow-hidden p-2 sm:p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-black/5"
    >
      {/* Image container */}
      <div className="aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-[#eeeae6] relative">
        {/* Out of Stock badge */}
        {product.stock === 0 && (
          <span className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10 tracking-wider uppercase">
            Sold Out
          </span>
        )}

        {/* Wishlist Heart Button - Dribbble style circular button */}
        <button
          onClick={toggleLike}
          aria-label="Wishlist"
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        >
          <Heart
            size={14}
            className={`transition-colors ${
              isLiked ? "fill-red-500 text-red-500" : "text-gray-700"
            }`}
          />
        </button>

        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Quick Add Overlay on desktop hover */}
        <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hidden md:block">
          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className="w-full bg-black/90 backdrop-blur-md text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-black disabled:opacity-50 transition-colors shadow-lg"
          >
            <ShoppingBag size={14} />
            Quick Add
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div className="pt-2.5 pb-1 px-1">
        <h3 className="font-sans font-medium text-gray-900 text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-black">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-1">
          <div>
            <p className="font-sans text-sm sm:text-base font-bold text-gray-900">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            {product.rating > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span className="text-[10px] text-gray-500 font-medium">
                  {product.rating.toFixed(1)}
                  {product.numReviews > 0 && (
                    <span className="text-gray-400"> ({product.numReviews})</span>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Mobile Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className="md:hidden w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 disabled:opacity-40 transition-colors active:scale-95"
            aria-label="Add to Cart"
          >
            <ShoppingBag size={13} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
