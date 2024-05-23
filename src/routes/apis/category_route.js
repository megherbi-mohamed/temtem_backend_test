const express = require("express");
const router = express.Router();
const category_controller = require("@controllers/category_controller");
const category_service = require("@services/category_service");
const auth_middleware = require("@middlewares/auth_middleware");

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management
 */

/**
 * @swagger
 * /api/category/allCategories:
 *   get:
 *     summary: Get a list of categories based on provided parameters.
 *     tags: [Category]
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
 *       - in: query
 *         name: isCategory
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               categories: [...]
 */
router.get(
  "/allCategories",
  auth_middleware.apiAuth,
  auth_middleware.permissionsAuth({ subject: "categories", action: "read" }),
  category_controller.pagination
);

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Get category details based on provided id.
 *     tags: [Category]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of category.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               category: {...}
 */
router.get(
  "/:id",
  auth_middleware.apiAuth,
  auth_middleware.permissionsAuth({ subject: "categories", action: "read" }),
  category_controller.pagination
);

/**
 * @swagger
 *  /api/category/create:
 *    post:
 *      summary: Create new category
 *      tags: [Category]
 *      requestBody:
 *        description: The category to create
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/categorySchema'
 *      responses:
 *        201:
 *          description: Category successfully created
 */
router.post(
  "/create",
  auth_middleware.apiAuth,
  auth_middleware.permissionsAuth({ subject: "categories", action: "create" }),
  category_controller.create
);

/**
 * @swagger
 *  /api/category/update/{id}:
 *    patch:
 *      summary: Update Category
 *      tags: [Category]
 *      parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to update.
 *      requestBody:
 *        description: The category to update
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/categorySchema'
 *      responses:
 *        201:
 *          description: Category successfully updated
 */
router.patch(
  "/update/:id",
  auth_middleware.apiAuth,
  auth_middleware.permissionsAuth({ subject: "categories", action: "update" }),
  category_controller.update
);

/**
 * @swagger
 *  /api/category/delete/{id}:
 *    delete:
 *      summary: Delete category
 *      tags: [Category]
 *      parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *          type: string
 *         description: The ID of the category to delete.
 *      responses:
 *        204:
 *          description: Category successfully deleted
 */
router.delete(
  "/delete/:id",
  auth_middleware.apiAuth,
  auth_middleware.permissionsAuth({ subject: "categories", action: "delete" }),
  category_service.delete
);

module.exports = router;
