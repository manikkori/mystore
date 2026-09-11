const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProductReview
} = require("../controllers/productController");
const { protect, admin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(protect, admin, upload.array("images", 5), createProduct);

router.route("/:id/reviews").post(protect, createProductReview);

router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

module.exports = router;
