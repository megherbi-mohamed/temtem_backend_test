const joi = require("joi");

exports.uploadSchema = joi.object({
  images: joi
    .binary()
    .max(5242880) // Max file size of 5MB
    .required(),
});
