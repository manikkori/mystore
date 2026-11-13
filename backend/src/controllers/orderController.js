const Order = require("../models/Order");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

exports.createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, phone, paymentMethod, paymentDetails } =
      req.body;

    if (!orderItems || orderItems.length === 0) {
      return next(new AppError("No order items provided", 400));
    }

    let totalPrice = 0;
    const items = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return next(new AppError("Product not found", 404));
      }
      const itemPrice = product.price * item.quantity;
      totalPrice += itemPrice;
      items.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const isOnline = paymentMethod === "Online";
    const paymentStatus = isOnline ? "Paid" : "Pending";
    const sanitizedPaymentDetails = isOnline
      ? {
          transactionId:
            paymentDetails?.transactionId ||
            `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
          paymentType: paymentDetails?.paymentType || "UPI",
          paidAt: new Date(),
        }
      : undefined;

    const order = await Order.create({
      user: req.user._id,
      orderItems: items,
      shippingAddress,
      phone,
      totalPrice,
      paymentMethod: isOnline ? "Online" : "COD",
      paymentStatus,
      paymentDetails: sanitizedPaymentDetails,
      status: "Pending",
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("orderItems.product", "name images price");

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
