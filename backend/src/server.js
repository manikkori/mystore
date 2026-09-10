require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// Import utilities & middlewares
const { validateEnv } = require("./utils/envValidator");
const { csrfProtection } = require("./middlewares/csrfMiddleware");
const { globalErrorHandler } = require("./middlewares/errorMiddleware");

// 1. Fail-fast Environment Validation
validateEnv();

const app = express();

// 2. Strict CORS Configuration (Vercel <-> Render)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// 3. Security Middlewares
app.use(helmet()); // Secure HTTP headers
app.use(express.json({ limit: "10kb" })); // Body parser with tight limit
app.use(cookieParser()); // Parse cookies for JWT auth
app.use(mongoSanitize()); // Prevent NoSQL Injection attacks

// 4. Anti-CSRF Protection for state-changing routes
app.use(csrfProtection);

// 5. Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("🚨 MongoDB Connection Error:", err);
    process.exit(1);
  });

// 6. Routes Placeholder
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running securely." });
});

// 7. 404 Route Handler
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// 8. Global Error Handling
app.use(globalErrorHandler);

// 9. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`,
  );
});
