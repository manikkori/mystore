const express = require("express");
const {
  createOrder,
  getMyOrders,
  getPaymentConfig,
} = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");
const {
  validateRequest,
  checkoutSchema,
} = require("../middlewares/validateRequest");

const router = express.Router();

router.get("/payment-config", getPaymentConfig);
router.post("/", protect, validateRequest(checkoutSchema), createOrder);
router.get("/myorders", protect, getMyOrders);

module.exports = router;
