import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const apiCache = {};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchProduct = async () => {
    if (apiCache[id]) {
      setProduct(apiCache[id]);
      setLoading(false);
    } else {
      setLoading(true);
    }

    try {
      const { data } = await api.get(`/products/${id}`);
      apiCache[id] = data.product;
      setProduct(data.product);
    } catch (error) {
      toast.error("Product not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success("Added to cart");
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      return navigate("/login");
    }
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      toast.success("Review submitted!");
      setComment("");
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex gap-2">
          <div className="w-2 h-2 bg-brand-900 rounded-full"></div>
          <div className="w-2 h-2 bg-brand-900 rounded-full animation-delay-200"></div>
          <div className="w-2 h-2 bg-brand-900 rounded-full animation-delay-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mb-20 sm:mb-0 max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-brand-900 mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium text-sm">Back</span>
      </button>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 mb-16">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="aspect-[3/4] bg-brand-100 rounded-lg overflow-hidden border border-gray-100">
            <img
              src={
                product.images[activeImage] ||
                "https://via.placeholder.com/600x800?text=No+Image"
              }
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                    activeImage === idx
                      ? "border-brand-900"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 flex flex-col pt-4 md:pt-10">
          <div className="text-sm text-brand-500 font-semibold uppercase tracking-wider mb-2">
            {product.category || "General"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-900 mb-2">
            {product.name}
          </h1>
          
          {/* Rating Summary */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-yellow-400">
              {[1,2,3,4,5].map(star => (
                <Star key={star} size={18} fill={product.rating >= star ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          <p className="text-2xl text-gray-900 font-sans font-medium mb-8">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <div className="prose prose-sm text-gray-600 mb-10 leading-relaxed">
            <p>{product.description}</p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-brand-900 text-white py-4 rounded-lg font-medium text-lg flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <ShoppingBag size={20} />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
          <p className="text-sm text-center text-gray-500 mt-4">
            {product.stock > 0 ? `${product.stock} items available` : ''}
          </p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-display font-bold text-brand-900 mb-8">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Write a Review */}
          <div className="bg-brand-50 p-6 rounded-xl h-fit">
            <h3 className="text-lg font-bold mb-4 text-brand-900">Write a Review</h3>
            {user ? (
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-900"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                  <textarea 
                    rows="3" 
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-900"
                    placeholder="Share your thoughts about this product..."
                  ></textarea>
                </div>
                <button type="submit" className="bg-brand-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors">
                  Submit Review
                </button>
              </form>
            ) : (
              <p className="text-gray-600">Please <a href="/login" className="text-brand-900 font-medium underline">log in</a> to write a review.</p>
            )}
          </div>

          {/* Review List */}
          <div className="space-y-6">
            {product.reviews.length === 0 ? (
              <div className="text-gray-500 py-4">No reviews yet. Be the first to review this product!</div>
            ) : (
              product.reviews.map((review, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} size={14} fill={review.rating >= star ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900">{review.name}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
