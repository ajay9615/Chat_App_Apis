const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const controller = require("./conversation.controller");

// One-to-One chat
router.post("/one-to-one", authMiddleware, controller.oneToOne);

// Group chat
router.post("/group", authMiddleware, controller.createGroup);

// My conversations list
router.get("/", authMiddleware, controller.myConversations);

module.exports = router;