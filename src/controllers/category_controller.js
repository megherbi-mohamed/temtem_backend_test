const createError = require("http-errors");
const pagination_validation = require("@validations/pagination_validation");
const category_validation = require("@validations/category_validation");
const category_service = require("@services/category_service");

exports.pagination = async (req, res, next) => {
  const query = req.query;
  try {
    let paginatedCategorySchemaValidation =
      await pagination_validation.categoryPaginationSchema.validateAsync(query);
    const categories = await category_service.pagination(
      paginatedCategorySchemaValidation
    );
    res.status(200).send({
      status: "success",
      statusCode: 200,
      data: categories,
    });
  } catch (err) {
    if (err.isJoi) return next(createError.UnprocessableEntity(err.message));
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    let createCategoryValidation =
      await category_validation.categorySchema.validateAsync(req.body);
    console.log(req.body);
    await category_service.create(createCategoryValidation);
    res.status(201).send({
      status: "success",
      statusCode: 201,
      message: "Category successfully created",
    });
  } catch (err) {
    if (err.isJoi) return next(createError.UnprocessableEntity(err.message));
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const id = req.params.id;
  try {
    let updateCategoryValidation =
      await category_validation.categorySchema.validateAsync(req.body);
    updateCategoryValidation.id = id;
    await category_service.update(updateCategoryValidation);
    res.status(201).send({
      status: "success",
      statusCode: 200,
      message: "Category successfully updated",
    });
  } catch (err) {
    if (err.isJoi) return next(createError.UnprocessableEntity(err.message));
    next(err);
  }
};
