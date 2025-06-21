import express from "express";
import { body, validationResult } from "express-validator";
import {
  addToCart,
  getCartItems,
  getProductById,
  getProducts,
  removeFromCart,
  toggleWishlist,
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
