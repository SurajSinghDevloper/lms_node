import Results from "../../../../constants/Results.js";
import AdmissionExamResult from "../../models/AddmissionResultModel.js";
import Middlewares from "../../../middlewares/middlewares.js";
import AdmissionExamDetails from "../../models/AddmissionExaminationDeatilsModel.js";

const admissionExaminationResultServices = {
    /**
     * Create a new admission examination result
     * @param {Object} req - Request object containing result details
     * @returns {Object} Created result
     */
    async createAdmissionResult(req) {
        try {
            const { month, year, applicationNo, scoredMarks, addmissionExamDetails, createdBy } = req.body;
            if (!Middlewares.isStdExamDetailsPresent(applicationNo, addmissionExamDetails)) {
                return {
                    status: Results.INVALID_ACTION
                }
            }
            const stdEamDetails = AdmissionExamDetails.findById(addmissionExamDetails);
            const previousDetials = await AdmissionExamResult.findOne({ applicationNo })
            if (previousDetials) {
                return {
                    status: Results.ALLREADY_EXIST
                }
            }
            const newResult = new AdmissionExamResult({
                month,
                year,
                dateOfExam: stdEamDetails.dateOfExam,
                examFor: stdEamDetails.examFor,
                cutOff: stdEamDetails.cutOff,
                applicationNo,
                scoredMarks,
                addmissionExamDetails,
                createdBy
            });

            const savedResult = await newResult.save();
            return { status: Results.SUCCESS, data: savedResult };
        } catch (error) {
            console.error("Error creating admission result: ", error);
            throw new Error("Database operation failed");
        }
    },

    /**
     * Fetch all examination results with pagination
     * @param {number} offset - Pagination offset
     * @param {number} limit - Pagination limit
     * @returns {Object} Paginated results and total count
     */
    async getAllExamResults(offset, limit) {
        try {
            const [total, results] = await Promise.all([
                AdmissionExamResult.countDocuments(),
                AdmissionExamResult.find()
                    .skip(offset)
                    .limit(limit)
            ]);

            return { status: Results.SUCCESS, data: results, total };
        } catch (error) {
            console.error("Error fetching results: ", error);
            throw new Error("Database operation failed");
        }
    },

    /**
     * Update an admission examination result by ID
     * @param {string} id - Result ID
     * @param {Object} updateData - Data to update
     * @returns {Object} Updated result
     */
    async updateExamResult(id, updateData) {
        try {
            const updatedResult = await AdmissionExamResult.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedResult) throw new Error("Result not found");

            return { status: Results.SUCCESS, data: updatedResult };
        } catch (error) {
            console.error("Error updating result: ", error);
            throw new Error("Database operation failed");
        }
    },

    /**
     * Delete an admission examination result by ID
     * @param {string} id - Result ID
     * @returns {Object} Deletion status
     */
    async deleteExamResult(id) {
        try {
            const deletedResult = await AdmissionExamResult.findByIdAndDelete(id);
            if (!deletedResult) throw new Error("Result not found");

            return { status: Results.SUCCESS, message: "Result deleted successfully" };
        } catch (error) {
            console.error("Error deleting result: ", error);
            throw new Error("Database operation failed");
        }
    }
};

export default admissionExaminationResultServices;
