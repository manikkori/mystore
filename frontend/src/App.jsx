import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import FloatingContact from "./components/layout/FloatingContact";
import Navbar from "./components/layout/Navbar";
import BottomNav from "./components/layout/BottomNav";
import Footer from "./components/layout/Footer";

// Statically imported core user pages — ZERO latency on Buy Now, Checkout, Account, Cart!
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Account from "./pages/Account";

// Admin pages — lazy loaded (only downloaded when admin logs in)
const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AddProduct = lazy(() => import("./pages/admin/AddProduct"));
const EditProduct = lazy(() => import("./pages/admin/EditProduct"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminAuditLogs = lazy(() => import("./pages/admin/AdminAuditLogs"));

// Fallback loader for admin routes
const AdminLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="animate-pulse flex gap-2">
      <div className="w-2.5 h-2.5 bg-black rounded-full" />
      <div className="w-2.5 h-2.5 bg-black rounded-full animation-delay-200" />
      <div className="w-2.5 h-2.5 bg-black rounded-full animation-delay-400" />
    </div>
  </div>
);

// Require Auth wrapper
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

// Admin Route wrapper
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col font-sans bg-[#f7f4f1]">
              <Navbar />
              <main className="flex-grow w-full max-w-[1400px] mx-auto">
                <Routes>
                  {/* Public Core Routes — Instant Load */}
                  <Route path="/" element={<Home />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Auth />} />

                  {/* User Protected Routes — Instant Load */}
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
                        <Suspense fallback={<AdminLoader />}>
                          <AdminLayout />
                        </Suspense>
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
                  borderRadius: "10px",
                  background: "#1a1a2e",
                  color: "#fff",
                },
              }}
            />
          </Router>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
