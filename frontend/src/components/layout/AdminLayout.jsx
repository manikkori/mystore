import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Users, FileText, PlusCircle } from "lucide-react";

const links = [
  { name: "Dashboard", shortName: "Dash", path: "/admin", icon: <LayoutDashboard size={18} /> },
  { name: "Products", shortName: "Products", path: "/admin/products", icon: <Package size={18} /> },
  { name: "Add Product", shortName: "Add", path: "/admin/add-product", icon: <PlusCircle size={18} /> },
  { name: "Orders", shortName: "Orders", path: "/admin/orders", icon: <ShoppingBag size={18} /> },
  { name: "Users", shortName: "Users", path: "/admin/users", icon: <Users size={18} /> },
  { name: "Audit Logs", shortName: "Logs", path: "/admin/audit-logs", icon: <FileText size={18} /> },
];

const AdminLayout = () => {
  const location = useLocation();

  const isActive = (link) =>
    location.pathname === link.path ||
    (link.path !== "/admin" && location.pathname.startsWith(link.path));

  return (
    <div className="flex min-h-[85vh] flex-col md:flex-row gap-0 md:gap-6 p-0 md:p-6 w-full max-w-[1600px] mx-auto">

      {/* ── Desktop Sidebar ───────────────────────────────── */}
      <aside className="hidden md:block md:w-56 lg:w-64 bg-white border border-gray-200/80 rounded-2xl shadow-sm p-4 h-fit sticky top-20 shrink-0">
        <h2 className="text-base font-display font-bold text-gray-900 mb-4 px-2 uppercase tracking-wider">
          Admin Portal
        </h2>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive(link)
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* ── Mobile Top Tab Nav (Edge-to-edge, clean & sticky) ── */}
      <div className="md:hidden bg-white border-b border-gray-200 shadow-xs w-full overflow-x-auto no-scrollbar sticky top-14 z-30">
        <nav className="flex gap-1 p-1.5 min-w-max">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive(link)
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {link.icon}
              <span>{link.shortName}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* ── Main Content Area (Max width & minimal wasted margins on mobile) ── */}
      <main className="flex-1 bg-white md:border md:border-gray-200/80 rounded-none md:rounded-2xl p-2.5 sm:p-5 lg:p-6 min-h-[60vh] w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
