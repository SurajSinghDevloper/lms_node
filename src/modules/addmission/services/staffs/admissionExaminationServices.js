
import Results from "../../../../constants/Results.js";
import Status from "../../../../constants/Status.js";
import AdmissionExam from "../../models/AddmissionExaminationModel.js";
import Middlewares from "../../../middlewares/middlewares.js";

const admissionExaminationServices = {
    /**
     * Create a new admission examination record
     * @param {Object} req - Request object containing details
     * @returns {Object} Created record
     */
    async createExam(req) {
        try {
            const { name, mobile, email, dateOfExam, applicationNo, gender, appliedFor, month, year, addmissionExamDetails } = req.body;

            if (!Middlewares.isStdDetailsPresent(email, addmissionExamDetails)) {
                return { status: Results.NO_CONTENT_FOUND };
            }

            const previousDetials = await AdmissionExam.find({ month: month, year: year, applicationNo: applicationNo })
            if (previousDetials) {
                return { status: Results.ALLREADY_EXIST }
            }
            const newExam = new AdmissionExam({
                name, mobile, email, dateOfExam, applicationNo, gender, appliedFor,
                approvalStatus: Status.PENDING, month, year, addmissionExamDetails
            });

            const savedExam = await newExam.save();
            return { status: Results.SUCCESS };
        } catch (error) {
            console.error("Error creating admission examination record: ", error);
            throw new Error("Database operation failed");
        }
    },

    /**
     * Fetch all admission examination records with pagination
     * @param {number} offset - Pagination offset
     * @param {number} limit - Pagination limit
     * @returns {Object} Paginated records and total count
     */
    async getAllExams(offset, limit) {
        try {
            const [total, records] = await Promise.all([
                AdmissionExam.countDocuments(),
                AdmissionExam.find()
                    .skip(offset)
                    .limit(limit)
                    .select("-password -stamp")
            ]);

            return { status: Results.SUCCESS, data: records, total };
        } catch (error) {
            console.error("Error fetching admission examination records: ", error);
            throw new Error("Database operation failed");
        }
    },

    /**
     * Update an admission examination record by ID
     * @param {string} id - Record ID
     * @param {Object} updateData - Data to update
     * @returns {Object} Updated record
     */
    async updateExam(id, updateData) {
        try {
            const updatedExam = await AdmissionExam.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedExam) throw new Error("Record not found");

            return { status: Results.SUCCESS, data: updatedExam };
        } catch (error) {
            console.error("Error updating admission examination record: ", error);
            throw new Error("Database operation failed");
        }
    },

    /**
     * Delete an admission examination record by ID
     * @param {string} id - Record ID
     * @returns {Object} Deletion status
     */
    async deleteExam(id) {
        try {
            const deletedExam = await AdmissionExam.findByIdAndDelete(id);
            if (!deletedExam) throw new Error("Record not found");

            return { status: Results.SUCCESS, message: "Record deleted successfully" };
        } catch (error) {
            console.error("Error deleting admission examination record: ", error);
            throw new Error("Database operation failed");
        }
    }
};

export default admissionExaminationServices;
