const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const userController = require("./user.controller");

// Profile
router.get("/profile", authMiddleware, userController.profile);

// All users (chat list)
router.get("/", authMiddleware, userController.listUsers);

// Update profile
router.put("/profile", authMiddleware, userController.update);

module.exports = router;