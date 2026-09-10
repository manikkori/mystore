const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");

exports.protect = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;

    if (!token) {
      return next(new AppError("Not authorized, no token", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    next(new AppError("Not authorized, token failed", 401));
  }
};

exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    next(new AppError("Not authorized as an admin", 401));
  }
};
