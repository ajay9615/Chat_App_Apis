const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const userController = require("./user.controller");

// Profile
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User APIs
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/profile", authMiddleware, userController.profile);

// All users (chat list)
router.get("/", authMiddleware, userController.listUsers);

// Update profile
router.put("/profile", authMiddleware, userController.update);

router.post(
    "/device-token",
    authMiddleware,
    userController.saveDeviceToken
);
module.exports = router;