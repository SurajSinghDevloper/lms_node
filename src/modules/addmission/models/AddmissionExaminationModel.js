import mongoose from 'mongoose';
import Gender from '../../../constants/Gender.js';
import Status from '../../../constants/Status.js';

const AdmissionExamination = new mongoose.Schema({
    name: { type: String, trim: true },
    mobile: { type: String },
    email: { type: String, unique: true, lowercase: true },
    dateOfExam: { type: String },
    applicationNo: { type: String },
    gender: { type: String, enum: Gender, },
    marksScored: { type: String },
    appliedFor: { type: String },
    approvalStatus: { type: String, enum: Status, default: Status.PENDING },
    approvedBy: { type: String },
    approvedDate: { type: String },
    month: { type: String },
    year: { type: String },
    createdBy: { type: String },
    admitCardStatus: { type: String, enum: Status, default: Status.PENDING },
    addmissionExamDetails: { type: String },
    status: { type: String, enum: Status, default: Status.ACTIVE },
    stamp: { type: Date, default: Date.now }
});

const AdmissionExam = mongoose.model('AdmissionExamination', AdmissionExamination);

export default AdmissionExam;
