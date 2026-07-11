export const errorHandler = (err, _req, res, _next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    details: err.details || null,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
