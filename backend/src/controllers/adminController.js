const Order = require("../models/Order");
const AuditLog = require("../models/AuditLog");
const AppError = require("../utils/AppError");

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .select("-phone -shippingAddress")
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
