require('dotenv').config();
const express = require('express');
const connectDB = require('./dbconfig/db');
const cors = require('cors');

const app = express();
connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/appointments', require('./routes/appointments'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
