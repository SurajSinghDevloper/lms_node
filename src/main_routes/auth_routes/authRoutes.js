import express from 'express';
import { logger } from '../../config/logger.js'; // Add .js extension
import { login, saveUser } from '../../modules/users/services/authService.js'; // Add .js extension
const router = express.Router();


router.post('/login', async (req, res) => {
    try {
        const loginData = req.body;
        console.log(loginData)
        const loginResponse = await login(loginData);
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
        const message = await saveUser(userRequestDto);
        res.status(201).json({ message });
    } catch (error) {
        console.log(error)
        logger.error(error)
        res.status(400).json({ message: error.message });
    }
});

export default router;
