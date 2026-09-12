import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import FloatingContact from "./components/layout/FloatingContact";
import Navbar from "./components/layout/Navbar";
import BottomNav from "./components/layout/BottomNav";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Account from "./pages/Account";

// Admin Imports
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";

import Footer from "./components/layout/Footer";

// Sirf Logged in users ke liye
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Sirf Admin ke liye
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans bg-brand-50">
            <Navbar />
            <main className="flex-grow w-full max-w-[1400px] mx-auto">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Auth />} />

                {/* User Protected Routes */}
                <Route
                  path="/checkout"
                  element={
                    <RequireAuth>
                      <Checkout />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <RequireAuth>
                      <Account />
                    </RequireAuth>
                  }
                />

                {/* Admin Protected Routes inside Layout */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="add-product" element={<AddProduct />} />
                  <Route path="products/edit/:id" element={<EditProduct />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="audit-logs" element={<AdminAuditLogs />} />
                </Route>
              </Routes>
            </main>
            <Footer />
            <FloatingContact />
            <BottomNav />
          </div>
          <Toaster
            position="top-center"
            toastOptions={{
              className: "font-sans font-medium text-sm",
              style: {
                borderRadius: "8px",
                background: "#111111",
                color: "#fff",
              },
            }}
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
