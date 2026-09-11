const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!req.files || req.files.length === 0) {
      return next(new AppError("Please upload at least one image", 400));
    }

    const imageUrls = [];

    for (const file of req.files) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "products",
      });
      imageUrls.push(result.secure_url);
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      images: imageUrls,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("🚨 Product Upload Error:", error);
    next(
      new AppError(
        error.message || "Server error while uploading product",
        500,
      ),
    );
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    await product.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
