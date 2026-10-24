const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const AppError = require("../utils/AppError");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  res
    .status(statusCode)
    .cookie("jwt", token, options)
    .json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new AppError("User already exists", 400));
    }

    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide an email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return next(new AppError("Invalid credentials", 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return next(new AppError("Google token is required", 400));
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return next(
        new AppError("GOOGLE_CLIENT_ID is not configured on the server", 500),
      );
    }

    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      return next(new AppError("Invalid or expired Google token", 401));
    }

    const { email, name } = payload;
    if (!email) {
      return next(new AppError("Google account has no verified email", 400));
    }

    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = crypto.randomBytes(24).toString("hex");
      user = await User.create({
        name: name || "Google User",
        email,
        password: randomPassword,
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.logoutUser = (req, res) => {
  res.cookie("jwt", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};
