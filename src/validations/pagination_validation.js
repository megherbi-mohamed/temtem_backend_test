const joi = require("joi");

exports.paginationSchema = joi.object({
  offset: joi.number().min(0).required(),
  limit: joi.number().min(1).required(),
  order: joi.string().valid("ASC", "DSC").allow("").optional(),
  searchText: joi.string().allow("").optional(),
});

exports.categoryPaginationSchema = exports.paginationSchema.keys({
  isCategory: joi.boolean().required(),
  category: joi.string().min(24).allow("").allow(null).optional(),
});

exports.productPaginationSchema = exports.paginationSchema.keys({
  category: joi.string().allow("").allow(null).optional(),
  price: joi.string().valid("ASC", "DSC").allow("").optional(),
});
