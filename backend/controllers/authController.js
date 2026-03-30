const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// ============================================
// TOKEN Genration Function
// ============================================
const generateToken = (id, role, name) => {
    return jwt.sign({ id, role, name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// ============================================
// REGISTER
// POST /api/auth/register
// ============================================
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ 
                success: false,
                message: 'All Fields Required - name, email, password, role' 
            });
        }

        // Role check
        if (!['job_seeker', 'job_provider'].includes(role)) {
            return res.status(400).json({ 
                success: false,
                message: 'Role  job_seeker or job_provider only' 
            });
        }

        // Check Email already exists
        const [existingUser] = await db.query(
            'SELECT id FROM users WHERE email = ?', 
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists with this email' 
            });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        const userId = result.insertId;

        // profile like role
        if (role === 'job_seeker') {
            await db.query(
                'INSERT INTO job_seeker_profiles (user_id) VALUES (?)',
                [userId]
            );
        } else if (role === 'job_provider') {
            await db.query(
                'INSERT INTO job_provider_profiles (user_id, company_name) VALUES (?, ?)',
                [userId, 'My Company']
            );
        }

        res.status(201).json({
            success: true,
            message: 'Registration Successful!',
        });

    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
};

// ============================================
// LOGIN -
// POST /api/auth/login
// ============================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email aur password are required' 
            });
        }

        // User exist in Db
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: 'Wrong Cridentials' 
            });
        }

        const user = users[0];

        // check active status
        if (!user.is_active) {
            return res.status(401).json({ 
                success: false,
                message: 'your account is deactivated, contact support' 
            });
        }

        // Password match 
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Wrong Cridentials' 
            });
        }

        // Token genrtae
        const token = generateToken(user.id, user.role, user.name);

        res.status(200).json({
            success: true,
            message: 'Login Successful!',
            token,
        });

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
};

// ============================================
// GET
// GET /api/auth/me
// ============================================
const getMe = async (req, res) => {
    try {
        // req.user authMiddleware
        const [users] = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        const user = users[0];

        // profile view like role
        let profile = null;

        if (user.role === 'job_seeker') {
            const [profiles] = await db.query(
                'SELECT * FROM job_seeker_profiles WHERE user_id = ?',
                [user.id]
            );
            profile = profiles[0] || null;

        } else if (user.role === 'job_provider') {
            const [profiles] = await db.query(
                'SELECT * FROM job_provider_profiles WHERE user_id = ?',
                [user.id]
            );
            profile = profiles[0] || null;
        }

        res.status(200).json({
            success: true,
            user,
            profile
        });

    } catch (error) {
        console.error('GetMe error:', error.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
};

// ============================================
// CHANGE PASSWORD
// PUT /api/auth/change-password
// ============================================
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ 
                success: false,
                message: 'required oldPassword and newPassword' 
            });
        }

        // User 
        const [users] = await db.query(
            'SELECT * FROM users WHERE id = ?',
            [req.user.id]
        );

        const user = users[0];

        // check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: 'old password is incorrect' 
            });
        }

        // New password hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update
        await db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, req.user.id]
        );

        res.status(200).json({
            success: true,
            message: 'Password changed successfully!'
        });

    } catch (error) {
        console.error('ChangePassword error:', error.message);
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
};

module.exports = { register, login, getMe, changePassword };