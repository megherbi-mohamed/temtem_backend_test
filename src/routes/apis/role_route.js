const express = require("express");
const router = express.Router();
const role_controller = require("@controllers/role_controller");
const role_service = require("@services/role_service");
const auth_middleware = require("@middlewares/auth_middleware");

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Role management
 */

/**
 * @swagger
 * /api/role/allRoles:
 *   get:
 *     summary: Get a list of roles based on provided parameters.
 *     tags: [Role]
 *     parameters:
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: ["ASC", "DSC"]
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               roles: [...]
 */
router.get(
  "/allRoles",
  auth_middleware.apiAuth,
  auth_middleware.permissionsAuth({ subject: "roles", action: "read" }),
  role_controller.pagination
);

/**
 * @swagger
 * /api/role/{id}:
 *   get:
 *     summary: Get role details based on provided id.
 *     tags: [Role]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of role.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {...}
 */
router.get(
  "/:id",
  auth_middleware.apiAuth,
  auth_middleware.permissionsAuth({ subject: "roles", action: "read" }),
  role_service.findOne
);

/**
 * @swagger
 *  /api/role/update/{id}:
 *    patch:
 *      summary: Update Role
 *      tags: [Role]
 *      parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Role to update.
 *      requestBody:
 *        description: The Role to update
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdateRoleSchema'
 *      responses:
 *        201:
 *          description: Staff successfully updated
 */
router.patch(
  "/update/:id",
  auth_middleware.apiAuth,
  auth_middleware.permissionsAuth({ subject: "roles", action: "update" }),
  role_controller.update
);

/**
 * @swagger
 *  /api/role/status/{id}:
 *    patch:
 *      summary: Update Role status (active or restrict)
 *      tags: [Role]
 *      parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Role to update.
 *      requestBody:
 *        description: The Role to update
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdateRoleStatusSchema'
 *      responses:
 *        201:
 *          description: Staff successfully updated
 */
router.patch(
  "/status/:id",
  auth_middleware.apiAuth,
  auth_middleware.permissionsAuth({ subject: "roles", action: "manage" }),
  role_controller.status
);

/**
 * @swagger
 *  /api/role/delete/{id}:
 *    delete:
 *      summary: Delete Role
 *      tags: [Role]
 *      parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *          type: string
 *         description: The ID of the Role to delete.
 *      responses:
 *        204:
 *          description: Staff successfully deleted
 */
router.delete(
  "/delete/:id",
  auth_middleware.apiAuth,
  auth_middleware.permissionsAuth({ subject: "role", action: "delete" }),
  role_service.delete
);

module.exports = router;
