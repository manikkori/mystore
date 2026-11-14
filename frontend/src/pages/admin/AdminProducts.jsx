import { useState, useEffect } from "react";
import { Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import api from "../../services/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data.products);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500">Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-bold text-brand-900">Products</h1>
        <Link
          to="/admin/add-product"
          className="bg-brand-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-800 transition-colors"
        >
          + Add New
        </Link>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl border border-gray-100">
        <table className="w-full text-left font-sans">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-5 py-4 flex items-center gap-3">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    loading="lazy"
                    className="w-10 h-10 object-cover rounded-lg bg-gray-100"
                  />
                  <span className="text-sm font-medium text-gray-800 line-clamp-1 max-w-[200px]">{product.name}</span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{product.category}</td>
                <td className="px-5 py-4 text-sm font-medium text-gray-800">₹{product.price.toLocaleString("en-IN")}</td>
                <td className="px-5 py-4">
                  <span className={`text-sm font-semibold ${product.stock === 0 ? "text-red-500" : "text-gray-800"}`}>
                    {product.stock === 0 ? "Out of Stock" : product.stock}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/admin/products/edit/${product._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit size={17} />
                    </Link>
                    <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="5" className="px-5 py-8 text-center text-gray-400">No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
            <img
              src={product.images?.[0]}
              alt={product.name}
              loading="lazy"
              className="w-16 h-16 object-cover rounded-xl bg-gray-100 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm line-clamp-1">{product.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="font-bold text-gray-900 text-sm">₹{product.price.toLocaleString("en-IN")}</span>
                <span className={`text-xs font-semibold ${product.stock === 0 ? "text-red-500" : "text-green-600"}`}>
                  {product.stock === 0 ? "Out of Stock" : `Stock: ${product.stock}`}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <Link to={`/admin/products/edit/${product._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Edit size={17} />
              </Link>
              <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-center py-8 text-gray-400">No products found</p>}
      </div>
    </div>
  );
};

export default AdminProducts;
