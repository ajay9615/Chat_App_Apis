const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const messageController = require("./message.controller");

// Chat history
router.get("/:conversationId", authMiddleware, messageController.list);

// Seen update
router.post("/seen", authMiddleware, messageController.seen);

module.exports = router;