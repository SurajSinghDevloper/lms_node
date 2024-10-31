const express = require('express');
const { logger } = require('../../config/logger');
const AuthService = require('../../modules/users/services/AuthService');
const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
    try {
        const loginData = req.body;
        console.log(loginData)
        const loginResponse = await AuthService.login(loginData);
        res.status(200).json(loginResponse);
    } catch (error) {
        logger.error(error)
        res.status(401).json({
            message: 'Authentication failed. ' + error.message
        });
    }
});


// Register (Save User) route
router.post('/register', async (req, res) => {
    try {
        const userRequestDto = req.body;
        const message = await AuthService.saveUser(userRequestDto);
        res.status(201).json({ message });
    } catch (error) {
        console.log(error)
        logger.error(error)
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
