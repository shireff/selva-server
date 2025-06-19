import express from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Mock products database
let products = [
  {
    id: "1",
    name: "Professional Hard Gel Kit",
    description:
      "Complete hard gel kit with everything you need for professional nail applications at home.",
    price: 89.99,
    discountPrice: 69.99,
    images: [
      "https://images.pexels.com/photos/3997396/pexels-photo-3997396.jpeg",
      "https://images.pexels.com/photos/3997397/pexels-photo-3997397.jpeg",
    ],
    category: "Kits",
    brand: "Selva Pro",
    inStock: true,
    stockQuantity: 25,
    rating: 4.8,
    reviews: 124,
    tags: ["professional", "complete-kit", "hard-gel"],
    isNew: true,
    isFeatured: true,
  },
  {
    id: "2",
    name: "UV LED Nail Lamp 48W",
    description:
      "Professional UV LED nail lamp with 48W power for quick and efficient curing.",
    price: 79.99,
    images: [
      "https://images.pexels.com/photos/3997398/pexels-photo-3997398.jpeg",
    ],
    category: "Equipment",
    brand: "NailTech",
    inStock: true,
    stockQuantity: 15,
    rating: 4.6,
    reviews: 89,
    tags: ["uv-lamp", "led", "professional"],
    isNew: false,
    isFeatured: true,
  },
  {
    id: "3",
    name: "Hard Gel Base Coat",
    description:
      "Premium base coat for hard gel applications, ensures long-lasting adhesion.",
    price: 24.99,
    images: [
      "https://images.pexels.com/photos/3997399/pexels-photo-3997399.jpeg",
    ],
    category: "Gels",
    brand: "Selva Pro",
    inStock: true,
    stockQuantity: 50,
    rating: 4.7,
    reviews: 156,
    tags: ["base-coat", "hard-gel", "adhesion"],
    isNew: false,
    isFeatured: false,
  },
  {
    id: "4",
    name: "Nail File Set Professional",
    description:
      "Set of professional nail files in various grits for perfect nail shaping.",
    price: 19.99,
    images: [
      "https://images.pexels.com/photos/3997400/pexels-photo-3997400.jpeg",
    ],
    category: "Tools",
    brand: "ProTools",
    inStock: true,
    stockQuantity: 75,
    rating: 4.5,
    reviews: 203,
    tags: ["nail-files", "professional", "shaping"],
    isNew: false,
    isFeatured: false,
  },
  {
    id: "5",
    name: "Cuticle Oil Vitamin E",
    description:
      "Nourishing cuticle oil enriched with Vitamin E for healthy nail growth.",
    price: 14.99,
    images: [
      "https://images.pexels.com/photos/3997401/pexels-photo-3997401.jpeg",
    ],
    category: "Care",
    brand: "NailCare Plus",
    inStock: true,
    stockQuantity: 100,
    rating: 4.9,
    reviews: 87,
    tags: ["cuticle-oil", "vitamin-e", "nourishing"],
    isNew: true,
    isFeatured: false,
  },
  {
    id: "6",
    name: "Hard Gel Color Collection",
    description:
      "Set of 12 popular hard gel colors for endless nail art possibilities.",
    price: 149.99,
    discountPrice: 119.99,
    images: [
      "https://images.pexels.com/photos/3997402/pexels-photo-3997402.jpeg",
    ],
    category: "Gels",
    brand: "Selva Pro",
    inStock: true,
    stockQuantity: 20,
    rating: 4.8,
    reviews: 95,
    tags: ["color-collection", "hard-gel", "nail-art"],
    isNew: false,
    isFeatured: true,
  },
];
let cartItems = [];

const categories = ["Kits", "Equipment", "Gels", "Tools", "Care"];
const brands = ["Selva Pro", "NailTech", "ProTools", "NailCare Plus"];

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
router.get("/", (req, res) => {
  try {
    const { category, brand, search } = req.query;

    let filteredProducts = products;

    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    if (brand && brand !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.brand === brand
      );
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    res.json({
      products: filteredProducts,
      categories: categories,
      brands: brands,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

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
router.get("/:id", (req, res) => {
  try {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

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
router.post("/cart", (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if item already in cart
    const existing = cartItems.find((item) => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cartItems.push({ productId, quantity });
    }

    res.json({
      productId,
      quantity: existing ? existing.quantity : quantity,
      message: "Item added to cart successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/cart", (req, res) => {
  try {
    // Populate product details for each cart item
    const detailedCart = cartItems
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? { product, quantity: item.quantity } : null;
      })
      .filter(Boolean);

    res.json({ cart: detailedCart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

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
router.delete("/cart/:productId", (req, res) => {
  try {
    const { productId } = req.params;
    cartItems = cartItems.filter((item) => item.productId !== productId);
    cartItems = [];

    res.json({ message: "Item removed from cart successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

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
router.post("/wishlist", (req, res) => {
  try {
    const { productId } = req.body;

    // Mock wishlist toggle logic
    const isInWishlist = Math.random() > 0.5;

    res.json({
      productId,
      isInWishlist: !isInWishlist,
      message: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
