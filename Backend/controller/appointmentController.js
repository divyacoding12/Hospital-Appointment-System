const Appointment = require('../models/Appointment');
const User = require('../models/User');

// ---------------------------
// Book Appointment
// ---------------------------
exports.bookAppointment = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { doctorId, date, reason } = req.body;

        // Check valid doctor
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(400).json({ msg: 'Invalid doctor' });
        }

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
};

// ---------------------------
// Cancel Appointment
// ---------------------------
exports.cancelAppointment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { appointmentId } = req.body;

        const appt = await Appointment.findById(appointmentId);
        if (!appt) return res.status(404).json({ msg: 'Appointment not found' });

        // Only patient or doctor of that appointment can cancel
        if (
            appt.patient.toString() !== userId &&
            appt.doctor.toString() !== userId
        ) {
            return res.status(403).json({ msg: 'Not allowed to cancel this appointment' });
        }

        appt.status = 'cancelled';
        await appt.save();

        res.json({ msg: 'Appointment cancelled', appointment: appt });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// ---------------------------
// Get Appointments
// ---------------------------
exports.getAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        let query = {};

        // If patient → show only own appointments  
        if (user.role === 'patient') {
            query = { patient: userId };
        }
        // If doctor → show all appointments

        const appts = await Appointment.find(query)
            .populate('patient', '-password')
            .populate('doctor', '-password')
            .sort({ date: 1 });

        res.json(appts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
