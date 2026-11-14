import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Star, Zap, Share2, Heart } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getCachedProduct, setCachedProduct } from "../utils/productCache";

const SIZES = ["XS", "S", "M", "L", "XL"];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, cart } = useCart();
  const { user } = useAuth();

  // Instant fast-load: grab cached product immediately from route state or cache
  const initialProduct = location.state?.product || getCachedProduct(id);

  const [product, setProduct] = useState(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isLiked, setIsLiked] = useState(false);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Background fetch to ensure fresh reviews & latest inventory
  const fetchProduct = async (silent = false) => {
    if (!silent && !product) {
      setLoading(true);
    }

    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
      setCachedProduct(id, data.product);
    } catch (error) {
      if (!silent) {
        toast.error("Product not found");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    // If we have cached data, fetch silently in background for zero delay
    fetchProduct(Boolean(initialProduct));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    addToCart(product, 1);
    toast.success(`Added ${product.name} (${selectedSize}) to cart!`);
  };

  const handleBuyNow = () => {
    if (!product || product.stock === 0) return;
    const exists = cart.find((item) => item.product._id === product._id);
    if (!exists) {
      addToCart(product, 1);
    }
    if (!user) {
      toast("Please login to complete your order", { icon: "🔐" });
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    toast.success("Opening checkout...", { duration: 1200, id: "checkout-nav" });
    navigate("/checkout");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || "Girls Fashion Store",
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      return navigate("/login");
    }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      toast.success("Review submitted!");
      setComment("");
      fetchProduct(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading && !product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-pulse flex gap-2">
          <div className="w-2.5 h-2.5 bg-black rounded-full" />
          <div className="w-2.5 h-2.5 bg-black rounded-full animation-delay-200" />
          <div className="w-2.5 h-2.5 bg-black rounded-full animation-delay-400" />
        </div>
      </div>
    );
  }

  const currentImage =
    product.images?.[activeImage] ||
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="bg-[#f7f4f1] min-h-screen pb-24 sm:pb-16">
      <div className="max-w-[1200px] mx-auto sm:px-6 lg:px-8 sm:py-8">
        
        {/* Main Product Container */}
        <div className="bg-white sm:rounded-3xl sm:shadow-lg sm:border sm:border-black/5 overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* Left: Product Images with floating header buttons (Mobile & Desktop) */}
            <div className="w-full lg:w-1/2 relative bg-[#eeeae6]">
              {/* Floating Action Controls on Top of Image */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
                <button
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center text-gray-800 hover:bg-white transition-all active:scale-95"
                  aria-label="Back"
                >
                  <ArrowLeft size={18} />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center text-gray-800 hover:bg-white transition-all active:scale-95"
                    aria-label="Share"
                  >
                    <Share2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setIsLiked(!isLiked);
                      toast.success(!isLiked ? "Saved to wishlist!" : "Removed from wishlist");
                    }}
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center text-gray-800 hover:bg-white transition-all active:scale-95"
                    aria-label="Wishlist"
                  >
                    <Heart
                      size={18}
                      className={`transition-colors ${
                        isLiked ? "fill-red-500 text-red-500" : "text-gray-800"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Main Image */}
              <div className="aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden relative">
                <img
                  src={currentImage}
                  alt={product.name}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />

                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-black text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail strip if multiple images */}
              {product.images && product.images.length > 1 && (
                <div className="p-3 bg-white/60 backdrop-blur-sm flex gap-2.5 overflow-x-auto no-scrollbar border-t border-gray-100">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-14 h-16 sm:w-16 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImage === idx
                          ? "border-black scale-105 shadow-md"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info & Actions — Dribbble Screen 2 Layout */}
            <div className="w-full lg:w-1/2 p-5 sm:p-8 lg:p-10 flex flex-col justify-between -mt-6 sm:mt-0 relative z-10 bg-white rounded-t-[32px] sm:rounded-none shadow-lg sm:shadow-none">
              <div>
                {/* Category & Rating Row */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    {product.category || "Collection"}
                  </span>

                  {/* Dribbble Style Rating Badge (★ 4.9) */}
                  <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/60 text-amber-900 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>{product.rating > 0 ? product.rating.toFixed(1) : "4.9"}</span>
                    {product.numReviews > 0 && (
                      <span className="text-amber-700/80 font-normal">
                        ({product.numReviews})
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium text-gray-900 leading-tight mb-3">
                  {product.name}
                </h1>

                {/* Description */}
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                  {product.description ||
                    "Clean lines and a relaxed silhouette create an effortlessly elegant look, perfect for both polished everyday styling and special occasions."}
                </p>

                {/* Size Selector — Dribbble Style */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                      Size
                    </span>
                    <span className="text-[11px] text-gray-500 underline cursor-pointer hover:text-black">
                      Size Guide
                    </span>
                  </div>

                  <div className="flex gap-2.5 flex-wrap">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`w-11 h-10 sm:w-12 sm:h-11 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center ${
                          selectedSize === size
                            ? "bg-black text-white shadow-md scale-105"
                            : "bg-[#f5f3f0] text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action Row (Dribbble Bottom Bar Style) */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block mb-0.5">
                      Price
                    </span>
                    <p className="text-2xl sm:text-3xl font-bold font-sans text-gray-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 flex-1 justify-end max-w-xs">
                    {product.stock === 0 ? (
                      <button
                        disabled
                        className="w-full bg-gray-200 text-gray-400 py-3.5 rounded-full font-semibold text-sm cursor-not-allowed"
                      >
                        Out of Stock
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleAddToCart}
                          className="flex-1 bg-black text-white hover:bg-gray-800 py-3.5 px-4 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                        >
                          <ShoppingBag size={15} />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          onClick={handleBuyNow}
                          className="bg-brand-900 text-white hover:bg-black py-3.5 px-4 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 transition-all shadow-md active:scale-95"
                          title="Instant Buy"
                        >
                          <Zap size={15} className="fill-brand-200 text-brand-200" />
                          <span>Buy Now</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {product.stock > 0 && product.stock <= 5 && (
                  <p className="text-[11px] text-amber-700 font-medium text-right mt-2">
                    Only {product.stock} items left in stock
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Customer Reviews Section ──────────────────────── */}
        <div className="mt-8 bg-white sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-black/5">
          <h2 className="text-xl sm:text-2xl font-display font-medium text-gray-900 mb-6">
            Customer Reviews
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Write a review */}
            <div className="bg-[#faf8f5] p-5 sm:p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Write a Review
              </h3>
              {user ? (
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                      Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full bg-white rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-black"
                    >
                      <option value="5">★★★★★ (5 - Excellent)</option>
                      <option value="4">★★★★☆ (4 - Very Good)</option>
                      <option value="3">★★★☆☆ (3 - Good)</option>
                      <option value="2">★★☆☆☆ (2 - Fair)</option>
                      <option value="1">★☆☆☆☆ (1 - Poor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                      Your Experience
                    </label>
                    <textarea
                      rows="3"
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this outfit..."
                      className="w-full bg-white rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-black resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-black text-white py-3 rounded-full text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                  >
                    {submittingReview ? "Submitting..." : "Post Review"}
                  </button>
                </form>
              ) : (
                <p className="text-xs text-gray-500">
                  Please{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-black font-semibold underline"
                  >
                    log in
                  </button>{" "}
                  to write a review.
                </p>
              )}
            </div>

            {/* Existing Reviews */}
            <div className="space-y-4">
              {!product.reviews || product.reviews.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">
                  No reviews yet. Be the first to review this style!
                </p>
              ) : (
                product.reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="border-b border-gray-100 pb-4 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900">
                        {rev.name}
                      </span>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={11}
                            className={
                              rev.rating >= s
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-200"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
