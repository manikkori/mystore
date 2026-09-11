const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(protect, admin, upload.array("images", 5), createProduct);

router.route("/:id").get(getProductById).delete(protect, admin, deleteProduct);

module.exports = router;
