const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/Auth');

// GET /api/users?role=doctor
router.get('/', auth, async (req, res) => {
    try {
        const role = req.query.role; // optional filter
        const query = {};
        if (role) query.role = role;
        const users = await User.find(query).select('-password').sort({ name: 1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
