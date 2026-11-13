const Order = require("../models/Order");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

exports.createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      phone,
      paymentMethod,
      utrNumber,
      upiId,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return next(new AppError("No order items provided", 400));
    }

    if (!shippingAddress || shippingAddress.trim().length < 10) {
      return next(new AppError("Please provide a complete shipping address", 400));
    }

    if (!phone || !/^[6-9]\d{9}$/.test(phone.trim())) {
      return next(new AppError("Please provide a valid 10-digit Indian phone number", 400));
    }

    let totalPrice = 0;
    const items = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return next(new AppError(`Product not found`, 404));
      }
      const itemPrice = product.price * item.quantity;
      totalPrice += itemPrice;
      items.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const isUpi = paymentMethod === "UPI" || paymentMethod === "Online";

    if (isUpi) {
      if (!utrNumber || utrNumber.trim().length < 6) {
        return next(
          new AppError(
            "Please provide the 12-digit UPI Reference / UTR Number from your payment app",
            400,
          ),
        );
      }
    }

    const paymentStatus = isUpi ? "Verification Pending" : "Pending";
    const paymentDetails = isUpi
      ? {
          utrNumber: utrNumber.trim(),
          upiId: upiId || process.env.STORE_UPI_ID || "store@upi",
          submittedAt: new Date(),
        }
      : undefined;

    const order = await Order.create({
      user: req.user._id,
      orderItems: items,
      shippingAddress: shippingAddress.trim(),
      phone: phone.trim(),
      totalPrice,
      paymentMethod: isUpi ? "UPI" : "COD",
      paymentStatus,
      paymentDetails,
      status: "Pending",
    });

    const populatedOrder = await Order.findById(order._id).populate(
      "orderItems.product",
      "name images price",
    );

    res.status(201).json({ success: true, order: populatedOrder || order });
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product", "name images price")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};
