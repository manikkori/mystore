exports.globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose Bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Resource not found";
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
