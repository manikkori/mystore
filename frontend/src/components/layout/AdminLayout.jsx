import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Users, FileText, PlusCircle } from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Products", path: "/admin/products", icon: <Package size={20} /> },
    { name: "Add Product", path: "/admin/add-product", icon: <PlusCircle size={20} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingBag size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Audit Logs", path: "/admin/audit-logs", icon: <FileText size={20} /> },
  ];

  return (
    <div className="flex min-h-[80vh] flex-col md:flex-row gap-6 p-4 sm:p-6 lg:p-8 bg-brand-50 w-full">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border border-brand-100 rounded-xl shadow-sm p-4 h-fit sticky top-24">
        <h2 className="text-xl font-display font-bold text-brand-900 mb-6 px-2">
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== "/admin" && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-900 text-white shadow-md"
                    : "text-gray-600 hover:bg-brand-50 hover:text-brand-900"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white border border-brand-100 rounded-xl shadow-sm p-6 overflow-hidden min-h-[60vh]">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
