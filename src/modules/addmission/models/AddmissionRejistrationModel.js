import mongoose from 'mongoose';
import Gender from '../../../constants/Gender.js';
import Status from '../../../constants/Status.js';

const AddmissionRejistration = new mongoose.Schema({
    name: { type: String, trim: true },
    fname: { type: String, trim: true },
    mname: { type: String, trim: true },
    mobile: { type: String, },
    aadhar: { type: String },
    email: { type: String, unique: true, lowercase: true },
    dob: { type: String },
    parmanentAdd: { type: String, },
    religion: { type: String, },
    applicationNo: { type: String, },
    presentAdd: { type: String, },
    gender: { type: String, enum: Gender, },
    cwsn: { type: String },
    nationality: { type: String, },
    category: { type: String },
    previousSchoolName: { type: String },
    classLastAttendent: { type: String },
    marksScored: { type: String },
    eqOfFather: { type: String },
    eqOfMother: { type: String },
    poFather: { type: String },
    poMother: { type: String },
    aiFather: { type: String },
    aiMother: { type: String },
    password: { type: String, },
    appliedFor: { type: String },
    paymentStatus: { type: String, enum: Status, default: Status.PENDING },
    approvalStatus: { type: String, enum: Status, default: Status.PENDING },
    approvedBy: { type: String },
    approvedDate: { type: Date },
    prevApplied: { type: String, enum: Status, default: Status.FALSE },
    status: { type: String, enum: Status, default: Status.ACTIVE },
    stamp: { type: Date, default: Date.now }
});

const Admission = mongoose.model('AdmissionRegistration', AddmissionRejistration);

export default Admission;
