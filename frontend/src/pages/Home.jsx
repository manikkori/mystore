import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import api from "../services/api";
import ProductCard from "../components/product/ProductCard";

const CATEGORIES = ["All", "Tops", "Dresses", "Jeans", "Ethnic", "Winterwear", "Activewear"];
const apiCache = {};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");

  const fetchProducts = async () => {
    const cacheKey = `${keyword}-${category}`;
    
    if (apiCache[cacheKey]) {
      setProducts(apiCache[cacheKey]);
      setLoading(false);
    } else {
      // Only set loading to true if we don't have these products in cache
      setLoading(true);
    }

    try {
      const { data } = await api.get(`/products?keyword=${keyword}&category=${category}`);
      apiCache[cacheKey] = data.products;
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add debounce for search
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [keyword, category]);

  return (
    <div className="mb-20 sm:mb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-brand-50 py-20 px-4 sm:px-6 lg:px-8 text-center rounded-b-[40px] mb-12 shadow-float">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-300 font-semibold tracking-widest uppercase text-sm mb-4 block">New Collection 2026</span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold mb-6 italic tracking-tight">
            Trending Girls Fashion
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-brand-100 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Discover the latest styles, elegant dresses, and comfortable everyday wear designed exclusively for girls.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto flex items-center">
            <Search className="absolute left-4 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 outline-none focus:ring-4 focus:ring-brand-500 transition-all shadow-lg text-lg"
            />
          </div>
        </div>
      </section>

      <div id="shop-grid" className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto pt-4">
        
        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-3 no-scrollbar items-center">
          <span className="font-semibold text-gray-700 whitespace-nowrap mr-2">Filter by:</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                category === cat 
                  ? "bg-brand-900 text-white shadow-md" 
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="animate-pulse flex gap-2">
              <div className="w-3 h-3 bg-brand-900 rounded-full"></div>
              <div className="w-3 h-3 bg-brand-900 rounded-full animation-delay-200"></div>
              <div className="w-3 h-3 bg-brand-900 rounded-full animation-delay-400"></div>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-gray-500">
            <Search size={48} className="mb-4 text-gray-300" />
            <p className="text-xl font-medium">No products found</p>
            <p>Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
