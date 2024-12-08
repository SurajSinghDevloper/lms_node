import express from 'express';
import AddmissionDocsServices from '../../modules/addmission/services/addmissionDocsServices.js';
import uploadStorage from '../../utills/multer.js';
import authMiddleware from '../../modules/middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, uploadStorage.single("file"), async (req, res) => {
    try {
        let result = '';

        if (req.savedFileName) {
            result = await AddmissionDocsServices.createAdmissionDocs(req.body, req.savedFileName);
        } else {
            return res.status(400).json({ message: 'Error While Uploading Documents.' });
        }

        if (!result) {
            return res.status(500).json({ message: 'Error creating admission documents.' });
        }

        return res.status(201).json({
            message: `Doc Uploaded Successfully`,
            fileName: req.savedFileName,
        });
    } catch (error) {
        console.error('Error during document creation:', error);
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});


router.get('/doc', authMiddleware, async (req, res) => {
    try {
        const { studentId } = req.query;
        if (!studentId) {
            return res.status(400).json({ message: 'studentId is required.' });
        }

        const result = await AddmissionDocsServices.getAdmissionDocs(studentId);

        if (!result) {
            return res.status(404).json({ message: 'Admission documents not found.' });
        }

        return res.status(200).json({
            message: 'Admission documents retrieved successfully.',
            data: result,
        });
    } catch (error) {
        console.error('Error fetching admission documents:', error);
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});


router.post('/:studentId/document', async (req, res) => {
    try {
        const { studentId } = req.params;
        const document = req.body;
        const result = await AddmissionDocsServices.addDocument(studentId, document);

        if (!result) {
            return res.status(500).json({ message: 'Error adding document to admission record.' });
        }

        return res.status(200).json({ message: 'Document added successfully.', data: result });
    } catch (error) {
        console.error('Error adding document:', error);
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

router.put('/:studentId/document/:documentId/status', async (req, res) => {
    try {
        const { studentId, documentId } = req.params;
        const { status } = req.body;
        const result = await AddmissionDocsServices.updateDocumentStatus(studentId, documentId, status);

        if (!result) {
            return res.status(404).json({ message: 'Document or admission record not found.' });
        }

        return res.status(200).json({ message: 'Document status updated successfully.', data: result });
    } catch (error) {
        console.error('Error updating document status:', error);
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

router.delete('/:studentId/document/:documentId', async (req, res) => {
    try {
        const { studentId, documentId } = req.params;
        const result = await AddmissionDocsServices.deleteDocument(studentId, documentId);

        if (!result) {
            return res.status(404).json({ message: 'Document or admission record not found.' });
        }

        return res.status(200).json({ message: 'Document deleted successfully.', data: result });
    } catch (error) {
        console.error('Error deleting document:', error);
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

export default router;
