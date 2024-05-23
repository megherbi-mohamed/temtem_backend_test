const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, ref: "categories", required: true },
    price: { type: String, required: true },
    description: { type: String },
    images: [{ type: String, ref: "files", required: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", schema);
