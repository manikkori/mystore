import { useState, useEffect } from "react";
import api from "../services/api";
import ProductCard from "../components/product/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-brand-900 mb-4">
          New Arrivals
        </h1>
        <p className="text-gray-500 font-sans max-w-2xl">
          Discover our latest collection. Minimalist designs made with premium
          materials.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
