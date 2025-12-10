const User = require('../models/User');

// ----------------------------------------------
// Get Users (Optional filter by role)
// Example: /api/users?role=doctor
// ----------------------------------------------
exports.getUsers = async (req, res) => {
    try {
        const role = req.query.role; // doctor OR patient OR empty

        const query = {};
        if (role) query.role = role;

        const users = await User.find(query)
            .select('-password')   // hide password
            .sort({ name: 1 });    // ascending order

        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
