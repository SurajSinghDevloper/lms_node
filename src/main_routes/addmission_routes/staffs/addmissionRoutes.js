import express from 'express';
const router = express.Router();
import Results from '../../../constants/Results.js';
import authMiddleware from '../../../modules/middlewares/authMiddleware.js';
import admissionServices from '../../../modules/addmission/services/staffs/addmissionServices.js';


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


export default router;