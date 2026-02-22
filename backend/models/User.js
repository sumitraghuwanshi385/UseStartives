// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: { type: String, required: false, default: 'New User' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Extra fields jo tumhare app me use ho rhi hain
    headline: { type: String },
    country: { type: String },
    profilePictureUrl: { type: String },
    savedProjectIds: [{ type: String }],

    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    connectionRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
}, {
    timestamps: true, // CreatedAt aur UpdatedAt apne aap aa jayega
});

// Password Encrypt karna (Save karne se pehle)
userSchema.pre('save', async function ( ) {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Password match karne ka function (Login ke time)
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;