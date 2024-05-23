const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const j2s = require("joi-to-swagger");

// Schema validation
const auth_validation = require("@validations/auth_validation");

const schemas = {
  loginSchema: j2s(auth_validation.loginSchema).swagger,
  registerSchema: j2s(auth_validation.registerSchema).swagger,
};
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Temtem_test",
      version: "1.0.0",
    },

    security: [
      {
        Bearer: [],
      },
    ],
    components: {
      schemas,
      securitySchemes: {
        Bearer: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
  },
  apis: ["src/routes/apis/*.js"],
};

router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerJsdoc(options)));

module.exports = router;
