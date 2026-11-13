import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  Check,
} from "lucide-react";
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
  const [paymentMethod, setPaymentMethod] = useState("Online"); // "Online" or "COD"
  const [onlineType, setOnlineType] = useState("UPI"); // "UPI", "Card", "NetBanking"
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);

  // Online Payment Gateway Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login");
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error(
        "Please enter a valid 10-digit Indian mobile number starting with 6-9",
      );
      return false;
    }

    if (formData.shippingAddress.trim().length < 10) {
      toast.error("Shipping address must be at least 10 characters long");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (paymentMethod === "Online") {
      // Trigger Flipkart / Amazon style secure online payment modal
      setShowPaymentModal(true);
    } else {
      // Direct Cash on Delivery
      await submitOrder({
        method: "COD",
        details: null,
      });
    }
  };

  const submitOrder = async ({ method, details }) => {
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
        paymentMethod: method,
        paymentDetails: details,
      });

      if (method === "Online") {
        toast.success("Payment verified! Your order has been placed.");
      } else {
        toast.success("Order placed successfully! Pay on delivery.");
      }

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
      setShowPaymentModal(false);
      setIsProcessingPayment(false);
      setPaymentSuccess(false);
    }
  };

  const processOnlinePayment = () => {
    setIsProcessingPayment(true);
    // Simulate secure bank gateway transaction processing
    setTimeout(() => {
      setPaymentSuccess(true);
      setTimeout(async () => {
        const txnId = `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
        await submitOrder({
          method: "Online",
          details: {
            transactionId: txnId,
            paymentType: onlineType,
          },
        });
      }, 1000);
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-display font-bold mb-4 text-brand-900">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-brand-900 text-white px-6 py-3 rounded-full font-medium hover:bg-black transition-colors"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mb-20 sm:mb-0 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-display font-bold text-brand-900">
          Checkout
        </h1>
        <span className="text-sm bg-brand-100 text-brand-900 font-medium px-3 py-1 rounded-full">
          Safe & Secure
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Left Column: Delivery Details & Payment Method */}
        <div className="w-full lg:w-3/5 order-2 lg:order-1">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-brand-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold font-display text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-900 text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  Delivery Address
                </h2>
                {user && (
                  <span className="text-xs text-gray-500 font-medium">
                    Order for: {user.name}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-gray-500 text-sm font-medium">
                      +91
                    </span>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-900 focus:border-brand-900 outline-none transition-all font-mono"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Required for delivery updates and contact.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complete Shipping Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    rows="3"
                    placeholder="House / Flat No., Building, Street, Landmark, City, State, Pincode"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-900 focus:border-brand-900 outline-none transition-all resize-none text-sm"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Options (Amazon / Flipkart Style) */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-brand-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold font-display text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-900 text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  Select Payment Option
                </h2>
                <div className="flex items-center gap-1 text-xs text-green-700 font-medium">
                  <ShieldCheck size={16} /> 100% Protected
                </div>
              </div>

              <div className="space-y-3">
                {/* Option 1: Online Payment */}
                <div
                  onClick={() => setPaymentMethod("Online")}
                  className={`p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-3 ${
                    paymentMethod === "Online"
                      ? "border-brand-900 bg-brand-50/40 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "Online"
                            ? "border-brand-900"
                            : "border-gray-400"
                        }`}
                      >
                        {paymentMethod === "Online" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-900" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard size={20} className="text-brand-900" />
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                          Online Payment (UPI, Cards, NetBanking)
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-green-100 text-green-800 px-2 py-0.5 rounded-md">
                      Recommended
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 pl-8">
                    Pay securely using Google Pay, PhonePe, Paytm, Debit/Credit Card or Net Banking.
                  </p>

                  {/* Sub-options for Online Payment */}
                  {paymentMethod === "Online" && (
                    <div className="mt-2 pl-8 pt-3 border-t border-brand-100 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOnlineType("UPI");
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                          onlineType === "UPI"
                            ? "bg-brand-900 text-white border-brand-900 shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <Smartphone size={14} /> UPI
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOnlineType("Card");
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                          onlineType === "Card"
                            ? "bg-brand-900 text-white border-brand-900 shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <CreditCard size={14} /> Cards
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOnlineType("NetBanking");
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                          onlineType === "NetBanking"
                            ? "bg-brand-900 text-white border-brand-900 shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <Lock size={14} /> Net Banking
                      </button>
                    </div>
                  )}
                </div>

                {/* Option 2: Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-2 ${
                    paymentMethod === "COD"
                      ? "border-brand-900 bg-brand-50/40 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "COD"
                            ? "border-brand-900"
                            : "border-gray-400"
                        }`}
                      >
                        {paymentMethod === "COD" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-900" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Banknote size={20} className="text-gray-700" />
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                          Cash on Delivery (Pay on Delivery)
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      Cash / UPI at doorstep
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 pl-8">
                    Pay with cash or UPI to the delivery partner when your package arrives.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-900 text-white py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-black transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    "Processing..."
                  ) : paymentMethod === "Online" ? (
                    <>
                      <Lock size={18} />
                      Proceed to Pay ₹{cartTotal.toLocaleString("en-IN")}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Place Order (Cash on Delivery)
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-3">
                  <ShieldCheck size={14} className="text-green-600" />
                  <span>256-bit SSL Secure Encryption & Verified Checkout</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-2/5 order-1 lg:order-2">
          <div className="bg-brand-50 p-6 sm:p-7 rounded-2xl sticky top-24 border border-brand-100 shadow-sm">
            <h2 className="text-lg font-semibold font-display mb-4 text-brand-900">
              Order Summary ({cart.reduce((t, i) => t + i.quantity, 0)} items)
            </h2>

            <div className="space-y-3 mb-6 max-h-[38vh] overflow-y-auto pr-2 divide-y divide-gray-100">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 pt-3 first:pt-0">
                  <div className="w-16 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-brand-100">
                    <img
                      src={
                        item.product.images[0] ||
                        "https://via.placeholder.com/150"
                      }
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow flex justify-between items-start">
                    <div className="pr-2">
                      <h4 className="font-medium text-sm text-brand-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-semibold text-sm mt-1 text-gray-900">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
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

            <div className="border-t border-brand-200 pt-4 space-y-2.5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Items Subtotal</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-semibold uppercase text-xs bg-green-50 px-2 py-0.5 rounded">
                  Free
                </span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-bold text-brand-900 pt-3 border-t border-brand-200">
                <span>Order Total</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Online Payment Gateway Modal (Flipkart / Amazon style) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-brand-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-brand-300" />
                <h3 className="font-display font-semibold text-lg">
                  Secure Online Payment
                </h3>
              </div>
              <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-brand-100 font-mono">
                ₹{cartTotal.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {paymentSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Check size={36} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    Payment Successful!
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">
                    Creating your order and preparing dispatch...
                  </p>
                  <span className="text-xs font-mono bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    Verified by Payment Gateway
                  </span>
                </div>
              ) : isProcessingPayment ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-900 rounded-full animate-spin mx-auto mb-4" />
                  <h4 className="text-base font-semibold text-gray-900 mb-1">
                    Connecting to Payment Gateway...
                  </h4>
                  <p className="text-xs text-gray-500">
                    Authorizing transaction securely. Please do not close this window.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Paying To</p>
                      <p className="font-semibold text-brand-900">
                        Girls Fashion Store
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total Payable</p>
                      <p className="font-bold text-lg text-brand-900">
                        ₹{cartTotal.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {onlineType === "UPI" && (
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Enter UPI ID / VPA
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. mobileNumber@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-900 outline-none"
                      />
                      <div className="flex gap-2">
                        {["@okaxis", "@okhdfcbank", "@paytm", "@ybl"].map(
                          (handle) => (
                            <button
                              key={handle}
                              type="button"
                              onClick={() => {
                                const base = upiId.split("@")[0] || "user";
                                setUpiId(`${base}${handle}`);
                              }}
                              className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                            >
                              {handle}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {onlineType === "Card" && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="4532 •••• •••• 8892"
                          maxLength={19}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-900 outline-none font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            placeholder="12/28"
                            maxLength={5}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-900 outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            placeholder="•••"
                            maxLength={3}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-900 outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {onlineType === "NetBanking" && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-gray-700 uppercase">
                        Select Popular Bank
                      </label>
                      <select className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-900 outline-none bg-white">
                        <option>State Bank of India (SBI)</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                        <option>Punjab National Bank</option>
                      </select>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="w-1/3 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={processOnlinePayment}
                      className="w-2/3 py-3 bg-brand-900 hover:bg-black text-white rounded-xl font-semibold text-sm transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <Lock size={16} /> Pay ₹{cartTotal.toLocaleString("en-IN")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
