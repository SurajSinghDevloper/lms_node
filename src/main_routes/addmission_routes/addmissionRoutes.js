import express from 'express';
const router = express.Router();
import AdmissionService from '../../modules/addmission/services/addmissionRejistrationService.js';
import Results from '../../constants/Results.js';
import authMiddleware from '../../modules/middlewares/authMiddleware.js';


router.post('/register', async (req, res) => {

    try {
        const result = await AdmissionService.newRegistration(req.body);
        switch (result) {
            case Results.SUCCESS:
                return res.status(201).json({ message: 'Registration successful.' });
            case Results.ALREADY_EXIST:
                return res.status(409).json({ message: 'User with this email already exists.' });
            case Results.FAILED:
                return res.status(500).json({ message: 'Registration failed. Please try again.' });
            default:
                return res.status(400).json({ message: 'Invalid request.' });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});


router.get('/un-verified', authMiddleware, async (req, res) => {
    try {
        const email = req.query.email;
        const result = await AdmissionService.getDataOfUnAuthosrizedStudent(email);

        // Check the status returned from the service
        if (result.status === 204) {
            return res.sendStatus(204); // No Content
        }

        // Handle the success case when a user is found (result.status === 200)
        return res.status(200).json({
            message: 'User data retrieved successfully.',
            data: result.data // Return the found user data
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});


export default router;
