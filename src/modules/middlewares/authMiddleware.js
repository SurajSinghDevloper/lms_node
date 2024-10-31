// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//     const token = req.header('Authorization')?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Invalid token' });
//     }
// };

// module.exports = authMiddleware;


const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Remove 'Bearer' prefix if present
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trim();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
