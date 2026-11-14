import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle2,
  Phone,
  MapPin,
  User,
  Copy,
  ExternalLink,
  CreditCard,
  Banknote,
  AlertCircle,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const getStatusBadge = (status) => {
  switch (status) {
    case "Pending":
      return {
        bg: "bg-amber-100 text-amber-900 border-amber-300",
        label: "⏳ Pending",
      };
    case "Confirmed":
      return {
        bg: "bg-blue-100 text-blue-900 border-blue-300",
        label: "✓ Confirmed",
      };
    case "Shipped":
      return {
        bg: "bg-purple-100 text-purple-900 border-purple-300",
        label: "🚚 Shipped",
      };
    case "Delivered":
      return {
        bg: "bg-emerald-100 text-emerald-900 border-emerald-300",
        label: "🎉 Delivered",
      };
    default:
      return {
        bg: "bg-gray-100 text-gray-800 border-gray-300",
        label: status,
      };
  }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/admin/orders");
      setOrders(data.orders || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleVerifyPayment = async (orderId) => {
    if (
      !window.confirm(
        "Have you verified receiving this payment in your UPI or Bank app?"
      )
    )
      return;
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

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, { id: "copy-toast", duration: 1500 });
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-pulse flex gap-2">
          <div className="w-2.5 h-2.5 bg-black rounded-full" />
          <div className="w-2.5 h-2.5 bg-black rounded-full animation-delay-200" />
          <div className="w-2.5 h-2.5 bg-black rounded-full animation-delay-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 bg-white p-4 sm:p-6 rounded-2xl border-2 border-gray-300 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Total {orders.length} {orders.length === 1 ? "order" : "orders"} placed
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto text-xs font-semibold bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors shadow-xs"
        >
          ↻ Refresh Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center text-gray-400">
          <Package size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-base font-semibold text-gray-700">No orders placed yet</p>
          <p className="text-xs text-gray-400 mt-1">
            New customer orders will appear here automatically.
          </p>
        </div>
      ) : (
        /* High-Contrast Separated Order Cards Container */
        <div className="space-y-6 sm:space-y-8">
          {orders.map((order, index) => {
            const statusInfo = getStatusBadge(order.status);
            const isUpi =
              order.paymentMethod === "UPI" || order.paymentMethod === "Online";

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border-2 border-gray-300/90 shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden"
              >
                {/* ── Top Header Bar (Solid Contrast) ── */}
                <div className="bg-[#111827] text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {/* Index Tag */}
                    <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                      #{index + 1}
                    </span>

                    {/* Order ID */}
                    <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm text-gray-200">
                      <span>ID: {order._id}</span>
                      <button
                        onClick={() => copyToClipboard(order._id, "Order ID")}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Copy Order ID"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Timestamp */}
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock size={13} />
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border shadow-xs ${statusInfo.bg}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* ── Main Order Body (Grid Layout) ── */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                  
                  {/* Column 1: Customer & Shipping Details */}
                  <div className="space-y-3 pt-2 md:pt-0">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User size={14} className="text-gray-600" />
                      Customer & Delivery
                    </h3>

                    <div className="bg-[#f9fafb] p-3.5 rounded-xl border border-gray-200/80 space-y-2">
                      <p className="font-bold text-gray-900 text-sm">
                        {order.user?.name || "Customer"}
                      </p>

                      {order.user?.email && (
                        <p className="text-xs text-gray-500 truncate">
                          {order.user.email}
                        </p>
                      )}

                      {order.phone && (
                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={`tel:${order.phone}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            <Phone size={12} />
                            <span>{order.phone}</span>
                          </a>
                        </div>
                      )}

                      <div className="flex items-start gap-1.5 text-xs text-gray-600 pt-1 border-t border-gray-200/60 mt-2">
                        <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          {order.shippingAddress || "No address provided"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Ordered Items */}
                  <div className="space-y-3 pt-4 md:pt-0 md:px-5">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Package size={14} className="text-gray-600" />
                      Ordered Items ({order.orderItems?.length || 0})
                    </h3>

                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {order.orderItems?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-[#f9fafb] p-2.5 rounded-xl border border-gray-200/80"
                        >
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt=""
                              className="w-12 h-14 object-cover rounded-lg bg-gray-200 shrink-0 border border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-14 bg-gray-200 rounded-lg shrink-0 flex items-center justify-center text-[10px] text-gray-400">
                              No Img
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            {item.product ? (
                              <Link
                                to={`/product/${item.product._id}`}
                                target="_blank"
                                className="text-xs font-semibold text-gray-900 hover:text-black line-clamp-1 flex items-center gap-1 hover:underline"
                              >
                                <span>{item.product.name}</span>
                                <ExternalLink size={11} className="shrink-0 text-gray-400" />
                              </Link>
                            ) : (
                              <span className="text-xs text-gray-400">
                                Product Deleted
                              </span>
                            )}
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              Qty: <span className="font-bold text-gray-800">{item.quantity}</span> × ₹{(item.price || item.product?.price || 0).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Payment & Verification */}
                  <div className="space-y-3 pt-4 md:pt-0 md:pl-5">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard size={14} className="text-gray-600" />
                      Payment & Total
                    </h3>

                    {/* Total Amount Tag */}
                    <div className="bg-[#f9fafb] p-3.5 rounded-xl border border-gray-200/80 space-y-2.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-gray-500 font-medium">
                          Total Amount:
                        </span>
                        <span className="text-xl font-bold font-sans text-gray-900">
                          ₹{order.totalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Payment Mode */}
                      <div className="pt-2 border-t border-gray-200/60">
                        {isUpi ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                                <CreditCard size={11} />
                                UPI Online
                              </span>
                              {order.paymentStatus === "Paid" ? (
                                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                                  ✓ Verified
                                </span>
                              ) : (
                                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 animate-pulse">
                                  ⏳ Needs Verification
                                </span>
                              )}
                            </div>

                            {/* UTR Number Badge */}
                            {order.paymentDetails?.utrNumber && (
                              <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-purple-200">
                                <span className="text-[11px] font-mono font-bold text-purple-950">
                                  UTR: {order.paymentDetails.utrNumber}
                                </span>
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      order.paymentDetails.utrNumber,
                                      "UTR Number"
                                    )
                                  }
                                  className="text-gray-400 hover:text-black p-1"
                                  title="Copy UTR"
                                >
                                  <Copy size={12} />
                                </button>
                              </div>
                            )}

                            {/* Verification Button */}
                            {order.paymentStatus !== "Paid" && (
                              <button
                                type="button"
                                onClick={() => handleVerifyPayment(order._id)}
                                className="w-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-98"
                              >
                                <CheckCircle2 size={14} />
                                Confirm Payment Received
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-800 bg-gray-100 border border-gray-300 px-2 py-0.5 rounded-md">
                                <Banknote size={11} />
                                Cash on Delivery
                              </span>
                              {order.paymentStatus === "Paid" ? (
                                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                  ✓ Cash Collected
                                </span>
                              ) : (
                                <span className="text-[11px] text-gray-500">
                                  Pending Collection
                                </span>
                              )}
                            </div>

                            {order.paymentStatus !== "Paid" && (
                              <button
                                type="button"
                                onClick={() => handleVerifyPayment(order._id)}
                                className="w-full text-xs font-semibold bg-gray-800 hover:bg-black text-white py-1.5 px-3 rounded-xl transition-all"
                              >
                                Mark Cash Collected
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Bottom Action Row: Update Status ── */}
                <div className="bg-[#f9fafb] px-4 sm:px-6 py-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600">
                      Order Status:
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="text-xs font-bold border-2 border-gray-300 rounded-xl px-3 py-1.5 outline-none focus:border-black bg-white shadow-xs cursor-pointer"
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Confirmed">✓ Confirmed</option>
                      <option value="Shipped">🚚 Shipped</option>
                      <option value="Delivered">🎉 Delivered</option>
                    </select>
                  </div>

                  <span className="text-[11px] text-gray-400">
                    Order ID: #{order._id.slice(-8)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
