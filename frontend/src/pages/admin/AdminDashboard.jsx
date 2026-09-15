import { useState, useEffect } from "react";
import { Users, Package, ShoppingBag, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

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
      } catch (error) {
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse flex gap-2">
          <div className="w-2 h-2 bg-brand-900 rounded-full"></div>
          <div className="w-2 h-2 bg-brand-900 rounded-full animation-delay-200"></div>
          <div className="w-2 h-2 bg-brand-900 rounded-full animation-delay-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-brand-900 mb-6">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<DollarSign size={24} />}
          title="Total Revenue"
          value={`₹${stats?.totalSales?.toLocaleString("en-IN") || 0}`}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          icon={<ShoppingBag size={24} />}
          title="Total Orders"
          value={stats?.totalOrders || 0}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          icon={<Package size={24} />}
          title="Products"
          value={stats?.totalProducts || 0}
          color="bg-orange-100 text-orange-700"
        />
        <StatCard
          icon={<Users size={24} />}
          title="Users"
          value={stats?.totalUsers || 0}
          color="bg-purple-100 text-purple-700"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Orders
        </h2>
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-100">
          <table className="w-full text-left font-sans">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Order ID</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Customer</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Date</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Total</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">#{order._id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{order.user?.name || "Unknown"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-medium">₹{order.totalPrice.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                      order.status === "Confirmed" ? "bg-blue-100 text-blue-800" :
                      order.status === "Shipped" ? "bg-purple-100 text-purple-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No recent orders</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm flex items-center gap-4">
    <div className={`p-4 rounded-lg ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
    </div>
  </div>
);

export default AdminDashboard;
