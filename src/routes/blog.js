import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Mock blog posts database
let blogPosts = [
  {
    id: '1',
    title: 'The Ultimate Guide to Hard Gel Nail Care',
    content: 'Hard gel nails have revolutionized the nail industry...',
    excerpt: 'Learn everything you need to know about caring for your hard gel nails to make them last longer and look beautiful.',
    featuredImage: 'https://images.pexels.com/photos/3997403/pexels-photo-3997403.jpeg',
    author: 'Sarah Ahmed',
    category: 'Nail Care',
    tags: ['hard-gel', 'nail-care', 'maintenance'],
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    views: 1250,
    likes: 89,
    isPublished: true
  },
  {
    id: '2',
    title: 'Top 10 Nail Art Trends for 2024',
    content: 'This year brings exciting new trends in nail art...',
    excerpt: 'Discover the hottest nail art trends that are taking 2024 by storm, from minimalist designs to bold statement nails.',
    featuredImage: 'https://images.pexels.com/photos/3997404/pexels-photo-3997404.jpeg',
    author: 'Maya Hassan',
    category: 'Trends',
    tags: ['nail-art', 'trends', '2024'],
    publishedAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    views: 980,
    likes: 67,
    isPublished: true
  },
  {
    id: '3',
    title: 'How to Choose the Perfect Nail Shape',
    content: 'Your nail shape can dramatically affect the overall look...',
    excerpt: 'Find out which nail shape complements your hands best and learn how to achieve the perfect shape every time.',
    featuredImage: 'https://images.pexels.com/photos/3997405/pexels-photo-3997405.jpeg',
    author: 'Layla Mohamed',
    category: 'Tips & Tricks',
    tags: ['nail-shape', 'tips', 'beauty'],
    publishedAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
    views: 756,
    likes: 45,
    isPublished: true
  },
  {
    id: '4',
    title: 'DIY Nail Care: Professional Results at Home',
    content: 'You don\'t always need to visit a salon...',
    excerpt: 'Learn professional nail care techniques you can do at home to maintain healthy, beautiful nails between salon visits.',
    featuredImage: 'https://images.pexels.com/photos/3997406/pexels-photo-3997406.jpeg',
    author: 'Nour Ali',
    category: 'DIY',
    tags: ['diy', 'home-care', 'nail-health'],
    publishedAt: '2024-01-01T16:45:00Z',
    updatedAt: '2024-01-01T16:45:00Z',
    views: 1100,
    likes: 78,
    isPublished: true
  }
];

const categories = ['Nail Care', 'Trends', 'Tips & Tricks', 'DIY', 'Product Reviews'];

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
router.get('/', (req, res) => {
  try {
    const { category, limit, search } = req.query;
    
    let filteredPosts = blogPosts.filter(post => post.isPublished);
    
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
      );
    }
    
    if (limit) {
      filteredPosts = filteredPosts.slice(0, parseInt(limit));
    }
    
    // Sort by publication date (newest first)
    filteredPosts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    const featuredPosts = filteredPosts.filter(post => post.views > 1000).slice(0, 3);

    res.json({
      posts: filteredPosts,
      categories: categories,
      featuredPosts: featuredPosts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

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
router.get('/:id', (req, res) => {
  try {
    const post = blogPosts.find(p => p.id === req.params.id && p.isPublished);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Increment view count
    post.views += 1;
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

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
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newPost = {
      id: (blogPosts.length + 1).toString(),
      ...req.body,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      isPublished: req.body.isPublished || false,
      tags: req.body.tags || []
    };

    blogPosts.push(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

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
router.put('/:id', (req, res) => {
  try {
    const postIndex = blogPosts.findIndex(p => p.id === req.params.id);
    if (postIndex === -1) {
      return res.status(404).json({ message: 'Post not found' });
    }

    blogPosts[postIndex] = {
      ...blogPosts[postIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    res.json(blogPosts[postIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

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
router.delete('/:id', (req, res) => {
  try {
    const postIndex = blogPosts.findIndex(p => p.id === req.params.id);
    if (postIndex === -1) {
      return res.status(404).json({ message: 'Post not found' });
    }

    blogPosts.splice(postIndex, 1);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;