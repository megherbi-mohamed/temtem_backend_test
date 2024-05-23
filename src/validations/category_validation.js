const joi = require("joi");

exports.categorySchema = joi.object({
  name: joi.string().min(3).required(),
  isCategory: joi.boolean().required(),
  category: joi.string().min(24).allow("").allow(null).optional(),
});
