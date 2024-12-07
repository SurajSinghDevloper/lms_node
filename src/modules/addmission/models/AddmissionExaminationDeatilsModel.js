import mongoose from 'mongoose';
import Status from '../../../constants/Status.js';

const AddmissionExaminationDeatils = new mongoose.Schema({
    month: { type: String },
    year: { type: String },
    dateOfExam: { type: String },
    examFor: { type: String },
    cutOff: { type: String },
    approvedBy: { type: String },
    approvedDate: { type: String },
    status: { type: String, enum: Status, default: Status.ACTIVE },
    stamp: { type: Date, default: Date.now }
});

const AdmissionExamDetails = mongoose.model('AddmissionExaminationDeatils', AddmissionExaminationDeatils);

export default AdmissionExamDetails;
