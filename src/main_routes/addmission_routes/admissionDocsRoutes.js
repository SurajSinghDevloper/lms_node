import express from 'express';
import admissionDocsService from './services/admissionDocsService'; // Path to your admissionDocsService
import fileHandler from './services/fileHandler'; // Path to your file handler
import Status from '../../../constants/Status'; // Path to your Status constants
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Set up multer for file handling (you can modify this as needed)
const storage = multer.memoryStorage(); // Use memory storage to get files in buffer format
const upload = multer({ storage: storage });

// 1. Create Admission Documents
router.post('/create', async (req, res) => {
    try {
        const { studentId, application_no, documents } = req.body;
        const admissionDocsData = { studentId, application_no, documents };
        const newDocs = await admissionDocsService.createAdmissionDocs(admissionDocsData);
        res.status(201).json(newDocs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 2. Get Admission Documents for a Student
router.get('/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const admissionDocs = await admissionDocsService.getAdmissionDocs(studentId);
        if (!admissionDocs) {
            return res.status(404).json({ message: 'Admission documents not found' });
        }
        res.status(200).json(admissionDocs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 3. Add Document for a Student
router.post('/:studentId/add-document', upload.single('file'), async (req, res) => {
    try {
        const { studentId } = req.params;
        const { type } = req.body; // Document type
        const file = req.file; // The uploaded file
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileName = `doc_${Date.now()}`; // You can customize the file name
        const fileType = file.mimetype;

        // Save the file using the fileHandler
        const filePath = fileHandler.saveFile(file.buffer, fileType, fileName);

        const document = {
            type,
            file: filePath,
            veryfiedStatus: Status.UNVERIFIED,
        };

        const updatedDocs = await admissionDocsService.addDocument(studentId, document);
        res.status(200).json(updatedDocs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 4. Update Document Verification Status
router.put('/:studentId/update-document-status/:documentId', async (req, res) => {
    try {
        const { studentId, documentId } = req.params;
        const { status } = req.body; // Status (e.g., 'verified', 'unverified')

        if (!Object.values(Status).includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedDocs = await admissionDocsService.updateDocumentStatus(studentId, documentId, status);
        res.status(200).json(updatedDocs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 5. Delete Document for a Student
router.delete('/:studentId/delete-document/:documentId', async (req, res) => {
    try {
        const { studentId, documentId } = req.params;
        const updatedDocs = await admissionDocsService.deleteDocument(studentId, documentId);
        res.status(200).json(updatedDocs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
