const express = require("express");
const router = express.Router();
const upload_service = require("@services/upload_service");
const { uploadFileMiddleware } = require("@middlewares/uploadMiddleware");

router.post("/", uploadFileMiddleware, upload_service.upload);

module.exports = router;
