const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
    try {
        let token;

        // Token From header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Unauthorized token' 
            });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const [users] = await db.query(
            'SELECT id, name, email, role FROM users WHERE id = ?',
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: 'User not Exist' 
            });
        }

        req.user = users[0];
        next();

    } catch (error) {
        return res.status(401).json({ 
            success: false,
            message: 'Token invalid ya expired', 
        });
    }
};

// Role check middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                message: `your role (${req.user.role}) not authorized to access this route` 
            });
        }
        next();
    };
};

module.exports = { protect, authorize };