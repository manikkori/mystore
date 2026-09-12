const Order = require("../models/Order");
const AuditLog = require("../models/AuditLog");
const User = require("../models/User");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name images price")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

exports.getOrderDetailsWithPII = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name images price");

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    await AuditLog.create({
      adminId: req.user._id,
      action: "VIEW_ORDER_PII",
      targetOrderId: order._id,
      accessedData: {
        phone: order.phone,
        shippingAddress: order.shippingAddress,
      },
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Confirmed", "Shipped"];

    if (!validStatuses.includes(status)) {
      return next(new AppError("Invalid status", 400));
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    await AuditLog.create({
      adminId: req.user._id,
      action: "UPDATE_ORDER_STATUS",
      targetOrderId: order._id,
      accessedData: { newStatus: status },
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    
    const orders = await Order.find();
    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    const recentOrders = await Order.find()
      .select("-phone -shippingAddress")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalSales,
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();
    res.status(200).json({ success: true, message: "User role updated" });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    if (user.role === "admin") {
      return next(new AppError("Cannot delete an admin user", 400));
    }
    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

exports.getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate("adminId", "name email")
      .populate("targetOrderId", "totalPrice status")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, logs });
  } catch (error) {
    next(error);
  }
};
