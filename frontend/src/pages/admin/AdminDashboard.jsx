import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const AdminDashboard = () => {
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
      toast.error("Failed to fetch orders");
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
      toast.success("Customer data accessed and logged in audit trail.");
    } catch (error) {
      toast.error("Failed to access customer data");
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
      <h1 className="text-3xl font-display font-bold text-brand-900 mb-8">
        Admin Dashboard
      </h1>

      <div className="bg-white rounded-xl border border-brand-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans min-w-[800px]">
            <thead className="bg-brand-50 border-b border-brand-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                  Order ID
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
                  className="hover:bg-brand-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                    {order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-sm text-brand-900 font-medium">
                    {order.user.name}
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
    </div>
  );
};

export default AdminDashboard;
