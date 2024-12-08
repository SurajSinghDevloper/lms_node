import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import Role from '../models/RoleModel.js';
import dotenv from 'dotenv';
dotenv.config();

// JWT Token Provider
const jwtTokenProvider = {
    generateToken: (user) => {
        const payload = {
            user: user
        };
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    }
};


export const login = async (requestData) => {
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
        userId: user._id,
        userType: [user.userType],
        roles: await Promise.all(user.roles.map(async (roleId) => await Role.findById(roleId)))

    }
    return {
        user: userData,
        accessToken: token
    };
}

// Save User (Register)
export const saveUser = async (userRequestDto) => {
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

