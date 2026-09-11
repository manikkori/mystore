import { useState, useEffect } from "react";
import { Eye, Package, ShoppingBag, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get("/admin/orders"),
        api.get("/products"),
      ]);
      setOrders(ordersRes.data.orders);
      setProducts(productsRes.data.products);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success("Order status updated");
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const viewPII = async (orderId) => {
    try {
      const { data } = await api.get(`/admin/orders/${orderId}/pii`);
      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                phone: data.order.phone,
                shippingAddress: data.order.shippingAddress,
                piiViewed: true,
              }
            : order,
        ),
      );
      toast.success("Customer data accessed and logged");
    } catch (error) {
      toast.error("Failed to access customer data");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await api.delete(`/products/${productId}`);
      toast.success("Product deleted");
      setProducts(products.filter((p) => p._id !== productId));
    } catch (error) {
      toast.error("Failed to delete product");
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
    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-display font-bold text-brand-900">
          Admin Control Panel
        </h1>

        <div className="flex bg-white rounded-lg p-1 border border-brand-100 shadow-sm">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "orders"
                ? "bg-brand-900 text-white"
                : "text-gray-600 hover:bg-brand-50"
            }`}
          >
            <ShoppingBag size={18} /> Orders
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "products"
                ? "bg-brand-900 text-white"
                : "text-gray-600 hover:bg-brand-50"
            }`}
          >
            <Package size={18} /> Products
          </button>
        </div>
      </div>

      {activeTab === "orders" ? (
        <div className="bg-white rounded-xl border border-brand-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans min-w-[1000px]">
              <thead className="bg-brand-50 border-b border-brand-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Order ID & Items
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Contact & Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-brand-50/50 transition-colors align-top"
                  >
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-500 font-mono mb-3">
                        #{order._id.toUpperCase()}
                      </p>
                      <div className="space-y-3">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              {item.product?.images?.[0] ? (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                  N/A
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-brand-900">
                                {item.product?.name || "Deleted Product"}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity} | ₹{item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-900 font-medium">
                      {order.user?.name || "Unknown User"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ₹{order.totalPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="text-sm border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-brand-900 focus:ring-1 focus:ring-brand-900 bg-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {!order.piiViewed ? (
                        <button
                          onClick={() => viewPII(order._id)}
                          className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
                        >
                          <Eye size={16} /> View Data
                        </button>
                      ) : (
                        <div className="text-sm">
                          <p className="font-medium text-brand-900">
                            {order.phone}
                          </p>
                          <p className="text-gray-500 mt-1 max-w-xs">
                            {order.shippingAddress}
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-brand-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans min-w-[800px]">
              <thead className="bg-brand-50 border-b border-brand-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-brand-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-brand-900">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
