import path from 'path';
import fileHandler from '../../../utills/getFile.js';
import AdmissionDocs from '../models/AddmissionDocsModel.js';
import Status from '../../../constants/Status.js';

const AddmissionDocsServices = {
    async createAdmissionDocs(data, savedFileName) {
        const { studentId, application_no, type } = data;
        try {
            // Find an existing record by studentId
            const existingAdmissionDoc = await AdmissionDocs.findOne({ studentId });

            if (existingAdmissionDoc) {
                // Check if a document of the same type already exists
                const existingDocument = existingAdmissionDoc.documents.find(doc => doc.type === type);

                if (existingDocument) {
                    // Update the existing document
                    existingDocument.file = savedFileName;
                    existingDocument.veryfiedStatus = Status.UNVERIFIED; // Reset verified status
                } else {
                    // Add the new document if the type doesn't exist
                    const newDocument = {
                        type: type,
                        file: savedFileName,
                        veryfiedStatus: Status.UNVERIFIED,
                    };
                    existingAdmissionDoc.documents.push(newDocument);
                }

                // Save the updated document
                await existingAdmissionDoc.save();
                return existingAdmissionDoc;
            } else {
                // If no record exists, create a new one
                const newDocument = {
                    type: type,
                    file: savedFileName,
                    veryfiedStatus: Status.UNVERIFIED,
                };
                const admissionDocs = new AdmissionDocs({
                    studentId: studentId,
                    application_no: application_no,
                    documents: [newDocument],
                });
                await admissionDocs.save();
                return admissionDocs;
            }
        } catch (error) {
            throw new Error(`Error creating admission documents: ${error.message}`);
        }
    }
    ,


    async getAdmissionDocs(studentId) {
        try {
            const admissionDocs = await AdmissionDocs.findOne({ studentId });
            return admissionDocs;
        } catch (error) {
            throw new Error(`Error fetching admission documents: ${error.message}`);
        }
    },

    async addDocument(studentId, document) {
        try {
            const admissionDocs = await AdmissionDocs.findOne({ studentId });

            if (!admissionDocs) {
                throw new Error('Admission record not found.');
            }

            admissionDocs.documents.push(document);
            await admissionDocs.save();
            return admissionDocs;
        } catch (error) {
            throw new Error(`Error adding document: ${error.message}`);
        }
    },

    async updateDocumentStatus(studentId, documentId, status) {
        try {
            const admissionDocs = await AdmissionDocs.findOne({ studentId });

            if (!admissionDocs) {
                throw new Error('Admission record not found.');
            }

            const document = admissionDocs.documents.id(documentId);
            if (!document) {
                throw new Error('Document not found.');
            }

            document.veryfiedStatus = status;
            await admissionDocs.save();
            return admissionDocs;
        } catch (error) {
            throw new Error(`Error updating document status: ${error.message}`);
        }
    },

    async deleteDocument(studentId, documentId) {
        try {
            const admissionDocs = await AdmissionDocs.findOne({ studentId });

            if (!admissionDocs) {
                throw new Error('Admission record not found.');
            }

            const document = admissionDocs.documents.id(documentId);
            if (!document) {
                throw new Error('Document not found.');
            }

            admissionDocs.documents.pull(documentId);
            await admissionDocs.save();

            // Delete the associated file from the file system using fileHandler
            const filePath = path.join(path.resolve(), 'uploads', document.file);
            fileHandler.deleteFile(filePath);

            return admissionDocs;
        } catch (error) {
            throw new Error(`Error deleting document: ${error.message}`);
        }
    }
};

export default AddmissionDocsServices;
