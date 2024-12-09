
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
            const { name, mobile, email, dateOfExam, applicationNo, gender, appliedFor, month, year, addmissionExamDetails, createdBy } = req.body;

            if (!Middlewares.isStdDetailsPresent(email, addmissionExamDetails)) {
                return { status: Results.NO_CONTENT_FOUND };
            }

            const previousDetials = await AdmissionExam.find({ month: month, year: year, applicationNo: applicationNo })
            if (previousDetials) {
                return { status: Results.ALLREADY_EXIST }
            }
            const newExam = new AdmissionExam({
                name, mobile, email, dateOfExam, applicationNo, gender, appliedFor,
                approvalStatus: Status.PENDING, month, year, addmissionExamDetails, createdBy
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
    },

    async createAdmitCard(req) {
        try {
            const { userId, application_no, type } = req;

            // Find the record by application number
            const result = await AdmissionExam.findOne({ applicationNo: application_no });

            // Check if the record exists
            if (!result) {
                return {
                    status: Results.NO_CONTENT_FOUND,
                    message: "Student not found by given details",
                };
            }

            // Update the admit card status
            if (type === 'TRUE') {
                result.admitCardStatus = Status.APPROVED;
            } else if (type === 'FALSE') {
                result.admitCardStatus = Status.REJECTED;
            } else {
                return {
                    status: Results.INVALID_ACTION,
                    message: "Type is not correct !!!",
                };
            }
            result.createdBy = userId;

            // Save the updated record
            await result.save();

            // Return a success response
            return {
                status: Results.SUCCESS,
                message: "Admit card status updated successfully",
            };
        } catch (error) {
            // Log the error and return a failure response
            console.error("Error creating admit card:", error);
            return {
                status: Results.ERROR,
                message: "An error occurred while creating the admit card",
                error: error.message,
            };
        }
    }

};

export default admissionExaminationServices;
