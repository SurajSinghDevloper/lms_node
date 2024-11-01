import Admission from '../models/AddmissionRejistrationModel.js';
import User from '../../users/models/UserModel.js';
import Role from '../../users/models/RoleModel.js';
import Results from '../../../constants/Results.js';
import UserTypes from '../../../constants/UserTypes.js';
import generateUniquePassword from '../../../utills/generatePasswords.js';
import sendCompleteRegistrationEmail from '../../notifications/registrationEmail.js';

const AdmissionService = {
    async newRegistration(dto) {
        try {
            // Check if a user with the same email already exists
            const existingRegistration = await Admission.findOne({ email: dto.email });
            if (existingRegistration) {
                return Results.ALREADY_EXIST;
            }

            // Generate a unique password
            const userPassword = generateUniquePassword();

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

            const savedAdmission = await newAdmission.save();
            if (!savedAdmission) return Results.FAILED;

            // Get the student role
            const role = await Role.findOne({ name: 'ROLE_STUDENT' });
            if (!role) throw new Error('Role not found');

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

            const savedUser = await newUser.save();
            if (!savedUser) return Results.FAILED;

            // Send registration email
            const emailResult = await sendCompleteRegistrationEmail(savedAdmission.email, userPassword);
            return (emailResult === Results.SUCCESS) ? Results.SUCCESS : Results.FAILED;

        } catch (error) {
            console.error('Registration failed: ', error);
            return Results.FAILED; // Return failure
        }
    },

    async getDataOfUnAuthosrizedStudent(email) {
        try {
            // Find the user by email
            const foundUser = await Admission.findOne({ email: email });

            // If no user is found, return a custom response
            if (!foundUser) {
                return {
                    status: 204, // No Content
                    message: Results.NO_CONTENT_FOUND
                };
            }

            // Return the found user data
            return {
                status: 200, // OK
                data: foundUser
            };
        } catch (error) {
            console.error("Error fetching unauthorized student data:", error);
            return {
                status: 500, // Internal Server Error
                message: "An error occurred while fetching the data."
            };
        }
    }

};

export default AdmissionService;
