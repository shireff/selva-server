import { validationResult } from "express-validator";
import CartItem from "../modals/cartItemModel.js";
import Product from "../modals/productModel.js";

// Get all products
export const getProducts = async (req, res) => {
  try {
    const { category, brand, search } = req.query;

    let query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (brand && brand !== "all") {
      query.brand = brand;
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { tags: { $in: [searchTerm] } },
      ];
    }

    const products = await Product.find(query);

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let imageUrl = "";
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    const newProduct = new Product({
      ...req.body,
      image: imageUrl,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      brand,
      stockQuantity,
      discountPrice,
      images,
      tags,
      isNew,
      isFeatured,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrl = product.image;
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.stockQuantity = stockQuantity || product.stockQuantity;
    product.discountPrice = discountPrice || product.discountPrice;
    product.tags = tags || product.tags;
    product.isNew = isNew !== undefined ? isNew : product.isNew;
    product.isFeatured =
      isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.image = imageUrl;
    await product.save();

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log("Error updating product", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add to cart (Assuming there's a logged-in user and userId is available in the request)
    const cartItem = new CartItem({
      productId,
      quantity,
      userId: req.user.id, // Assuming the user is authenticated and `req.user.id` is available
    });

    await cartItem.save();

    res.status(201).json({ message: "Item added to cart", cartItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all cart items
export const getCartItems = async (req, res) => {
  try {
    // Fetch all cart items for the user
    const cartItems = await CartItem.find({ userId: req.user.id }).populate(
      "productId"
    );
    res.json({ cart: cartItems });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find and remove the cart item
    const cartItem = await CartItem.findOneAndDelete({
      productId,
      userId: req.user.id,
    });
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Toggle wishlist item
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // Assuming you have a wishlist system or another model to track wishlist items
    // This will just be a simple toggling logic for now

    // For demonstration, we can add/remove the product from the wishlist (in MongoDB)
    const wishlistItem = await WishlistItem.findOne({
      productId,
      userId: req.user.id,
    });

    if (wishlistItem) {
      // Remove from wishlist if it exists
      await wishlistItem.remove();
      res.json({ message: "Item removed from wishlist" });
    } else {
      // Add to wishlist if it doesn't exist
      const newWishlistItem = new WishlistItem({
        productId,
        userId: req.user.id,
      });

      await newWishlistItem.save();
      res.json({ message: "Item added to wishlist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
