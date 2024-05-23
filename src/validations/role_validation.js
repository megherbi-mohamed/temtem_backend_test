const joi = require("joi");

exports.updateRoleSchema = joi.object({
  permissions: joi
    .array()
    .items({
      subject: joi.string().required(),
      action: joi.string().required(),
    })
    .required(),
});
