const express = require("express");
const { createOrder, getMyOrders } = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");
const {
  validateRequest,
  checkoutSchema,
} = require("../middlewares/validateRequest");

const router = express.Router();

router.post("/", protect, validateRequest(checkoutSchema), createOrder);
router.get("/myorders", protect, getMyOrders);

module.exports = router;
