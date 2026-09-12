const Order = require("../models/Order");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

exports.createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, phone } = req.body;

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

    const order = await Order.create({
      user: req.user._id,
      orderItems: items,
      shippingAddress,
      phone,
      totalPrice,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};
