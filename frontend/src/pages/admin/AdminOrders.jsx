import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/admin/orders");
      setOrders(data.orders);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success("Order status updated");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-brand-900 mb-6">Orders Management</h1>

      <div className="overflow-x-auto bg-white rounded-lg border border-gray-100">
        <table className="w-full text-left font-sans min-w-[1000px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Order ID & Items</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Customer</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Total</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Shipping Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 align-top">
                <td className="px-6 py-4">
                  <p className="text-xs font-mono text-gray-500 mb-2">#{order._id}</p>
                  <div className="space-y-3 mt-3">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-md border border-gray-100">
                        {item.product && item.product.images && item.product.images[0] ? (
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name} 
                            className="w-12 h-12 object-cover rounded-md border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 text-[10px] text-center">No Img</div>
                        )}
                        <div className="flex flex-col">
                          {item.product ? (
                            <Link to={`/product/${item.product._id}`} className="text-sm font-medium text-brand-900 hover:underline line-clamp-1">
                              {item.product.name}
                            </Link>
                          ) : (
                            <span className="text-sm font-medium text-gray-500">Deleted Product</span>
                          )}
                          <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">{order.user?.name || "Unknown"}</td>
                <td className="px-6 py-4 text-sm font-medium">₹{order.totalPrice.toLocaleString("en-IN")}</td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-brand-900 bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="font-medium">{order.phone || "N/A"}</p>
                    <p className="text-gray-500 mt-1 max-w-[200px]">{order.shippingAddress || "N/A"}</p>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
