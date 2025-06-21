import { validationResult } from "express-validator";
import BlogPost from "../modals/blogPostModel.js";

const categories = [
  "Nail Care",
  "Trends",
  "Tips & Tricks",
  "DIY",
  "Product Reviews",
];

// Get all blog posts
export const getAllBlogPosts = async (req, res) => {
  try {
    const { category, limit, search } = req.query;

    let filter = { isPublished: true };
    if (category && category !== "all") {
      filter.category = category;
    }
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ title: regex }, { excerpt: regex }, { content: regex }];
    }

    let query = BlogPost.find(filter).sort({ publishedAt: -1 });
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    const posts = await query.exec();

    const featuredPosts = posts.filter((post) => post.views > 1000).slice(0, 3);

    res.json({
      posts,
      categories,
      featuredPosts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getBlogPostById = async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      _id: req.params.id,
      isPublished: true,
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createBlogPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newPost = new BlogPost({
      ...req.body,
      tags: req.body.tags || [],
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update blog post by ID
export const updateBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    Object.assign(post, req.body, { updatedAt: new Date() });
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete blog post by ID
export const deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
