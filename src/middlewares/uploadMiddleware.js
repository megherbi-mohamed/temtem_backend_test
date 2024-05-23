const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const imageName = `image_${uuidv4()}${fileExtension}`;
    cb(null, imageName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

const uploadFileMiddleware = (req, res, next) => {
  upload.fields([{ name: "images", maxCount: 1 }])(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

module.exports = { uploadFileMiddleware };
