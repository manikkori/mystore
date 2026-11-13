import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Smartphone,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  QrCode,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
  const { cart, cartTotal, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [storeUpiId, setStoreUpiId] = useState(
    import.meta.env.VITE_STORE_UPI_ID || ""
  );
  const [storeName, setStoreName] = useState(
    import.meta.env.VITE_STORE_NAME || "Girls Fashion Store"
  );

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await api.get("/orders/payment-config");
        if (data?.upiId) {
          setStoreUpiId(data.upiId);
        }
        if (data?.storeName) {
          setStoreName(data.storeName);
        }
      } catch (err) {
        // Fallback to existing state
      }
    };
    fetchConfig();
  }, []);

  const [formData, setFormData] = useState({
    phone: "",
    shippingAddress: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("UPI"); // "UPI" or "COD"
  const [utrNumber, setUtrNumber] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dynamic UPI URI for real app intent & QR Code
  const upiUri = storeUpiId
    ? `upi://pay?pa=${encodeURIComponent(
        storeUpiId,
      )}&pn=${encodeURIComponent(storeName)}&am=${cartTotal}&cu=INR&tn=${encodeURIComponent(
        "Order Payment",
      )}`
    : "";

  const qrCodeUrl = storeUpiId
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(
        upiUri,
      )}`
    : "";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(storeUpiId);
    setCopiedUpi(true);
    toast.success("UPI ID copied to clipboard!");
    setTimeout(() => setCopiedUpi(false), 2500);
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

    if (paymentMethod === "UPI") {
      if (!utrNumber || utrNumber.trim().length < 8) {
        toast.error(
          "Please enter the 12-digit UPI Reference / UTR Number from your payment app",
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
        paymentMethod,
        utrNumber: paymentMethod === "UPI" ? utrNumber.trim() : undefined,
        upiId: paymentMethod === "UPI" ? storeUpiId : undefined,
      });

      if (paymentMethod === "UPI") {
        toast.success(
          "Order placed! Payment verification pending with seller.",
          { duration: 4000 },
        );
      } else {
        toast.success(
          "Order placed successfully! Cash will be collected on delivery.",
        );
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
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-display font-bold mb-4 text-brand-900">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
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
        <span className="text-xs bg-brand-100 text-brand-900 font-semibold px-3 py-1 rounded-full">
          Safe & Verified
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Left Column: Form & Payment */}
        <div className="w-full lg:w-3/5 order-2 lg:order-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Delivery Details */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-brand-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold font-display text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-900 text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  Delivery Details
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
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-900 focus:border-brand-900 outline-none transition-all font-mono text-sm"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    We will send delivery status updates to this number.
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
                    placeholder="House/Flat No., Building, Street, Landmark, City, State, Pincode"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-900 focus:border-brand-900 outline-none transition-all resize-none text-sm"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-brand-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold font-display text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-900 text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  Choose Payment Method
                </h2>
                <div className="flex items-center gap-1 text-xs text-green-700 font-medium">
                  <ShieldCheck size={16} /> Secure Verification
                </div>
              </div>

              <div className="space-y-4">
                {/* Option 1: Real UPI Payment */}
                <div
                  onClick={() => setPaymentMethod("UPI")}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === "UPI"
                      ? "border-brand-900 bg-brand-50/40 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "UPI"
                            ? "border-brand-900"
                            : "border-gray-400"
                        }`}
                      >
                        {paymentMethod === "UPI" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-900" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Smartphone size={20} className="text-brand-900" />
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                          Direct UPI (Google Pay, PhonePe, Paytm, QR)
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-green-100 text-green-800 px-2 py-0.5 rounded-md">
                      Fastest
                    </span>
                  </div>

                  {/* Real UPI Payment Details & QR Code */}
                  {paymentMethod === "UPI" && (
                    <div className="mt-4 pt-4 border-t border-brand-100 space-y-4 cursor-default" onClick={(e) => e.stopPropagation()}>
                      {/* Step A: Scan & Pay */}
                      <div className="bg-white p-4 rounded-xl border border-brand-200 flex flex-col sm:flex-row items-center gap-5">
                        <div className="p-2 bg-gray-50 rounded-xl border border-gray-200 shrink-0 text-center">
                          {qrCodeUrl ? (
                            <img
                              src={qrCodeUrl}
                              alt="Scan UPI QR Code"
                              className="w-36 h-36 mx-auto object-contain"
                            />
                          ) : (
                            <div className="w-36 h-36 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-300 rounded-lg">
                              Set UPI ID in .env
                            </div>
                          )}
                          <p className="text-[10px] text-gray-500 mt-1 font-medium flex items-center justify-center gap-1">
                            <QrCode size={12} /> Scan with any UPI app
                          </p>
                        </div>

                        <div className="space-y-2.5 text-center sm:text-left w-full">
                          <div>
                            <span className="text-xs text-gray-500 font-medium">Payable Amount:</span>
                            <p className="text-2xl font-bold text-brand-900 font-mono">
                              ₹{cartTotal.toLocaleString("en-IN")}
                            </p>
                          </div>

                          <div>
                            <span className="text-xs text-gray-500 font-medium">Store UPI ID:</span>
                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                              <code className="bg-gray-100 text-brand-900 font-mono text-xs sm:text-sm px-2.5 py-1 rounded border border-gray-200">
                                {storeUpiId || "Please set STORE_UPI_ID in .env"}
                              </code>
                              {storeUpiId && (
                                <button
                                  type="button"
                                  onClick={handleCopyUpi}
                                  className="text-xs bg-brand-50 hover:bg-brand-100 text-brand-900 p-1.5 rounded border border-brand-200 flex items-center gap-1 transition-colors"
                                  title="Copy UPI ID"
                                >
                                  {copiedUpi ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Mobile Intent Button */}
                          {upiUri && (
                            <div className="pt-1">
                              <a
                                href={upiUri}
                                className="inline-flex items-center justify-center gap-2 bg-brand-900 text-white text-xs font-semibold py-2 px-4 rounded-lg hover:bg-black transition-colors shadow-sm"
                              >
                                <ExternalLink size={14} /> Open in UPI App (Mobile)
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Step B: Enter UTR Number */}
                      <div className="bg-brand-50/60 p-4 rounded-xl border border-brand-200 space-y-2">
                        <label className="block text-xs font-bold text-brand-900 uppercase tracking-wide">
                          Step 2: Enter 12-Digit UPI Reference / UTR Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={utrNumber}
                          onChange={(e) =>
                            setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ""))
                          }
                          placeholder="e.g. 432109876543 (from payment receipt/SMS)"
                          maxLength={16}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 font-mono text-sm focus:ring-2 focus:ring-brand-900 outline-none bg-white"
                          required={paymentMethod === "UPI"}
                        />
                        <div className="flex items-start gap-1.5 text-[11px] text-gray-600 leading-tight">
                          <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>Important:</strong> After completing payment in your GPay/PhonePe/Paytm app, copy the 12-digit UTR/Ref number and paste it here so the seller can verify your payment before dispatching.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Option 2: Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
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
                  <p className="text-xs text-gray-500 pl-8 mt-1">
                    Pay with cash or scan delivery partner's QR code when package is delivered.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-900 text-white py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-black transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    "Placing Order..."
                  ) : paymentMethod === "UPI" ? (
                    <>
                      <CheckCircle2 size={18} />
                      Submit Order with UPI Verification (₹{cartTotal.toLocaleString("en-IN")})
                    </>
                  ) : (
                    <>
                      <Banknote size={18} />
                      Place Order (Cash on Delivery)
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-3">
                  <ShieldCheck size={14} className="text-green-600" />
                  <span>Manual Verification & Genuine Orders Guaranteed</span>
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
    </div>
  );
};

export default Checkout;
