const joi = require("joi");

exports.productSchema = joi.object({
  name: joi.string().min(3).required(),
  category: joi.string().required(),
  price: joi.number().required(),
  description: joi.string().min(10).required(),
  images: joi.array().items(joi.string().allow("").allow(null).optional()),
});
