const express = require('express');
const router = express.Router();
const auth = require('../middleware/Auth');

// Import controller
const {
    bookAppointment,
    cancelAppointment,
    getAppointments
} = require('../controller/appointmentController');

// Routes
router.post('/book', auth, bookAppointment);
router.post('/cancel', auth, cancelAppointment);
router.get('/', auth, getAppointments);

module.exports = router;
