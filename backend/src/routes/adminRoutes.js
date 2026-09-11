const express = require("express");
const {
  getAllOrders,
  getOrderDetailsWithPII,
  updateOrderStatus,
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAuditLogs
} = require("../controllers/adminController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect, admin);

router.get("/stats", getDashboardStats);

router.get("/orders", getAllOrders);
router.get("/orders/:id/pii", getOrderDetailsWithPII);
router.put("/orders/:id/status", updateOrderStatus);

router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

router.get("/audit-logs", getAuditLogs);

module.exports = router;
