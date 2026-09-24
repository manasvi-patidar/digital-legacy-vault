//global error-handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorHandler;
