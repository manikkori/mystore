import { useState, useEffect } from "react";
import { Trash2, Shield, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id) => {
    if (!window.confirm("Are you sure you want to change this user's role?")) return;
    try {
      await api.put(`/admin/users/${id}/role`);
      toast.success("Role updated successfully");
      fetchUsers();
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted successfully");
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500">Loading users...</div>;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-brand-900 mb-6">Users Management</h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl border-2 border-gray-300 shadow-sm">
        <table className="w-full text-left font-sans">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-medium text-gray-800">
                  {user.name} {user._id === currentUser._id && <span className="text-xs text-gray-400">(You)</span>}
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-700"}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  {user._id !== currentUser._id && (
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleRoleChange(user._id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title={user.role === "admin" ? "Demote to User" : "Promote to Admin"}>
                        {user.role === "admin" ? <ShieldAlert size={17} /> : <Shield size={17} />}
                      </button>
                      <button onClick={() => handleDelete(user._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete User">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <div key={user._id} className="bg-white rounded-2xl border-2 border-gray-300 shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {user.name} {user._id === currentUser._id && <span className="text-xs text-gray-400 font-normal">(You)</span>}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{user.email}</p>
                <span className={`mt-1.5 inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-700"}`}>
                  {user.role}
                </span>
              </div>
              {user._id !== currentUser._id && (
                <div className="flex gap-1 shrink-0 ml-2">
                  <button onClick={() => handleRoleChange(user._id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title={user.role === "admin" ? "Demote" : "Promote to Admin"}>
                    {user.role === "admin" ? <ShieldAlert size={17} /> : <Shield size={17} />}
                  </button>
                  <button onClick={() => handleDelete(user._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
                    <Trash2 size={17} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {users.length === 0 && <p className="text-center py-8 text-gray-400">No users found</p>}
      </div>
    </div>
  );
};

export default AdminUsers;
