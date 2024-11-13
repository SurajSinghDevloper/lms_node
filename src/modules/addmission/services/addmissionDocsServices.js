import fileHandler from '../../../utills/fileHandler.js'
import AdmissionDocs from '../models/AddmissionDocsModel.js';
/**
 * Create admission documents for a student
 * @param {Object} data - The data to create admission documents
 * @returns {Promise<Object>} - The created AdmissionDocs object
 */
const createAdmissionDocs = async (data) => {
    try {
        const admissionDocs = new AdmissionDocs(data);
        await admissionDocs.save();
        return admissionDocs;
    } catch (error) {
        throw new Error(`Error creating admission documents: ${error.message}`);
    }
};

/**
 * Get admission documents for a student
 * @param {String} studentId - The student ID
 * @returns {Promise<Object|null>} - The found AdmissionDocs object or null
 */
const getAdmissionDocs = async (studentId) => {
    try {
        const admissionDocs = await AdmissionDocs.findOne({ studentId });
        return admissionDocs;
    } catch (error) {
        throw new Error(`Error fetching admission documents: ${error.message}`);
    }
};

/**
 * Add a document to an existing admission record
 * @param {String} studentId - The student ID
 * @param {Object} document - The document to add (contains type, file, etc.)
 * @returns {Promise<Object>} - The updated AdmissionDocs object
 */
const addDocument = async (studentId, document) => {
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
};

/**
 * Update the verification status of a document
 * @param {String} studentId - The student ID
 * @param {String} documentId - The document ID
 * @param {String} status - The status to update (e.g., 'verified', 'unverified')
 * @returns {Promise<Object>} - The updated AdmissionDocs object
 */
const updateDocumentStatus = async (studentId, documentId, status) => {
    try {
        const admissionDocs = await AdmissionDocs.findOne({ studentId });

        if (!admissionDocs) {
            throw new Error('Admission record not found.');
        }

        const document = admissionDocs.documents.id(documentId);
        if (!document) {
            throw new Error('Document not found.');
        }

        // Update the verification status
        document.veryfiedStatus = status;
        await admissionDocs.save();

        return admissionDocs;
    } catch (error) {
        throw new Error(`Error updating document status: ${error.message}`);
    }
};

/**
 * Delete a document from an admission record
 * @param {String} studentId - The student ID
 * @param {String} documentId - The document ID
 * @returns {Promise<Object>} - The updated AdmissionDocs object
 */
const deleteDocument = async (studentId, documentId) => {
    try {
        const admissionDocs = await AdmissionDocs.findOne({ studentId });

        if (!admissionDocs) {
            throw new Error('Admission record not found.');
        }

        const document = admissionDocs.documents.id(documentId);
        if (!document) {
            throw new Error('Document not found.');
        }

        // Remove the document
        admissionDocs.documents.pull(documentId);
        await admissionDocs.save();

        // Optionally, delete the file from the file system using fileHandler
        const filePath = path.join(__dirname, 'uploads', document.file);
        fileHandler.deleteFile(filePath);

        return admissionDocs;
    } catch (error) {
        throw new Error(`Error deleting document: ${error.message}`);
    }
};

export default {
    createAdmissionDocs,
    getAdmissionDocs,
    addDocument,
    updateDocumentStatus,
    deleteDocument
};
