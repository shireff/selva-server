import express from "express";
import { body, validationResult } from "express-validator";
import { createBlogPost, deleteBlogPost, getAllBlogPosts, getBlogPostById, updateBlogPost } from "../controllers/blog-controller.js";

const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     BlogPost:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - excerpt
 *         - author
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           description: Post ID
 *         title:
 *           type: string
 *           description: Post title
 *         content:
 *           type: string
 *           description: Post content
 *         excerpt:
 *           type: string
 *           description: Post excerpt
 *         featuredImage:
 *           type: string
 *           description: Featured image URL
 *         author:
 *           type: string
 *           description: Post author
 *         category:
 *           type: string
 *           description: Post category
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Post tags
 *         publishedAt:
 *           type: string
 *           format: date-time
 *           description: Publication date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update date
 *         views:
 *           type: number
 *           description: View count
 *         likes:
 *           type: number
 *           description: Like count
 *         isPublished:
 *           type: boolean
 *           description: Publication status
 */

/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Limit number of posts
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search posts
 *     responses:
 *       200:
 *         description: List of blog posts
 */
router.get("/", getAllBlogPosts);

/**
 * @swagger
 * /api/blog/{id}:
 *   get:
 *     summary: Get blog post by ID
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post details
 *       404:
 *         description: Post not found
 */
router.get('/:id', getBlogPostById);


/**
 * @swagger
 * /api/blog:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogPost'
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').notEmpty().withMessage('Excerpt is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('category').notEmpty().withMessage('Category is required')
], createBlogPost);

/**
 * @swagger
 * /api/blog/{id}:
 *   put:
 *     summary: Update blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/BlogPost'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 */
router.put('/:id', updateBlogPost);


/**
 * @swagger
 * /api/blog/{id}:
 *   delete:
 *     summary: Delete blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
router.delete('/:id', deleteBlogPost);

export default router;
