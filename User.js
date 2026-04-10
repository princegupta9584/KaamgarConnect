const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    aadhaar: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    role: { type: String, enum: ['customer', 'worker'], required: true },
    // Location coordinates (Latitude aur Longitude)
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], index: '2dsphere' } // 5km range ke liye ye index zaruri hai
    },
    skills: [String], // Sirf workers ke liye
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
