const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "staff"],
    },
    lastRefreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

schema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();
  let hashedPassword = bcrypt.hashSync(user.password, 10);
  user.password = hashedPassword;
  next();
});

module.exports = mongoose.model("users", schema);
