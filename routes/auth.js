const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');  // Import uuid to generate unique tenantId

const { User,School } = require('../models/schema');
const router = express.Router();

const SECRET_KEY = 'your_secret_key'; // Replace with your actual secret key
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                tenantId: user.tenantId,
                role: user.role,
            },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.json({ token, message: 'Login successful.', tenantId:user.tenantId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { tenantId, name, email, password, role } = req.body;

        // Validate role (Only admin allowed for registration)
        if (role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can register.' });
        }

        // Check if school exists
        const school = await School.findOne({ tenantId });
        if (!school) {
            return res.status(400).json({ message: 'Invalid tenant ID.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            tenantId,
            name,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        res.status(201).json({ message: 'Admin registered successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
