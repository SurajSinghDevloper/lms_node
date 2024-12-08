
import Results from "../../../../constants/Results.js";
import AdmissionExamDetails from "../../models/AddmissionExaminationDeatilsModel.js";
import AdmissionExam from "../../models/AddmissionExaminationModel.js";
import User from "../../../users/models/UserModel.js"
import Middlewares from "../../../middlewares/middlewares.js";

const admissionExamDetailsServices = {
    /**
     * Create a new admission examination detail
     * @param {Object} req - Request object containing details
     * @returns {Object} Created detail
     */
    async createExamDetail(req) {
        try {
            const { month, year, dateOfExam, examFor, cutOff, createdBy } = req.body;

            const newDetail = new AdmissionExamDetails({
                month,
                year,
                dateOfExam,
                examFor,
                cutOff,
                createdBy
            });
            if (Middlewares.isUserAuthenticated(createdBy)) {
                await newDetail.save();
                return { status: Results.SUCCESS };
            }
            return {
                status: Results.NOT_VALID_USER
            }
        } catch (error) {
            console.error("Error creating exam detail: ", error);
            throw new Error("Database operation failed");
        }
    },

    /**
     * Fetch all admission examination details with pagination
     * @param {number} offset - Pagination offset
     * @param {number} limit - Pagination limit
     * @returns {Object} Paginated details and total count
     */
    async getAllExamDetails(offset, limit) {
        try {
            const [total, details] = await Promise.all([
                AdmissionExamDetails.countDocuments(),
                AdmissionExamDetails.find()
                    .skip(offset)
                    .limit(limit)
                    .select("-stamp") // Exclude the `stamp` field if not needed
            ]);

            return { status: Results.SUCCESS, data: details, total };
        } catch (error) {
            console.error("Error fetching exam details: ", error);
            throw new Error("Database operation failed");
        }
    },

    /**
     * Update an admission examination detail by ID
     * @param {string} id - Detail ID
     * @param {Object} updateData - Data to update
     * @returns {Object} Updated detail
     */
    async updateExamDetail(id, updateData) {
        try {
            const updatedDetail = await AdmissionExamDetails.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedDetail) throw new Error("Detail not found");

            return { status: Results.SUCCESS, data: updatedDetail };
        } catch (error) {
            console.error("Error updating exam detail: ", error);
            throw new Error("Database operation failed");
        }
    },

    /**
     * Delete an admission examination detail by ID
     * @param {string} id - Detail ID
     * @returns {Object} Deletion status
     */
    async deleteExamDetail(id) {
        try {
            const deletedDetail = await AdmissionExamDetails.findByIdAndDelete(id);
            if (!deletedDetail) throw new Error("Detail not found");

            return { status: Results.SUCCESS, message: "Detail deleted successfully" };
        } catch (error) {
            console.error("Error deleting exam detail: ", error);
            throw new Error("Database operation failed");
        }
    }
};

export default admissionExamDetailsServices;
