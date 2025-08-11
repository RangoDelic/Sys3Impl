const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, dateOfBirth, userRole = 1 } = req.body;

        // Check if user already exists
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert user
        const [result] = await db.execute(
            'INSERT INTO users (full_name, email, password_hash, date_birth, user_role) VALUES (?, ?, ?, ?, ?)',
            [fullName, email, passwordHash, dateOfBirth, userRole]
        );

        const userId = result.insertId;

        // Create role-specific record
        if (userRole === 1) { // Patient
            await db.execute(
                'INSERT INTO patients (user_id, medical_history) VALUES (?, ?)',
                [userId, '']
            );
        } else if (userRole === 2) { // Genetic Counselor
            await db.execute(
                'INSERT INTO genetic_counselors (user_id, specialization) VALUES (?, ?)',
                [userId, '']
            );
        } else if (userRole === 4) { // Researcher
            await db.execute(
                'INSERT INTO researchers (user_id, institution, research_area) VALUES (?, ?, ?)',
                [userId, '', '']
            );
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: userId, email: email, role: userRole },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: userId,
                fullName,
                email,
                userRole
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get user from database
        const [users] = await db.execute(
            'SELECT id, email, password_hash, user_role, full_name FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = users[0];

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.user_role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                userRole: user.user_role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, full_name, email, user_role, date_birth FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];
        let additionalInfo = {};

        // Get role-specific information
        if (user.user_role === 1) { // Patient
            const [patients] = await db.execute(
                'SELECT medical_history FROM patients WHERE user_id = ?',
                [user.id]
            );
            additionalInfo = patients[0] || {};
        }

        res.json({
            user: {
                ...user,
                ...additionalInfo
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;