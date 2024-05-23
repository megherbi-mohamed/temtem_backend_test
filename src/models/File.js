const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    filename: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("files", schema);
