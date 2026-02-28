const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const messageController = require("./message.controller");

// Chat history
/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: Chat conversations
 */

/**
 * @swagger
 * /conversations/one-to-one:
 *   post:
 *     summary: Create or get one-to-one conversation
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userB: 2
 *     responses:
 *       200:
 *         description: Conversation ID
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 */
router.get("/:conversationId", authMiddleware, messageController.list);

// Seen update
router.post("/seen", authMiddleware, messageController.seen);

module.exports = router;