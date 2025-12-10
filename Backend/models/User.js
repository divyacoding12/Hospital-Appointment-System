const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true }, // login username/email
    password: { type: String, required: true },
    role: { type: String, enum: ['doctor', 'patient'], required: true },
    specialty: { type: String }, // for doctors (optional)
    phone: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
