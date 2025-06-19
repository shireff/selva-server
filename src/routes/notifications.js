import express from 'express';

const router = express.Router();

// Mock notifications database
let notifications = [
  {
    id: '1',
    type: 'info',
    title: 'New Service Available',
    message: 'We now offer premium nail art designs with Swarovski crystals!',
    read: false,
    createdAt: '2024-01-20T10:00:00Z',
    actionUrl: '/services'
  },
  {
    id: '2',
    type: 'success',
    title: 'Booking Confirmed',
    message: 'Your appointment for January 25th at 2:00 PM has been confirmed.',
    read: false,
    createdAt: '2024-01-19T14:30:00Z',
    actionUrl: '/booking'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Appointment Reminder',
    message: 'Don\'t forget your appointment tomorrow at 3:00 PM.',
    read: true,
    createdAt: '2024-01-18T09:00:00Z',
    actionUrl: '/booking'
  }
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Notification ID
 *         type:
 *           type: string
 *           enum: [info, success, warning, error]
 *           description: Notification type
 *         title:
 *           type: string
 *           description: Notification title
 *         message:
 *           type: string
 *           description: Notification message
 *         read:
 *           type: boolean
 *           description: Read status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date
 *         actionUrl:
 *           type: string
 *           description: Action URL
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get('/', (req, res) => {
  try {
    const unreadCount = notifications.filter(n => !n.read).length;
    
    res.json({
      notifications: notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      unreadCount: unreadCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
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
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */
router.put('/:id/read', (req, res) => {
  try {
    const notificationIndex = notifications.findIndex(n => n.id === req.params.id);
    if (notificationIndex === -1) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notifications[notificationIndex].read = true;
    
    res.json({
      ...notifications[notificationIndex],
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @swagger
 * /api/notifications/subscribe:
 *   post:
 *     summary: Subscribe to push notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscription:
 *                 type: object
 *                 description: Push subscription object
 *     responses:
 *       200:
 *         description: Subscription successful
 */
router.post('/subscribe', (req, res) => {
  try {
    const { subscription } = req.body;
    
    // In a real app, you would save the subscription to the database
    console.log('Push subscription:', subscription);
    
    res.json({
      message: 'Push notification subscription successful',
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @swagger
 * /api/notifications/send:
 *   post:
 *     summary: Send notification (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [info, success, warning, error]
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               actionUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification sent successfully
 */
router.post('/send', (req, res) => {
  try {
    const { type, title, message, actionUrl } = req.body;
    
    const newNotification = {
      id: (notifications.length + 1).toString(),
      type: type || 'info',
      title,
      message,
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: actionUrl || null
    };
    
    notifications.unshift(newNotification);
    
    res.status(201).json({
      ...newNotification,
      message: 'Notification sent successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;