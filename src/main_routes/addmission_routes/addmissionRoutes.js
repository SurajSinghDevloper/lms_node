const express = require('express');
const router = express.Router();
const AdmissionService = require('../../modules/addmission/services/addmissionRejistrationService');
const Results = require('../../constants/Results');


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

module.exports = router;
