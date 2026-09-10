const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "MONGO_URI",
  "FRONTEND_URL",
  "JWT_SECRET",
];

exports.validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(
      `🚨 FATAL ERROR: Missing required environment variables: ${missing.join(", ")}`,
    );
    process.exit(1); // Crash immediately
  }
};
