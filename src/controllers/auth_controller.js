const createError = require("http-errors");
const auth_validation = require("@validations/auth_validation");
const auth_service = require("@services/auth_service");

exports.register = async (req, res, next) => {
  try {
    let registerValidation = await auth_validation.registerSchema.validateAsync(
      req.body
    );
    let tokens = await auth_service.register(registerValidation);
    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "User successfully registred",
      ...tokens,
    });
  } catch (err) {
    if (err.isJoi) return next(createError.UnprocessableEntity(err.message));
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    let loginValidation = await auth_validation.loginSchema.validateAsync(
      req.body
    );
    let tokens = await auth_service.login(loginValidation);
    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "User successfully logged in",
      ...tokens,
    });
  } catch (err) {
    if (err.isJoi) return next(createError.UnprocessableEntity(err.message));
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    let refreshTokenValidation =
      await auth_validation.refreshTokenSchema.validateAsync(req.body);
    let tokens = await auth_service.refreshToken(refreshTokenValidation);
    res.status(200).send({
      status: "success",
      statusCode: 200,
      ...tokens,
    });
  } catch (err) {
    if (err.isJoi) return next(createError.UnprocessableEntity(err.message));
    next(err);
  }
};
