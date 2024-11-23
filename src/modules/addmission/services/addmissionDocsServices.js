import path from 'path';
import fileHandler from '../../../utills/fileHandler.js';
import AdmissionDocs from '../models/AddmissionDocsModel.js';
import Status from '../../../constants/Status.js';

const AddmissionDocsServices = {
    async createAdmissionDocs(data) {
        const { studentId, application_no, type, file } = data;
        console.log(studentId, '\n', application_no, '\n', type, '\n')
        try {
            const filename = fileHandler.saveFile(file, type, application_no + "_" + type)
            const admissionDocs = new AdmissionDocs({
                studentId: studentId,
                application_no: application_no,
                documents: [{
                    type: type,
                    file: filename,
                    veryfiedStatus: Status.UNVERIFIED
                }]
            });
            await admissionDocs.save();
            return admissionDocs;
        } catch (error) {
            throw new Error(`Error creating admission documents: ${error.message}`);
        }
    },

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
