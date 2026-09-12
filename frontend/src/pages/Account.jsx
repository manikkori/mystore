import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Package } from "lucide-react";
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mb-20 sm:mb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-900">
            My Account
          </h1>
          <p className="text-gray-500 font-sans mt-1">
            Welcome back, {user.name}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-brand-100 shadow-sm">
            <h2 className="text-xl font-display font-semibold mb-4">
              Profile Details
            </h2>
            <div className="space-y-3 font-sans text-sm">
              <div>
                <p className="text-gray-500">Full Name</p>
                <p className="font-medium text-brand-900">{user.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email Address</p>
                <p className="font-medium text-brand-900">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Account Type</p>
                <p className="inline-block px-2 py-1 bg-brand-50 text-brand-900 rounded-md mt-1 text-xs font-bold uppercase tracking-wide">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl border border-brand-100 shadow-sm min-h-[400px]">
            <div className="flex items-center gap-2 mb-6">
              <Package className="text-brand-900" size={24} />
              <h2 className="text-xl font-display font-semibold">
                Order History
              </h2>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-24 bg-brand-50 rounded-lg w-full"></div>
                <div className="h-24 bg-brand-50 rounded-lg w-full"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 flex flex-col items-center">
                <Package size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">
                  You haven't placed any orders yet.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-brand-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-100 rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4 hover:border-brand-100 transition-colors"
                  >
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="font-medium text-brand-900">
                        ₹{order.totalPrice.toLocaleString("en-IN")}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          order.status === "Pending"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : order.status === "Confirmed"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
