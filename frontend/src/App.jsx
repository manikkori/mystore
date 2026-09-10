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
import AdminDashboard from "./pages/admin/AdminDashboard";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== "admin") return <Navigate to="/" />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans bg-brand-50">
            <Navbar />
            <main className="flex-grow w-full max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>
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
