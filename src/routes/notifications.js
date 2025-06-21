import express from 'express';
import { getNotifications, markNotificationAsRead, sendNotification, subscribeToPushNotifications } from '../controllers/notification-controller';

const router = express.Router();

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
router.get('/', getNotifications);

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
router.put('/:id/read', markNotificationAsRead);


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
router.post('/subscribe', subscribeToPushNotifications);

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
router.post('/send', sendNotification);


export default router;