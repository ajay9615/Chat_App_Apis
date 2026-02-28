const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");

// Auth routes
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", authController.register);
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user (REAL)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: raman@test.com
 *             password: 123456
 *     responses:
 *       200:
 *         description: Login success
 *         content:
 *           application/json:
 *             example:
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               user:
 *                 id: 1
 *                 name: Raman
 *                 email: raman@test.com
 */
router.post("/login", authController.login);

module.exports = router;