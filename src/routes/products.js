import express from "express";
import { body, validationResult } from "express-validator";
import {
  addProduct,
  addToCart,
  deleteProduct,
  getCartItems,
  getProductById,
  getProducts,
  removeFromCart,
  toggleWishlist,
  updateProduct,
} from "../controllers/product-controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *         - brand
 *       properties:
 *         id:
 *           type: string
 *           description: Product ID
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Product description
 *         price:
 *           type: number
 *           description: Product price
 *         discountPrice:
 *           type: number
 *           description: Discounted price
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Product images
 *         category:
 *           type: string
 *           description: Product category
 *         brand:
 *           type: string
 *           description: Product brand
 *         inStock:
 *           type: boolean
 *           description: Stock availability
 *         stockQuantity:
 *           type: number
 *           description: Stock quantity
 *         rating:
 *           type: number
 *           description: Product rating
 *         reviews:
 *           type: number
 *           description: Number of reviews
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Product tags
 *         isNew:
 *           type: boolean
 *           description: Whether product is new
 *         isFeatured:
 *           type: boolean
 *           description: Whether product is featured
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", getProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *               - brand
 *               - stockQuantity
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *               description:
 *                 type: string
 *                 description: Product description
 *               price:
 *                 type: number
 *                 description: Product price
 *               discountPrice:
 *                 type: number
 *                 description: Discounted price
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Product images
 *               category:
 *                 type: string
 *                 description: Product category
 *               brand:
 *                 type: string
 *                 description: Product brand
 *               inStock:
 *                 type: boolean
 *                 description: Whether the product is in stock
 *               stockQuantity:
 *                 type: number
 *                 description: The quantity of the product in stock
 *               rating:
 *                 type: number
 *                 description: Product rating (1-5)
 *               reviews:
 *                 type: number
 *                 description: Number of reviews for the product
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Product tags for filtering
 *               isNew:
 *                 type: boolean
 *                 description: Whether the product is new
 *               isFeatured:
 *                 type: boolean
 *                 description: Whether the product is featured
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("category").notEmpty().withMessage("Category is required"),
    body("brand").notEmpty().withMessage("Brand is required"),
    body("stockQuantity")
      .isInt()
      .withMessage("Stock quantity must be an integer"),
  ],
  addProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               brand:
 *                 type: string
 *               stockQuantity:
 *                 type: number
 *               discountPrice:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               isNew:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.put("/:id", updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteProduct);

/**
 * @swagger
 * /api/products/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item added to cart
 */
router.post("/cart", addToCart);

/**
 * @swagger
 * /api/products/cart:
 *   get:
 *     summary: Get all cart items with product details
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items with product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: object
 *                         description: Product details
 *                       quantity:
 *                         type: number
 *                         description: Quantity of the product in the cart
 *       500:
 *         description: Server error
 */
router.get("/cart", getCartItems);

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart
 */
router.delete("/cart/:productId", removeFromCart);

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Toggle wishlist item
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Wishlist updated
 */
router.post("/wishlist", toggleWishlist);

export default router;
