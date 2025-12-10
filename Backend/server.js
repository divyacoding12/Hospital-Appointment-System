
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./dbconfig/db');
connectDB();

const app = express();

app.use(cors());                              // Enable cross-origin requests
app.use(express.json());                      // Parse JSON request body

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const appointmentRoutes = require('./routes/appointments');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
