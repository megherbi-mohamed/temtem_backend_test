const express = require("express");
const router = express.Router();
const auth_controller = require("@controllers/auth_controller");
const auth_service = require("@services/auth_service");
const auth_middleware = require("@middlewares/auth_middleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentification
 */

/**
 * @swagger
 *  /api/auth/register:
 *    post:
 *      summary: Register
 *      tags: [Auth]
 *      requestBody:
 *        description: User credentials
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/registerSchema'
 *      responses:
 *        200:
 *          description: User successfully logged in
 */
router.post("/register", auth_controller.register);

/**
 * @swagger
 *  /api/auth/login:
 *    post:
 *      summary: Login
 *      tags: [Auth]
 *      requestBody:
 *        description: User credentials
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/loginSchema'
 *      responses:
 *        200:
 *          description: User successfully logged in
 */
router.post("/login", auth_controller.login);

/**
 * @swagger
 *  /api/auth/refreshToken:
 *    post:
 *      summary: Refresh Token
 *      tags: [Auth]
 *      requestBody:
 *        description: Resfresh token
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/refreshTokenSchema'
 *      responses:
 *        200:
 *          description: New token
 */
router.post("/refreshToken", auth_controller.refreshToken);

module.exports = router;
