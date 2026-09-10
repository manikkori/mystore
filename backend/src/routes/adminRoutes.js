const express = require("express");
const {
  getAllOrders,
  getOrderDetailsWithPII,
  updateOrderStatus,
} = require("../controllers/adminController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect, admin);

router.get("/orders", getAllOrders);
router.get("/orders/:id/pii", getOrderDetailsWithPII);
router.put("/orders/:id/status", updateOrderStatus);

module.exports = router;
