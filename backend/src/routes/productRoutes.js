const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController");
const { protect, admin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(protect, admin, upload.array("images", 5), createProduct);

router.route("/:id").get(getProductById);

module.exports = router;
