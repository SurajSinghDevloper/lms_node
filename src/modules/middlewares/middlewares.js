

import AdmissionExam from '../addmission/models/AddmissionExaminationModel.js';
import Admission from '../addmission/models/AddmissionRejistrationModel.js';
import User from '../users/models/UserModel.js';

const Middlewares = {
    async isUserAuthenticated(userId) {
        try {
            const user = await User.findById(userId);
            if (user && user.userType) {
                const allowedRoles = ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_PRINCIPAL', 'ROLE_VICE-PRINCIPAL'];
                return allowedRoles.includes(user.userType);
            }
            return false;
        } catch (error) {
            console.error('Error checking user authentication:', error);
            return false;
        }
    },
    async isStdDetailsPresent(email, examDetialsId) {
        const stdDetails = await Admission.findOne({ email: email });
        const examDetails = await AdmissionExam.findById(examDetialsId);
        if (stdDetails && examDetails) {
            return true
        }
        return false;
    },
    async isStdExamDetailsPresent(applicationNo, examDetialsId) {
        const stdDetails = await AdmissionExam.findOne({ applicationNo: applicationNo, examDetialsId: examDetialsId });
        if (stdDetails) {
            return true
        }
        return false;
    }
}

export default Middlewares;