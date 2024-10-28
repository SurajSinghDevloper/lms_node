const mongoose = require('mongoose'); // Ensure you have mongoose imported
const bcrypt = require('bcryptjs');
const Admission = require('../models/AddmissionRejistrationModel');
const User = require('../../users/models/UserModel');
const Role = require('../../users/models/RoleModel');
const Results = require('../../../constants/Results');
const UserTypes = require('../../../constants/UserTypes');
const generateUniquePassword = require('../../../utills/generatePasswords');
const sendCompleteRegistrationEmail = require('../../notifications/registrationEmail');

const AdmissionService = {
    async newRegistration(dto) {
        // Start a session
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Check if a user with the same email already exists
            const existingRegistration = await Admission.findOne({ email: dto.email }).session(session);
            if (existingRegistration) {
                await session.abortTransaction(); // Abort if user already exists
                return Results.ALREADY_EXIST;
            }

            // Generate a unique password
            const userPassword = generateUniquePassword();
            console.log(dto);
            // Create a new Admission registration entry
            const newAdmission = new Admission({
                name: dto.name,
                fname: dto.fname,
                mname: dto.mname,
                mobile: dto.mobile,
                aadhar: dto.aadhar,
                email: dto.email,
                dob: dto.dob,
                parmanentAdd: dto.parmanentAdd,
                presentAdd: dto.presentAdd,
                gender: dto.gender,
                cwsn: dto.cwsn,
                nationality: dto.nationality,
                category: dto.category,
                previousSchoolName: dto.previousSchoolName,
                classLastAttendent: dto.classLastAttendent,
                eqOfFather: dto.eqOfFather,
                eqOfMother: dto.eqOfMother,
                poFather: dto.poFather,
                poMother: dto.poMother,
                aiFather: dto.aiFather,
                aiMother: dto.aiMother,
                password: userPassword,
                appliedFor: dto.appliedFor,
                paymentStatus: 'PENDING',
                approvalStatus: 'PENDING',
                prevApplied: 'FALSE',
                status: 'ACTIVE'
            });

            const savedAdmission = await newAdmission.save({ session });

            if (savedAdmission) {
                // Get the student role
                const role = await Role.findOne({ name: 'ROLE_STUDENT' }).session(session);
                if (!role) {
                    await session.abortTransaction(); // Abort if role not found
                    throw new Error('Role not found');
                }
                const [firstName, ...lastNameParts] = savedAdmission.name.split(' ');
                const lastName = lastNameParts.join(' ');

                // Create a new User instance
                const newUser = new User({
                    name: savedAdmission.name,
                    firstName: firstName,
                    lastName: lastName,
                    email: savedAdmission.email,
                    username: savedAdmission.email,
                    userType: UserTypes.UNVERIFIED_STUDENT,
                    password: savedAdmission.password,
                    mobile: savedAdmission.mobile,
                    address: savedAdmission.presentAdd,
                    roles: [role._id] // Assuming roles field is an array of Role ObjectIds
                });

                await newUser.save({ session });

                // Send registration email
                const emailResult = await sendCompleteRegistrationEmail(savedAdmission.email, userPassword);

                // Commit the transaction
                emailResult === Results.SUCCESS ? await session.commitTransaction() : await session.abortTransaction();
                return (emailResult === Results.SUCCESS) ? Results.SUCCESS : Results.FAILED;
            }
            return Results.FAILED;
        } catch (error) {
            console.error('Transaction failed: ', error);
            await session.abortTransaction(); // Rollback transaction
            return Results.FAILED; // Return failure
        } finally {
            session.endSession(); // End the session
        }
    }
};

module.exports = AdmissionService;
