const express = require("express");
const router = express.Router();
const createError = require("http-errors");

// Static files
router.use(express.static("public"));

// API Routing
router.use("/api", require("@routes/apis/api"));

// Non valide routes
router.use((req, res, next) => {
  next(createError.NotFound());
});

// To handle errors
router.use((err, req, res, next) => {
  let statusCode = err.status || 500;
  // if it's an internal server error
  if (statusCode === 500) console.error(err);

  res.status(statusCode).send({
    status: "error",
    statusCode,
    message: statusCode === 500 ? undefined : err.message,
  });
});

module.exports = router;
