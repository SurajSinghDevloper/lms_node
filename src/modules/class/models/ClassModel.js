import mongoose from 'mongoose';
import Status from '../../../constants/Status.js';

const ClassModel = new mongoose.Schema({
    class: { type: String },
    totalSec: { type: String },
    totalSeats: { type: String },
    totalStudent: { type: String },
    createdBy: { type: String },
    status: { type: String, enum: Status, default: Status.ACTIVE },
    stamp: { type: Date, default: Date.now }
});

const Class = mongoose.model('tbl_class', ClassModel);

export default Class;
