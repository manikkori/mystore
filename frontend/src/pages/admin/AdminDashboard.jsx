import { useState, useEffect } from "react";
import { Users, Package, ShoppingBag, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const statusColor = (status) => {
  if (status === "Pending") return "bg-yellow-100 text-yellow-800";
  if (status === "Confirmed") return "bg-blue-100 text-blue-800";
  if (status === "Shipped") return "bg-purple-100 text-purple-800";
  if (status === "Delivered") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      } catch {
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="animate-pulse flex gap-2">
          <div className="w-2 h-2 bg-brand-900 rounded-full" />
          <div className="w-2 h-2 bg-brand-900 rounded-full animation-delay-200" />
          <div className="w-2 h-2 bg-brand-900 rounded-full animation-delay-400" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-brand-900 mb-6">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
        <StatCard icon={<DollarSign size={22} />} title="Revenue" value={`₹${stats?.totalSales?.toLocaleString("en-IN") || 0}`} color="bg-green-100 text-green-700" />
        <StatCard icon={<ShoppingBag size={22} />} title="Orders" value={stats?.totalOrders || 0} color="bg-blue-100 text-blue-700" />
        <StatCard icon={<Package size={22} />} title="Products" value={stats?.totalProducts || 0} color="bg-orange-100 text-orange-700" />
        <StatCard icon={<Users size={22} />} title="Users" value={stats?.totalUsers || 0} color="bg-purple-100 text-purple-700" />
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-xl border border-gray-100">
          <table className="w-full text-left font-sans">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-xs font-mono text-gray-400 max-w-[160px] truncate">#{order._id}</td>
                  <td className="px-5 py-4 text-sm text-gray-800">{order.user?.name || "Unknown"}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-sm font-medium">₹{order.totalPrice.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 text-[11px] font-semibold rounded-full ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan="5" className="px-5 py-8 text-center text-gray-400">No recent orders</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {recentOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-[10px] font-mono text-gray-400 truncate max-w-[160px]">#{order._id}</p>
                  <p className="font-semibold text-gray-800 text-sm mt-0.5">{order.user?.name || "Unknown"}</p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${statusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="font-bold text-gray-900 text-sm">₹{order.totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>
          ))}
          {recentOrders.length === 0 && (
            <p className="text-center py-8 text-gray-400">No recent orders</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="p-4 sm:p-5 rounded-xl border border-gray-100 bg-white shadow-sm flex items-center gap-3">
    <div className={`p-2.5 sm:p-3 rounded-xl shrink-0 ${color}`}>{icon}</div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 font-medium truncate">{title}</p>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5 truncate">{value}</h3>
    </div>
  </div>
);

export default AdminDashboard;
