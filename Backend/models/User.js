const mongoose = require('mongoose');
const validator = require('validator'); // npm install validator

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Full name is required']
    },
    username: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: (v) => validator.isEmail(v),
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['doctor', 'patient'],
        required: [true, 'Role is required']
    },
    specialty: {
        type: String,
        required: function () { return this.role === 'doctor'; } // required if role is doctor
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return !v || /^\d{10}$/.test(v); // optional, but if provided must be 10 digits
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`
        }
    },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
