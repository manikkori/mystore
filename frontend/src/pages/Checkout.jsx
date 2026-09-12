import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
  const { cart, cartTotal, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    shippingAddress: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error(
        "Please enter a valid 10-digit Indian mobile number starting with 6-9",
      );
      return;
    }

    if (formData.shippingAddress.trim().length < 10) {
      toast.error("Shipping address must be at least 10 characters long");
      return;
    }

    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      await api.post("/orders", {
        orderItems,
        shippingAddress: formData.shippingAddress,
        phone: formData.phone,
      });

      toast.success("Order placed successfully! We will call you to confirm.");
      clearCart();
      navigate("/account");
    } catch (error) {
      toast.error(
        error.response?.data?.errors?.[0]?.message ||
          error.response?.data?.message ||
          "Failed to place order",
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-display font-bold mb-4">
          Your cart is empty
        </h2>
        <button
          onClick={() => navigate("/")}
          className="text-brand-900 font-medium underline"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mb-20 sm:mb-0 max-w-5xl mx-auto">
      <h1 className="text-3xl font-display font-bold text-brand-900 mb-8">
        Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-3/5 order-2 lg:order-1">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 sm:p-8 rounded-xl border border-brand-100"
          >
            <h2 className="text-xl font-semibold font-display mb-4">
              Shipping Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-900 focus:border-brand-900 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complete Address
              </label>
              <textarea
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleChange}
                rows="4"
                placeholder="House No, Street, Landmark, City, State, Pincode"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-900 focus:border-brand-900 outline-none transition-all resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-900 text-white py-4 rounded-lg font-medium text-lg hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? "Processing..." : "Place Order via Call Confirmation"}
            </button>
          </form>
        </div>

        <div className="w-full lg:w-2/5 order-1 lg:order-2">
          <div className="bg-brand-50 p-6 sm:p-8 rounded-xl sticky top-24">
            <h2 className="text-xl font-semibold font-display mb-6">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="w-16 h-20 bg-white rounded-md overflow-hidden flex-shrink-0 border border-brand-100">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm text-brand-900 pr-2">
                        {item.product.name}
                      </h4>
                      <p className="text-gray-500 text-xs mt-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-semibold text-sm mt-2">
                        ₹
                        {(item.product.price * item.quantity).toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-brand-900 pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
