const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadStream = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!req.files || req.files.length === 0) {
      return next(new AppError("Please upload at least one image", 400));
    }

    const imageUrls = [];
    for (const file of req.files) {
      const result = await uploadStream(file.buffer);
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
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
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
