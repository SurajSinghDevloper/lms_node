const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const Role = require('../models/RoleModel');
require('dotenv').config();

// JWT Token Provider
const jwtTokenProvider = {
    generateToken: (user) => {
        const payload = {
            user: user
        };
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    }
};


const login = async (requestData) => {
    const user = await User.findOne({ email: requestData.email });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(requestData.password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const token = jwtTokenProvider.generateToken(user);
    const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.lastName,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob,
        address: user.address,
        userType: [user.userType],
        roles: await Promise.all(user.roles.map(async (roleId) => await Role.findById(roleId)))

    }
    return {
        user: userData,
        accessToken: token
    };
}

// Save User (Register)
const saveUser = async (userRequestDto) => {
    const { firstName, lastName, email, password, mobile, dob, address } = userRequestDto.formData;

    if (!firstName || !lastName || !email || !password || !mobile || !dob) {
        throw new Error('Missing details');
    }

    const foundUser = await User.findOne({ email });
    if (foundUser) {
        throw new Error('User already exists');
    }

    const role = await Role.findOne({ name: 'ROLE_USER' });
    if (!role) {
        throw new Error('Role not found');
    }

    const newUser = new User({
        firstName,
        lastName,
        email,
        name: `${firstName} ${lastName}`,
        password,
        mobile,
        dob,
        address,
        username: email,
        roles: [role._id]
    });

    // Save user
    await newUser.save();

    return 'User saved successfully';
}






module.exports = {
    login,
    saveUser
};
