const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    name: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    dob: { type: Date },
    password: { type: String, required: true },
    address: { type: String },
    userType: {
        type: String,
        enum: ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_PRINCIPAL', 'ROLE_VICE-PRINCIPAL', 'ROLE_STUDENT', 'UNVERIFIED_STUDENT', 'UNVERIFIED_STUDENT']
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }], // Reference to Role
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
