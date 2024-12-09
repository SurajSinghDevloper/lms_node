import mongoose from 'mongoose';
import Status from '../../../constants/Status.js';

const ClassSection = new mongoose.Schema({
    class: { type: String },
    section: { type: String },
    totalSeats: { type: String },
    totalStudent: { type: String },
    classTeacher: { type: String },
    createdBy: { type: String },
    status: { type: String, enum: Status, default: Status.ACTIVE },
    stamp: { type: Date, default: Date.now }
});

const Section = mongoose.model('tbl_class_sec', ClassSection);

export default Section;
