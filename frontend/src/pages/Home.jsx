import { useState, useEffect, useRef } from "react";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import api from "../services/api";
import ProductCard from "../components/product/ProductCard";
import { setCachedProductsList } from "../utils/productCache";

const CATEGORIES = ["All", "New In", "Clothing", "Dresses", "Tops", "Jeans", "Ethnic", "Accessories"];
const localCache = {};

// Clean skeleton loader for product cards
const SkeletonCard = () => (
  <div className="bg-[#fbf9f7] sm:bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-3 animate-pulse border border-black/5">
    <div className="aspect-[3/4] rounded-xl sm:rounded-2xl bg-[#eeeae6]" />
    <div className="pt-2.5 px-1 space-y-1.5">
      <div className="h-3.5 bg-gray-200 rounded-md w-3/4" />
      <div className="h-3.5 bg-gray-200 rounded-md w-1/3" />
    </div>
  </div>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const shopRef = useRef(null);

  const fetchProducts = async () => {
    // Map "New In" or "Clothing" to All or relevant categories for backend
    let backendCategory = category;
    if (category === "New In" || category === "Clothing" || category === "Accessories") {
      backendCategory = "All";
    }

    const cacheKey = `${keyword}-${backendCategory}`;
    if (localCache[cacheKey]) {
      setProducts(localCache[cacheKey]);
      setLoading(false);
    }

    try {
      const { data } = await api.get(
        `/products?keyword=${encodeURIComponent(keyword)}&category=${encodeURIComponent(backendCategory)}`
      );
      localCache[cacheKey] = data.products;
      setCachedProductsList(data.products);
      setProducts(data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(delay);
  }, [keyword, category]);

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-[#f7f4f1] min-h-screen mb-16 sm:mb-0">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6">

        {/* ─── HERO BANNER — Dribbble Screen 1 Aesthetic ───────────────────── */}
        <section className="relative overflow-hidden rounded-3xl sm:rounded-[36px] bg-gradient-to-r from-[#8bb2ca] via-[#a8c6db] to-[#c7daf0] text-gray-900 shadow-md min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex items-center">
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Right Model Photo (responsive aesthetic) */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 sm:w-5/12 lg:w-1/2 overflow-hidden pointer-events-none flex items-end justify-end">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
              alt="Fashion Model"
              loading="eager"
              className="h-full w-full object-cover object-top opacity-95 mask-radial"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 35%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 35%)",
              }}
            />
          </div>

          {/* Left Content Area */}
          <div className="relative z-10 w-full max-w-xl p-6 sm:p-10 lg:p-14">
            <span className="inline-flex items-center gap-1.5 text-black/70 font-semibold tracking-widest uppercase text-[11px] sm:text-xs mb-3">
              <Sparkles size={13} className="text-black" />
              New Collection 2026
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-black leading-[1.08] tracking-tight mb-3 sm:mb-4">
              The New Edit
            </h1>

            <p className="text-black/75 text-xs sm:text-sm lg:text-base mb-6 max-w-sm sm:max-w-md font-light leading-relaxed">
              Explore timeless suits and elegant dresses curated exclusively for effortless everyday styling.
            </p>

            {/* Dribbble Style Solid Black Pill "Explore" Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={scrollToShop}
                className="bg-black text-white hover:bg-gray-800 text-xs sm:text-sm font-semibold px-6 py-2.5 sm:py-3 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Explore</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => setCategory("New In")}
                className="bg-white/80 backdrop-blur-md text-black hover:bg-white text-xs sm:text-sm font-semibold px-5 py-2.5 sm:py-3 rounded-full shadow-sm transition-all active:scale-95"
              >
                New Arrivals
              </button>
            </div>
          </div>
        </section>

        {/* ─── SEARCH BAR (Clean & Minimal) ───────────────────────────────── */}
        <div className="mt-5 sm:mt-8 max-w-md mx-auto sm:max-w-xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-gray-400" size={17} />
            <input
              type="text"
              placeholder="Search dresses, tops, suits..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-full bg-white border border-black/5 text-gray-900 placeholder-gray-400 outline-none text-xs sm:text-sm shadow-sm focus:border-black transition-all"
            />
            {keyword && (
              <button
                onClick={() => setKeyword("")}
                className="absolute right-4 text-xs text-gray-400 hover:text-black font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ─── SHOP CATALOG SECTION ────────────────────────────────────────── */}
        <div ref={shopRef} className="pt-8 sm:pt-10 pb-16">
          
          {/* Header Row: "Trending Now" + "View all" (Dribbble style) */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-medium text-gray-900">
              Trending Now
            </h2>
            <button
              onClick={() => {
                setCategory("All");
                setKeyword("");
              }}
              className="text-xs sm:text-sm text-gray-500 hover:text-black font-medium transition-colors"
            >
              View all
            </button>
          </div>

          {/* Dribbble Style Category Filter Pills */}
          <div className="flex overflow-x-auto pb-3 mb-6 gap-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full whitespace-nowrap text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  category === cat
                    ? "bg-black text-white shadow-md scale-105"
                    : "bg-white text-gray-600 border border-black/5 hover:border-black/20 hover:text-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid — 2-column mobile & 4/5-column desktop */}
          {loading && products.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="min-h-[40vh] flex flex-col items-center justify-center text-gray-500 bg-white rounded-3xl p-8 border border-black/5">
              <Search size={36} className="mb-3 text-gray-300" />
              <p className="text-base font-semibold text-gray-800">No styles found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try adjusting your search query or category filters.
              </p>
              <button
                onClick={() => {
                  setKeyword("");
                  setCategory("All");
                }}
                className="mt-4 text-xs font-semibold bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
