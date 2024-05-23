const joi = require("joi");

exports.registerSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi.string().min(8).required(),
});

exports.loginSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi.string().required(),
});

exports.refreshTokenSchema = joi.object({
  refresh_token: joi.string().required(),
});
