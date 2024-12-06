import express from 'express';
const router = express.Router();
import Results from '../../../constants/Results.js';
import authMiddleware from '../../../modules/middlewares/authMiddleware.js';
import admissionServices from '../../../modules/addmission/services/staffs/addmissionServices.js';
import AddmissionDocsServices from '../../../modules/addmission/services/addmissionDocsServices.js';


router.get('/allpending/std', authMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const offset = (page - 1) * limit;

        const { data, total } = await admissionServices.getAllUnApprovedStudent(offset, limit);

        if (!data || data.length === 0) {
            return res.status(204).send();
        }

        return res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
            data,
        });
    } catch (error) {
        console.error('Error fetching unapproved students:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/un-approved', authMiddleware, async (req, res) => {
    try {
        const email = req.query.email;
        const result = await admissionServices.getUnApprovedStudent(email);

        // Check the status returned from the service
        if (result.status === 204) {
            return res.sendStatus(204);
        }

        // Handle the success case when a user is found (result.status === 200)
        return res.status(200).json({
            message: 'User data retrieved successfully.',
            data: result.data,
            status: 200
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

router.get('/std-doc', authMiddleware, async (req, res) => {
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

router.post('/application-action', authMiddleware, async (req, res) => {
    try {
        const { email, type, userId } = req.query;

        if (!email || !type || !userId) {
            return res.status(400).json({ message: ' email && type && userId required' });
        }

        const result = await admissionServices.applicationAction(email, type, userId);

        if (!result) {
            return res.status(500).json({ message: 'Somethin went wrong on server side !!!' });
        }

        return res.status(200).json({
            message: Results.UPDATED_SUCESSFULLY,
            data: result,
        });
    } catch (error) {
        console.error('Error fetching admission documents:', error);
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

router.post('/application-doc-action', authMiddleware, async (req, res) => {
    try {
        const { application_no, docType, type, userId } = req.query;

        if (!application_no || !docType || !type || !userId) {
            return {
                status: 400,
                message: "Incomplete request parameters."
            };
        }

        const result = await admissionServices.applicationDocAction(application_no, docType, type, userId);

        if (!result) {
            return res.status(500).json({ message: 'Somethin went wrong on server side !!!' });
        }

        return res.status(200).json({
            message: Results.UPDATED_SUCESSFULLY,
            data: result,
        });
    } catch (error) {
        console.error('Error fetching admission documents:', error);
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

router.get('/search-std', authMiddleware, async (req, res) => {
    try {
        const searchterm = req.query.searchterm;

        const result = await admissionServices.searchUnApprovedStudent(searchterm);

        // Check the status returned from the service
        if (result.status === 204) {
            return res.sendStatus(204);
        }

        // Handle the success case when a user is found (result.status === 200)
        return res.status(200).json({
            message: 'User data retrieved successfully.',
            data: result.data,
            status: 200
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});

router.get('/all-approved-std', authMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const offset = (page - 1) * limit;

        const { data, total } = await admissionServices.getAllApprovedStudent(offset, limit);

        if (!data || data.length === 0) {
            return res.status(204).send();
        }

        return res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
            data,
        });
    } catch (error) {
        console.error('Error fetching unapproved students:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
export default router; 