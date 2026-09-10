exports.csrfProtection = (req, res, next) => {
  // Allow safe methods
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // Expect custom header injected by our frontend Axios/Fetch client
  const customHeader = req.headers["x-requested-with"];

  if (!customHeader || customHeader !== "XMLHttpRequest") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: CSRF validation failed. Missing custom header.",
    });
  }

  next();
};
