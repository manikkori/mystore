const express = require("express");
const {
  registerUser,
  loginUser,
  googleLogin,
  logoutUser,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/logout", protect, logoutUser);

module.exports = router;
