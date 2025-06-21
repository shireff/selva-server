import mongoose from "mongoose";

// Define the schema for the BlogPost model
const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    featuredImage: { type: String, required: true },
    author: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Nail Care", "Trends", "Tips & Tricks", "DIY", "Product Reviews"],
    },
    tags: { type: [String], default: [] },
    publishedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Create the model from the schema
const BlogPost = mongoose.model("BlogPost", blogPostSchema);

export default BlogPost;
