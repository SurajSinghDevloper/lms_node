import express from 'express';
import authRoutes from './auth_routes/authRoutes.js';
import addmission from './addmission_routes/addmissionRoutes.js';
import addmissionDocsServices from '../modules/addmission/services/addmissionDocsServices.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication operations
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: suraj
 *               lastName:
 *                 type: string
 *                 example: kumar
 *               email:
 *                 type: string
 *                 example: suraj@gmail.com
 *               mobile:
 *                 type: string
 *                 example: 8271932791 
 *               password:
 *                 type: string
 *                 example: 8988
 *               dob:
 *                 type: string
 *                 example: "1999-12-10"
 *               address:
 *                 type: string
 *                 example: kanke road ranchi
 *               username:
 *                 type: string
 *                 example: suraj
 *    
 *     responses:
 *       201:
 *         description: User register successfully
 *       409:
 *         description: User already register 
 *       500:
 *         description: Registration failed. Please try again
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


/**
 * @swagger
 * /addmission/un-verified:
 *   get:
 *     tags: [Admission]
 *     summary: Retrieve data of unverified admission by email
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer your_jwt_token"
 *         description: Bearer token for authorization
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           example: suraj31kumar1999@gmail.com
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User data retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "suraj31kumar1999@gmail.com"
 *       204:
 *         description: No content found for the given email
 *       409:
 *         description: User with this email already exists
 *       500:
 *         description: An unexpected error occurred
 */


/**
 * @swagger
 * /addmission/complete-form:
 *   post:
 *     tags: [Admission]
 *     summary: Update admission registration details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer your_jwt_token"
 *         description: Bearer token for authorization
 *       - in: body
 *         name: AdmissionData
 *         description: Admission details for update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             aadhar:
 *               type: string
 *               example: "111122223333"
 *             aiFather:
 *               type: string
 *               example: "400000"
 *             aiMother:
 *               type: string
 *               example: "300000"
 *             appliedFor:
 *               type: string
 *               example: "VII"
 *             approvalStatus:
 *               type: string
 *               example: "PENDING"
 *             category:
 *               type: string
 *               example: "GENRAL"
 *             classLastAttendent:
 *               type: string
 *               example: "6"
 *             cwsn:
 *               type: string
 *               example: ""
 *             dob:
 *               type: string
 *               format: date
 *               example: "2024-11-01"
 *             email:
 *               type: string
 *               example: "suraj31kumar1999@gmail.com"
 *             eqOfFather:
 *               type: string
 *               example: "High School"
 *             eqOfMother:
 *               type: string
 *               example: "High School"
 *             fname:
 *               type: string
 *               example: "Devpujan Kumar Singh"
 *             gender:
 *               type: string
 *               example: "Male"
 *             marksScored:
 *               type: string
 *               example: "70"
 *             mname:
 *               type: string
 *               example: "Pushpa Devi"
 *             mobile:
 *               type: string
 *               example: "827193791"
 *             name:
 *               type: string
 *               example: "Suraj Kumar"
 *             nationality:
 *               type: string
 *               example: "Indian"
 *             parmanentAdd:
 *               type: string
 *               example: "kanke road ranchi jharkhand"
 *             password:
 *               type: string
 *               example: "8988"
 *             paymentStatus:
 *               type: string
 *               example: "PENDING"
 *             poFather:
 *               type: string
 *               example: "Business Man"
 *             poMother:
 *               type: string
 *               example: "Business Man"
 *             presentAdd:
 *               type: string
 *               example: "jharkahnd"
 *             prevApplied:
 *               type: string
 *               example: "FALSE"
 *             previousSchoolName:
 *               type: string
 *               example: "Dav Nandraj public school"
 *             religion:
 *               type: string
 *               example: "HINDU"
 *     responses:
 *       200:
 *         description: Details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "DETAILS UPDATED SUCCESSFULLY"
 *       204:
 *         description: No user found by details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "NO USER FOUND BY DETAILS"
 *       500:
 *         description: Unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred. Please try again later."
 */


router.use('/addmission-docs', addmissionDocsServices);

export default router;
