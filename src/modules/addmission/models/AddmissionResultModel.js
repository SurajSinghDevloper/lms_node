import mongoose from 'mongoose';
import Status from '../../../constants/Status.js';

const AddmissionExaminationResult = new mongoose.Schema({
    month: { type: String },
    year: { type: String },
    dateOfExam: { type: String },
    examFor: { type: String },
    cutOff: { type: String },
    applicationNo: { type: String },
    scoredMarks: { type: String },
    approvedBy: { type: String },
    approvedDate: { type: String },
    addmissionExamDetails: { type: String },
    status: { type: String, enum: Status, default: Status.ACTIVE },
    stamp: { type: Date, default: Date.now }
});

const AdmissionExamResult = mongoose.model('AddmissionExaminationResult', AddmissionExaminationResult);

export default AdmissionExamResult;
