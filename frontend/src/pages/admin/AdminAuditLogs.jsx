import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get("/admin/audit-logs");
        setLogs(data.logs);
      } catch {
        toast.error("Failed to load audit logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div className="p-4 text-center text-gray-500">Loading logs...</div>;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-brand-900 mb-6">Audit Logs (PII Access)</h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl border border-gray-100">
        <table className="w-full text-left font-sans">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Target Order</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Accessed Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-800">{log.adminId?.name || "Unknown"}</p>
                  <p className="text-xs text-gray-400">{log.adminId?.email}</p>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${log.action.includes("PII") ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs font-mono text-gray-400 max-w-[160px] truncate">
                  {log.targetOrderId?._id || "Deleted Order"}
                </td>
                <td className="px-5 py-4">
                  <pre className="text-xs bg-gray-50 p-2 rounded-lg max-w-[220px] overflow-auto border border-gray-100">
                    {JSON.stringify(log.accessedData, null, 2)}
                  </pre>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan="5" className="px-5 py-8 text-center text-gray-400">No audit logs found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {logs.map((log) => (
          <div key={log._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">{log.adminId?.name || "Unknown"}</p>
                <p className="text-xs text-gray-400">{log.adminId?.email}</p>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${log.action.includes("PII") ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
                {log.action}
              </span>
            </div>
            <p className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</p>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Target Order</p>
              <p className="text-xs font-mono text-gray-500 truncate">{log.targetOrderId?._id || "Deleted Order"}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Accessed Data</p>
              <pre className="text-xs bg-gray-50 p-2 rounded-lg overflow-auto max-h-28 border border-gray-100">
                {JSON.stringify(log.accessedData, null, 2)}
              </pre>
            </div>
          </div>
        ))}
        {logs.length === 0 && <p className="text-center py-8 text-gray-400">No audit logs found</p>}
      </div>
    </div>
  );
};

export default AdminAuditLogs;
