const express = require("express");
const router = express.Router();
const auth_middleware = require("@middlewares/auth_middleware");

// auh route
router.use("/auth", require("@routes/apis/auth_route"));

// file upload route
router.use(
  "/upload",
  auth_middleware.apiAuth,
  require("@routes/apis/upload_route")
);

// category route
router.use("/category", require("@routes/apis/category_route"));

// product route
router.use("/product", require("@routes/apis/product_route"));

module.exports = router;
