import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
      } catch (error) {
        toast.error("Product not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success("Added to cart");
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
    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mb-20 sm:mb-0">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-brand-900 mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium text-sm">Back</span>
      </button>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="aspect-[3/4] bg-brand-100 rounded-lg overflow-hidden">
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
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-900 mb-4">
            {product.name}
          </h1>
          <p className="text-2xl text-gray-700 font-sans mb-8">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <div className="prose prose-sm text-gray-500 mb-10">
            <p>{product.description}</p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-brand-900 text-white py-4 rounded-lg font-medium text-lg flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={20} />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
