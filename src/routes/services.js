import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Mock services database
let services = [
  {
    id: '1',
    name: 'Classic Hard Gel Manicure',
    description: 'Professional hard gel application with classic finish. Long-lasting, chip-resistant, and perfect for everyday wear.',
    price: 45,
    duration: 60,
    image: 'https://images.pexels.com/photos/3997390/pexels-photo-3997390.jpeg',
    category: 'Manicure',
    features: ['Nail shaping', 'Cuticle care', 'Hard gel application', 'Classic finish'],
    isPopular: true
  },
  {
    id: '2',
    name: 'French Hard Gel Manicure',
    description: 'Elegant French manicure with hard gel for a timeless, sophisticated look that lasts.',
    price: 55,
    duration: 75,
    image: 'https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg',
    category: 'Manicure',
    features: ['French tip design', 'Hard gel application', 'Perfect white tips', 'Natural pink base'],
    isPopular: true
  },
  {
    id: '3',
    name: 'Hard Gel Nail Extensions',
    description: 'Beautiful nail extensions using premium hard gel for length and strength.',
    price: 75,
    duration: 120,
    image: 'https://images.pexels.com/photos/3997392/pexels-photo-3997392.jpeg',
    category: 'Extensions',
    features: ['Custom length', 'Shape selection', 'Hard gel overlay', 'Natural finish'],
    isPopular: false
  },
  {
    id: '4',
    name: 'Nail Art Design',
    description: 'Creative nail art with intricate designs, patterns, and decorative elements.',
    price: 65,
    duration: 90,
    image: 'https://images.pexels.com/photos/3997393/pexels-photo-3997393.jpeg',
    category: 'Nail Art',
    features: ['Custom designs', 'Hand-painted art', 'Decorative elements', 'Unique patterns'],
    isPopular: true
  },
  {
    id: '5',
    name: 'Hard Gel Pedicure',
    description: 'Luxurious pedicure service with hard gel application for beautiful, long-lasting results.',
    price: 50,
    duration: 90,
    image: 'https://images.pexels.com/photos/3997394/pexels-photo-3997394.jpeg',
    category: 'Pedicure',
    features: ['Foot soak', 'Exfoliation', 'Hard gel application', 'Massage'],
    isPopular: false
  },
  {
    id: '6',
    name: 'Nail Repair Service',
    description: 'Professional nail repair for damaged or broken nails using hard gel techniques.',
    price: 35,
    duration: 45,
    image: 'https://images.pexels.com/photos/3997395/pexels-photo-3997395.jpeg',
    category: 'Repair',
    features: ['Damage assessment', 'Structural repair', 'Hard gel reinforcement', 'Natural finish'],
    isPopular: false
  }
];

const categories = ['Manicure', 'Pedicure', 'Extensions', 'Nail Art', 'Repair'];

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - duration
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           description: Service ID
 *         name:
 *           type: string
 *           description: Service name
 *         description:
 *           type: string
 *           description: Service description
 *         price:
 *           type: number
 *           description: Service price
 *         duration:
 *           type: number
 *           description: Service duration in minutes
 *         image:
 *           type: string
 *           description: Service image URL
 *         category:
 *           type: string
 *           description: Service category
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: Service features
 *         isPopular:
 *           type: boolean
 *           description: Whether service is popular
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 services:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    
    let filteredServices = services;
    if (category && category !== 'all') {
      filteredServices = services.filter(service => service.category === category);
    }

    res.json({
      services: filteredServices,
      categories: categories
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service details
 *       404:
 *         description: Service not found
 */
router.get('/:id', (req, res) => {
  try {
    const service = services.find(s => s.id === req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', [
  body('name').notEmpty().withMessage('Service name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('category').notEmpty().withMessage('Category is required')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newService = {
      id: (services.length + 1).toString(),
      ...req.body,
      features: req.body.features || [],
      isPopular: req.body.isPopular || false
    };

    services.push(newService);
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update service
 *     tags: [Services]
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
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       404:
 *         description: Service not found
 */
router.put('/:id', (req, res) => {
  try {
    const serviceIndex = services.findIndex(s => s.id === req.params.id);
    if (serviceIndex === -1) {
      return res.status(404).json({ message: 'Service not found' });
    }

    services[serviceIndex] = { ...services[serviceIndex], ...req.body };
    res.json(services[serviceIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete service
 *     tags: [Services]
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
 *         description: Service deleted successfully
 *       404:
 *         description: Service not found
 */
router.delete('/:id', (req, res) => {
  try {
    const serviceIndex = services.findIndex(s => s.id === req.params.id);
    if (serviceIndex === -1) {
      return res.status(404).json({ message: 'Service not found' });
    }

    services.splice(serviceIndex, 1);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;