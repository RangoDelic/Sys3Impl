const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const [users] = await db.execute(
            'SELECT id, email, user_role, full_name FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid token.' });
        }

        req.user = users[0];
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.user_role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };