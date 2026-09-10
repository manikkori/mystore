import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import FloatingContact from "./components/layout/FloatingContact";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans bg-brand-50">
            <main className="flex-grow w-full max-w-7xl mx-auto">
              <Routes>
                <Route
                  path="/"
                  element={
                    <div className="p-8 text-center text-2xl font-display font-bold">
                      Home Page
                    </div>
                  }
                />
                <Route
                  path="/product/:id"
                  element={<div>Product Detail</div>}
                />
                <Route path="/checkout" element={<div>Checkout</div>} />
              </Routes>
            </main>
            <FloatingContact />
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
