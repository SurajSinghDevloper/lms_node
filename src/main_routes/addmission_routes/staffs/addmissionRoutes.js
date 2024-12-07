import express from 'express';
const router = express.Router();
import Results from '../../../constants/Results.js';
import authMiddleware from '../../../modules/middlewares/authMiddleware.js';
import admissionServices from '../../../modules/addmission/services/staffs/addmissionServices.js';
import AddmissionDocsServices from '../../../modules/addmission/services/addmissionDocsServices.js';
import addmissionExaminationResultServices from '../../../modules/addmission/services/staffs/addmissionExaminationResultServices.js'

import admissionExamDetailsServices from '../../../modules/addmission/services/staffs/admissionExamDetailsServices.js'

import admissionExaminationServices from '../../../modules/addmission/services/staffs/admissionExaminationServices.js'


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
router.post('/create-addmission/result', authMiddleware, async (req, res) => {
    try {
        const {
            month,
            year,
            dateOfExam,
            examFor,
            cutOff,
            applicationNo,
            scoredMarks,
            approvedBy,
            approvedDate
        } = req.body;

        // Validate required fields
        if (!month || !year || !dateOfExam || !examFor || !cutOff || !applicationNo || !scoredMarks || !approvedBy || !approvedDate) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }

        // Call the service function to create the admission result
        const result = await addmissionExaminationResultServices.createAdmissionResult(req);

        return res.status(201).json(result);
    } catch (error) {
        console.error("Error creating admission result:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
});


router.get('/exam-results', authMiddleware, async (req, res) => {
    try {
        const { offset = 0, limit = 10 } = req.query;

        // Parse offset and limit as integers
        const parsedOffset = parseInt(offset, 10);
        const parsedLimit = parseInt(limit, 10);

        // Call the service function to fetch exam results
        const results = await addmissionExaminationResultServices.getAllExamResults(parsedOffset, parsedLimit);

        return res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching exam results:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
});


router.put('/exam-results/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the route parameter
        const updateData = req.body; // Get the updated data from the request body

        // Call the service function to update the exam result
        const updatedResult = await addmissionExaminationResultServices.updateExamResult(id, updateData);

        return res.status(200).json(updatedResult);
    } catch (error) {
        console.error("Error updating exam result:", error);

        if (error.message === "Result not found") {
            return res.status(404).json({ status: "error", message: "Result not found" });
        }

        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

router.delete('/exam-results/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params; // Extract the ID from route parameters

        // Call the service function to delete the exam result
        const deleteResponse = await addmissionExaminationResultServices.deleteExamResult(id);

        return res.status(200).json(deleteResponse);
    } catch (error) {
        console.error("Error deleting exam result:", error);

        if (error.message === "Result not found") {
            return res.status(404).json({ status: "error", message: "Result not found" });
        }

        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
});


router.post('/exam-details', authMiddleware, async (req, res) => {
    try {
        const {
            month,
            year,
            dateOfExam,
            examFor,
            cutOff,
            approvedBy,
            approvedDate
        } = req.body;

        // Validation for required fields
        if (!month || !year || !dateOfExam || !examFor || !cutOff || !approvedBy || !approvedDate) {
            return res.status(400).json({
                status: "error",
                message: "All fields (month, year, dateOfExam, examFor, cutOff, approvedBy, approvedDate) are required."
            });
        }

        // Call the service function to create the exam detail
        const createdDetail = await admissionExamDetailsServices.createExamDetail(req);

        return res.status(201).json(createdDetail);
    } catch (error) {
        console.error("Error creating exam detail:", error);

        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
});


router.get('/exam-details', authMiddleware, async (req, res) => {
    try {
        // Extract offset and limit from query parameters
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 10;

        // Call the service function to fetch exam details
        const examDetails = await admissionExamDetailsServices.getAllExamDetails(offset, limit);

        // Respond with the fetched data
        return res.status(200).json(examDetails);
    } catch (error) {
        console.error("Error fetching exam details:", error);

        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
});

// Route to update exam detail
router.put('/exam-details/:id', authMiddleware, async (req, res) => {
    const { id } = req.params; // Get exam detail ID from URL params
    const updateData = req.body; // Get update data from request body

    try {
        const result = await admissionExamDetailsServices.updateExamDetail(id, updateData); // Call the update function
        return res.status(200).json(result); // Send success response
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ status: 'error', message: error.message }); // Send error response
    }
});

router.delete('/exam-details/:id', authMiddleware, async (req, res) => {
    const { id } = req.params; // Get exam detail ID from URL params

    try {
        const result = await admissionExamDetailsServices.deleteExamDetail(id); // Call the delete function
        return res.status(200).json(result); // Send success response
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ status: 'error', message: error.message }); // Send error response
    }
});



router.post('/exam', authMiddleware, async (req, res) => {
    const {
        name,
        mobile,
        email,
        dateOfExam,
        applicationNo,
        gender,
        marksScored,
        password,
        appliedFor,
        approvalStatus,
        approvedBy,
        approvedDate,
        month,
        year,

    } = req.body;

    // Validation for required fields
    if (!name || !mobile || !email || !dateOfExam || !applicationNo || !gender || !marksScored ||
        !password || !appliedFor || !approvalStatus || !approvedBy || !approvedDate || !month || !year) {
        return res.status(400).json({
            status: "error",
            message: "All fields (name, mobile, email, dateOfExam, applicationNo, gender, marksScored, password, appliedFor, approvalStatus, approvedBy, approvedDate, month, year) are required."
        });
    }

    try {
        const result = await admissionExaminationServices.createExam(req); // Call the createExam function with the request
        return res.status(201).json(result); // Send success response with the created exam details
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ status: 'error', message: error.message }); // Send error response
    }
});

router.get('/exams', authMiddleware, async (req, res) => {
    const { offset = 0, limit = 10 } = req.query; // Set default values for offset and limit

    // Validate that offset and limit are numbers
    if (isNaN(offset) || isNaN(limit)) {
        return res.status(400).json({
            status: "error",
            message: "Offset and limit must be valid numbers."
        });
    }

    // Convert offset and limit to integers
    const offsetValue = parseInt(offset, 10);
    const limitValue = parseInt(limit, 10);

    try {
        const result = await admissionExaminationServices.getAllExams(offsetValue, limitValue); // Call the getAllExams function with the validated offset and limit
        return res.status(200).json(result); // Send success response with the fetched exam records
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ status: 'error', message: error.message }); // Send error response
    }
});

// Route to update an exam
router.put('/exams/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const result = await admissionExaminationServices.updateExam(id, updateData);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error updating admission examination record: ", error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

// Route to delete an exam
router.delete('/exams/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await admissionExaminationServices.deleteExam(id); // Call the deleteExam method with the exam ID
        return res.status(200).json(result); // Send success response with the result
    } catch (error) {
        console.error("Error deleting admission examination record: ", error);
        return res.status(500).json({ status: 'error', message: error.message }); // Send error response
    }
});


export default router; 