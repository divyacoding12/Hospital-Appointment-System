const express = require('express');
const router = express.Router();
const auth = require('../middleware/Auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// POST /api/appointments/book
router.post('/book', auth, async (req, res) => {
    try {
        const patientId = req.user.id;
        const { doctorId, date, reason } = req.body;

        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor')
            return res.status(400).json({ msg: 'Invalid doctor' });

        const appt = new Appointment({
            patient: patientId,
            doctor: doctorId,
            date: new Date(date),
            reason
        });

        await appt.save();
        res.json(appt);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// POST /api/appointments/cancel
router.post('/cancel', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { appointmentId } = req.body;

        const appt = await Appointment.findById(appointmentId);
        if (!appt) return res.status(404).json({ msg: 'Appointment not found' });

        if (appt.patient.toString() !== userId && appt.doctor.toString() !== userId) {
            return res.status(403).json({ msg: 'Not allowed to cancel this appointment' });
        }

        appt.status = 'cancelled';
        await appt.save();
        res.json({ msg: 'Appointment cancelled', appointment: appt });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET /api/appointments
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        let query = {};

        if (user.role === 'patient') {
            // Patient sees only their own appointments
            query = { patient: userId };
        }
        // If doctor → see all appointments (query = {})

        const appts = await Appointment.find(query)
            .populate('patient', '-password')
            .populate('doctor', '-password')
            .sort({ date: 1 });

        res.json(appts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
