import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await api.get("/admin/audit-logs");
      setLogs(data.logs);
    } catch (error) {
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading logs...</div>;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-brand-900 mb-6">Audit Logs (PII Access)</h1>

      <div className="overflow-x-auto bg-white rounded-lg border border-gray-100">
        <table className="w-full text-left font-sans">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Admin</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Action</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Target Order ID</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Accessed Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                  {log.adminId?.name || "Unknown"} <br />
                  <span className="text-xs text-gray-500 font-normal">{log.adminId?.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    log.action.includes('PII') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-gray-500">
                  {log.targetOrderId?._id || "Deleted Order"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <pre className="text-xs bg-gray-50 p-2 rounded max-w-[200px] overflow-auto">
                    {JSON.stringify(log.accessedData, null, 2)}
                  </pre>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No audit logs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
