const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const controller = require("./conversation.controller");

// One-to-One chat
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
 *     summary: Create one-to-one conversation
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userB]
 *             properties:
 *               userB:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Conversation created
 */
router.post("/one-to-one", authMiddleware, controller.oneToOne);

// Group chat
router.post("/group", authMiddleware, controller.createGroup);

// My conversations list
router.get("/", authMiddleware, controller.myConversations);

module.exports = router;