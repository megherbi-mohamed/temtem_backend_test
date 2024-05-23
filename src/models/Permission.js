const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
    permissions: [
      {
        subject: { type: String },
        action: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("permissions", schema);
