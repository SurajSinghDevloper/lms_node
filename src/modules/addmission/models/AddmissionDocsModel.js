import mongoose from "mongoose";
import Status from '../../../constants/Status.js';

const AddmissionDocsModel = new mongoose.Schema({
    studentId: { type: String, required: true },
    application_no: { type: String, trim: true },
    documents: [{
        // Document type (e.g., photo, marksheet)
        type: { type: String, required: true },
        // File reference (e.g., filename or path) 
        file: { type: String, required: true },
        veryfiedStatus: { type: String, enum: Status, default: Status.UNVERIFIED },
        // Timestamp
        uploadedAt: { type: Date, default: Date.now },
    }],
});

const AdmissionDocs = mongoose.model("AdmissionDocs", AddmissionDocsModel);
export default AdmissionDocs;
