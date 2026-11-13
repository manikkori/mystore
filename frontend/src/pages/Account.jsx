import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LogOut,
  Package,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  Truck,
  Check,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data.orders);
      } catch (error) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await logout();
      navigate("/");
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const getStatusStep = (status) => {
    switch (status) {
      case "Pending":
        return 1;
      case "Confirmed":
        return 2;
      case "Shipped":
        return 3;
      case "Delivered":
        return 4;
      default:
        return 1;
    }
  };

  const steps = [
    { label: "Order Placed", step: 1 },
    { label: "Confirmed", step: 2 },
    { label: "Shipped", step: 3 },
    { label: "Delivered", step: 4 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mb-20 sm:mb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-6 border-b border-brand-100">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-900">
            My Account & Orders
          </h1>
          <p className="text-gray-500 font-sans mt-1">
            Welcome back, <span className="font-semibold text-brand-900">{user.name}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl font-medium transition-colors text-sm"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-brand-100 shadow-sm sticky top-24">
            <h2 className="text-lg font-display font-semibold mb-4 text-brand-900">
              Profile Details
            </h2>
            <div className="space-y-4 font-sans text-sm">
              <div className="bg-brand-50/50 p-3.5 rounded-xl border border-brand-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Full Name
                </p>
                <p className="font-medium text-brand-900 mt-0.5">{user.name}</p>
              </div>

              <div className="bg-brand-50/50 p-3.5 rounded-xl border border-brand-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Email Address
                </p>
                <p className="font-medium text-brand-900 mt-0.5">{user.email}</p>
              </div>

              <div className="bg-brand-50/50 p-3.5 rounded-xl border border-brand-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Account Role
                  </p>
                  <p className="font-medium text-brand-900 capitalize mt-0.5">
                    {user.role}
                  </p>
                </div>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-xs bg-brand-900 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-black transition-colors"
                  >
                    Go to Admin
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order History (Amazon / Flipkart Style) */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-brand-100 shadow-sm min-h-[400px]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <Package className="text-brand-900" size={24} />
                <h2 className="text-xl font-display font-semibold text-brand-900">
                  Order History
                </h2>
              </div>
              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                <div className="h-44 bg-brand-50/70 animate-pulse rounded-2xl w-full"></div>
                <div className="h-44 bg-brand-50/70 animate-pulse rounded-2xl w-full"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <Package size={52} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  No orders placed yet
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm">
                  Explore our latest girls fashion collection and find your favorite styles today.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-brand-900 text-white px-7 py-3 rounded-xl font-medium hover:bg-black transition-all shadow-sm"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const currentStep = getStatusStep(order.status);
                  const isPaid =
                    order.paymentStatus === "Paid" ||
                    order.paymentMethod === "Online";

                  return (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-2xl overflow-hidden hover:border-brand-300 transition-all shadow-sm bg-white"
                    >
                      {/* Order Card Top Bar */}
                      <div className="bg-gray-50/80 px-5 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                          <div>
                            <span className="text-gray-500 block text-[11px] uppercase tracking-wider">
                              Order Placed
                            </span>
                            <span className="font-semibold text-gray-800">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[11px] uppercase tracking-wider">
                              Total Amount
                            </span>
                            <span className="font-bold text-brand-900 text-sm sm:text-base">
                              ₹{order.totalPrice.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[11px] uppercase tracking-wider">
                              Order ID
                            </span>
                            <span className="font-mono text-gray-700">
                              #{order._id.slice(-8).toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Payment Status Badge */}
                        <div>
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
                              <CheckCircle2 size={14} className="text-emerald-600" />
                              Paid Online
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold">
                              <Banknote size={14} className="text-amber-600" />
                              Pay on Delivery (COD)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-6">
                        {/* Order Timeline Tracker (Flipkart / Amazon Style) */}
                        <div className="pt-2">
                          <div className="relative flex justify-between items-center max-w-xl mx-auto px-4">
                            {/* Connecting Line */}
                            <div className="absolute top-3.5 left-8 right-8 h-1 bg-gray-200 -z-0">
                              <div
                                className="h-full bg-emerald-600 transition-all duration-500"
                                style={{
                                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                                }}
                              />
                            </div>

                            {steps.map((s) => {
                              const isCompleted = currentStep >= s.step;
                              const isCurrent = currentStep === s.step;

                              return (
                                <div
                                  key={s.step}
                                  className="flex flex-col items-center z-10"
                                >
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                      isCompleted
                                        ? "bg-emerald-600 text-white ring-4 ring-emerald-50"
                                        : "bg-gray-200 text-gray-500"
                                    }`}
                                  >
                                    {isCompleted ? <Check size={14} /> : s.step}
                                  </div>
                                  <span
                                    className={`text-[11px] mt-2 font-medium ${
                                      isCurrent
                                        ? "text-emerald-800 font-bold"
                                        : isCompleted
                                          ? "text-gray-800"
                                          : "text-gray-400"
                                    }`}
                                  >
                                    {s.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Status Message */}
                        <div
                          className={`p-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 ${
                            order.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-900 border border-emerald-100"
                              : order.status === "Shipped"
                                ? "bg-purple-50 text-purple-900 border border-purple-100"
                                : isPaid
                                  ? "bg-blue-50 text-blue-900 border border-blue-100"
                                  : "bg-amber-50 text-amber-900 border border-amber-100"
                          }`}
                        >
                          {order.status === "Delivered" ? (
                            <>
                              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                              <span>
                                <strong>Order Delivered:</strong> Your package has been safely delivered. Thank you for shopping with us!
                              </span>
                            </>
                          ) : order.status === "Shipped" ? (
                            <>
                              <Truck size={18} className="text-purple-600 shrink-0" />
                              <span>
                                <strong>Package Dispatched:</strong> Your order is on the way to your shipping address.
                              </span>
                            </>
                          ) : isPaid ? (
                            <>
                              <ShieldCheck size={18} className="text-blue-600 shrink-0" />
                              <span>
                                <strong>Payment Verified:</strong> ₹{order.totalPrice.toLocaleString("en-IN")} received via Online Payment. We are preparing your order for dispatch.
                              </span>
                            </>
                          ) : (
                            <>
                              <Clock size={18} className="text-amber-600 shrink-0" />
                              <span>
                                <strong>Cash on Delivery Confirmed:</strong> Please keep ₹{order.totalPrice.toLocaleString("en-IN")} cash or UPI ready when delivery arrives.
                              </span>
                            </>
                          )}
                        </div>

                        {/* Product Items inside Order */}
                        <div className="divide-y divide-gray-100">
                          {order.orderItems.map((item, idx) => (
                            <div
                              key={idx}
                              className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-4"
                            >
                              {item.product &&
                              item.product.images &&
                              item.product.images[0] ? (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="w-14 h-16 object-cover rounded-xl border border-gray-200 shrink-0"
                                />
                              ) : (
                                <div className="w-14 h-16 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 text-[10px] shrink-0">
                                  No Img
                                </div>
                              )}

                              <div className="flex-grow min-w-0">
                                {item.product ? (
                                  <Link
                                    to={`/product/${item.product._id}`}
                                    className="font-medium text-sm text-gray-900 hover:text-brand-900 hover:underline line-clamp-1"
                                  >
                                    {item.product.name}
                                  </Link>
                                ) : (
                                  <span className="font-medium text-sm text-gray-500">
                                    Item (Deleted)
                                  </span>
                                )}
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                  <span>Qty: {item.quantity}</span>
                                  <span>•</span>
                                  <span className="font-semibold text-gray-800">
                                    ₹{item.price.toLocaleString("en-IN")} each
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Shipping Address Footer */}
                        <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
                          <p>
                            <strong className="text-gray-700">Delivery to:</strong>{" "}
                            {order.shippingAddress} (Phone: {order.phone})
                          </p>
                          {order.paymentDetails?.transactionId && (
                            <span className="font-mono text-[11px] text-gray-400">
                              Ref: {order.paymentDetails.transactionId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
