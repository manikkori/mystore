import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const statusColor = (status) => {
  if (status === "Pending") return "bg-yellow-100 text-yellow-800";
  if (status === "Confirmed") return "bg-blue-100 text-blue-800";
  if (status === "Shipped") return "bg-purple-100 text-purple-800";
  if (status === "Delivered") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/admin/orders");
      setOrders(data.orders);
    } catch {
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
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleVerifyPayment = async (orderId) => {
    if (!window.confirm("Have you confirmed receiving this payment in your bank/UPI app?")) return;
    try {
      await api.put(`/admin/orders/${orderId}/status`, {
        paymentStatus: "Paid",
        status: "Confirmed",
      });
      toast.success("Payment marked as Verified & Paid!");
      fetchOrders();
    } catch {
      toast.error("Failed to update payment status");
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500">Loading orders...</div>;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-brand-900 mb-6">Orders Management</h1>

      {orders.length === 0 && (
        <div className="text-center py-12 text-gray-400">No orders found</div>
      )}

      {/* ── Desktop Table ── */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl border border-gray-100">
        <table className="w-full text-left font-sans">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order & Items</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total & Payment</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shipping</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 align-top">
                <td className="px-5 py-4">
                  <p className="text-[10px] font-mono text-gray-400 mb-2">#{order._id}</p>
                  <div className="space-y-2">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {item.product?.images?.[0] ? (
                          <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg border border-gray-100" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-[9px]">No Img</div>
                        )}
                        <div>
                          {item.product ? (
                            <Link to={`/product/${item.product._id}`} className="text-xs font-medium text-brand-900 hover:underline line-clamp-1 max-w-[160px] block">
                              {item.product.name}
                            </Link>
                          ) : (
                            <span className="text-xs text-gray-400">Deleted Product</span>
                          )}
                          <span className="text-[11px] text-gray-400">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-800">{order.user?.name || "Unknown"}</td>
                <td className="px-5 py-4">
                  <p className="font-bold text-gray-900">₹{order.totalPrice.toLocaleString("en-IN")}</p>
                  <PaymentBadge order={order} onVerify={() => handleVerifyPayment(order._id)} />
                </td>
                <td className="px-5 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-brand-700 bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600 max-w-[180px]">
                  <p className="font-medium">{order.phone || "N/A"}</p>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">{order.shippingAddress || "N/A"}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-100">
              <p className="text-[10px] font-mono text-gray-400 truncate max-w-[55%]">#{order._id}</p>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="p-4 space-y-3">
              {/* Customer */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Customer</p>
                  <p className="font-semibold text-gray-800 text-sm">{order.user?.name || "Unknown"}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Total</p>
                  <p className="font-bold text-gray-900">₹{order.totalPrice.toLocaleString("en-IN")}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Items</p>
                <div className="space-y-2">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                      {item.product?.images?.[0] ? (
                        <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                      )}
                      <div className="flex-1 min-w-0">
                        {item.product ? (
                          <Link to={`/product/${item.product._id}`} className="text-xs font-medium text-brand-900 line-clamp-1 hover:underline">
                            {item.product.name}
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-400">Deleted Product</span>
                        )}
                        <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Payment</p>
                <PaymentBadge order={order} onVerify={() => handleVerifyPayment(order._id)} />
              </div>

              {/* Shipping */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Shipping</p>
                <p className="text-sm font-medium text-gray-700">{order.phone || "N/A"}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{order.shippingAddress || "N/A"}</p>
              </div>

              {/* Status Change */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">Update Status</p>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-700 bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Payment badge component (shared between mobile + desktop)
const PaymentBadge = ({ order, onVerify }) => {
  if (order.paymentMethod === "UPI" || order.paymentMethod === "Online") {
    return (
      <div className="mt-1 space-y-1">
        {order.paymentStatus === "Paid" ? (
          <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            ✓ UPI Paid (Verified)
          </span>
        ) : (
          <div className="space-y-1">
            <span className="inline-block text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
              ⏳ Verification Pending
            </span>
            <button
              type="button"
              onClick={onVerify}
              className="block text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded shadow-sm transition-colors"
            >
              ✓ Confirm Payment Received
            </button>
          </div>
        )}
        {order.paymentDetails?.utrNumber && (
          <p className="text-xs font-mono font-bold text-brand-900 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 inline-block">
            UTR: {order.paymentDetails.utrNumber}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-1 space-y-1">
      <span className="inline-block text-[11px] font-semibold text-gray-800 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">
        Cash on Delivery
      </span>
      {order.paymentStatus === "Paid" ? (
        <span className="block text-[10px] text-emerald-700 font-semibold">(Cash Collected)</span>
      ) : (
        <button
          type="button"
          onClick={onVerify}
          className="block text-[10px] font-medium text-gray-500 hover:text-emerald-700 underline"
        >
          Mark Cash Collected
        </button>
      )}
    </div>
  );
};

export default AdminOrders;
