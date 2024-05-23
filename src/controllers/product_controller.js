const createError = require("http-errors");
const pagination_validation = require("@validations/pagination_validation");
const product_validation = require("@validations/product_validation");
const product_service = require("@services/product_service");

exports.pagination = async (req, res, next) => {
  const query = req.query;
  try {
    let paginatedProductSchemaValidation =
      await pagination_validation.productPaginationSchema.validateAsync(query);
    const products = await product_service.pagination(
      paginatedProductSchemaValidation
    );
    res.status(200).send({
      status: "success",
      statusCode: 200,
      data: products,
    });
  } catch (err) {
    if (err.isJoi) return next(createError.UnprocessableEntity(err.message));
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    let createProductValidation =
      await product_validation.productSchema.validateAsync(req.body);
    await product_service.create(createProductValidation);
    res.status(201).send({
      status: "success",
      statusCode: 201,
      message: "Product successfully created.",
    });
  } catch (err) {
    if (err.isJoi) return next(createError.UnprocessableEntity(err.message));
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const id = req.params.id;
  try {
    let updateProductValidation =
      await product_validation.productSchema.validateAsync(req.body);
    updateProductValidation.id = id;
    await product_service.update(updateProductValidation);
    res.status(201).send({
      status: "success",
      statusCode: 200,
      message: "Product successfully updated",
    });
  } catch (err) {
    if (err.isJoi) return next(createError.UnprocessableEntity(err.message));
    next(err);
  }
};
