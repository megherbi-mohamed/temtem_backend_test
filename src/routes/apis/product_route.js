const express = require("express");
const router = express.Router();
const product_controller = require("@controllers/product_controller");
const product_service = require("@services/product_service");
const auth_middleware = require("@middlewares/auth_middleware");

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management
 */

/**
 * @swagger
 * /api/product/allProducts:
 *   get:
 *     summary: Get a list of products based on provided parameters.
 *     tags: [Product]
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
 *         name: category
 *         schema:
 *           type: string
 *           format: string
 *       - in: query
 *         name: price
 *         schema:
 *           type: string
 *           format: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               products: [...]
 */
router.get(
  "/allProducts",
  auth_middleware.apiAuth,
  auth_middleware.permissionsAuth({ subject: "products", action: "read" }),
  product_controller.pagination
);

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get product details based on provided id.
 *     tags: [Product]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of product.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               product: {...}
 */
router.get(
  "/:id",
  auth_middleware.apiAuth,
  auth_middleware.permissionsAuth({ subject: "products", action: "read" }),
  product_service.findOne
);

/**
 * @swagger
 *  /api/product/create:
 *    post:
 *      summary: Create new product
 *      tags: [Product]
 *      requestBody:
 *        description: The product to create
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/productSchema'
 *      responses:
 *        201:
 *          description: Product successfully created
 */
router.post(
  "/create",
  auth_middleware.apiAuth,
  auth_middleware.permissionsAuth({ subject: "products", action: "create" }),
  product_controller.create
);

/**
 * @swagger
 *  /api/product/update/{id}:
 *    patch:
 *      summary: Update Product
 *      tags: [Product]
 *      parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Product to update.
 *      requestBody:
 *        description: The Product to update
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/productSchema'
 *      responses:
 *        201:
 *          description: Product successfully updated
 */
router.patch(
  "/update/:id",
  auth_middleware.apiAuth,
  auth_middleware.permissionsAuth({ subject: "products", action: "update" }),
  product_controller.update
);

/**
 * @swagger
 *  /api/product/delete/{id}:
 *    delete:
 *      summary: Delete Product
 *      tags: [Product]
 *      parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *          type: string
 *         description: The ID of the Product to delete.
 *      responses:
 *        204:
 *          description: Product successfully deleted
 */
router.delete(
  "/delete/:id",
  auth_middleware.apiAuth,
  auth_middleware.permissionsAuth({ subject: "products", action: "delete" }),
  product_service.delete
);

module.exports = router;
