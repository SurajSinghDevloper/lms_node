const express = require('express');
const authRoutes = require('./auth_routes/authRoutes');
const addmission = require('./addmission_routes/addmissionRoutes');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication operations
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: suraj@gmail.com
 *               password:
 *                 type: string
 *                 example: 8988
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.use('/auth', authRoutes);

/**
 * @swagger
 * tags:
 *   name: Admission
 *   description: Admission operations
 */

/**
 * @swagger
 * /addmission/register:
 *   post:
 *     tags: [Admission]
 *     summary: Register a new admission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: suraj kumar
 *               email:
 *                 type: string
 *                 example: suraj31kumar1999@gmail.com
 *               mobile:
 *                 type: string
 *                 example: 8271932791
 *               address:
 *                 type: string
 *                 example: kanke road ranchi
 *               selectedClass:
 *                 type: string
 *                 example: V
 *     responses:
 *       201:
 *         description: Admission registered successfully
 *       400:
 *         description: Bad request
 */
router.use('/addmission', addmission);

module.exports = router;
