const createError = require("http-errors");
const pagination_validation = require("@validations/pagination_validation");
const role_validation = require("@validations/role_validation");
const role_service = require("@services/role_service");

exports.pagination = async (req, res, next) => {
  const query = req.query;
  const role = req.auth_payload.role;
  const id = req.auth_payload.id;
  try {
    let paginatedRoleSchemaValidation =
      await pagination_validation.paginationSchema.validateAsync(query);
    paginatedRoleSchemaValidation.role = role;
    paginatedRoleSchemaValidation.id = id;
    const roles = await role_service.pagination(paginatedRoleSchemaValidation);
    res.status(200).send({
      status: "success",
      statusCode: 200,
      data: roles,
    });
  } catch (err) {
    if (err.isJoi) return next(createError.UnprocessableEntity(err.message));
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const id = req.params.id;
  try {
    let updateRoleValidation =
      await role_validation.updateRoleSchema.validateAsync(req.body);
    updateRoleValidation.id = id;

    await role_service.update(updateRoleValidation);

    res.status(201).send({
      status: "success",
      statusCode: 200,
      message: "Staff successfully updated",
    });
  } catch (err) {
    if (err.isJoi) return next(createError.UnprocessableEntity(err.message));
    next(err);
  }
};
