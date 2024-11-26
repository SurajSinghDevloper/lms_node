
import Results from "../../../../constants/Results.js";
import Status from "../../../../constants/Status.js";
import Admission from "../../models/AddmissionRejistrationModel.js";

const admissionServices = {
    // async getAllUnApprovedStudent() {
    //     try {
    //         const result = await Admission.find({ approvalStatus: Status.PENDING.toString() })
    //         if (!result) {
    //             return Results.NO_CONTENT_FOUND;
    //         }
    //         return result;
    //     } catch (error) {
    //         console.error("Failed While Fetching Data: ", error);
    //         return Results.FAILED;
    //     }
    // }

    // Fetch total count and paginated data concurrently


    async getAllUnApprovedStudent(offset, limit) {
        try {
            // Fetch total count and paginated data concurrently
            const [total, result] = await Promise.all([
                Admission.countDocuments({ approvalStatus: Status.PENDING.toString() }),
                Admission.find({ approvalStatus: Status.PENDING.toString() })
                    .skip(offset)
                    .limit(limit)
                    .select('-password -stamp')
            ]);

            return { data: result, total };
        } catch (error) {
            console.error("Failed While Fetching Data: ", error);
            throw new Error("Database operation failed");
        }
    },
    async getUnApprovedStudent(email) {
        try {
            // Find the user by email
            const foundUser = await Admission.findOne({ email: email });

            // If no user is found, return a custom response
            if (!foundUser) {
                return {
                    status: 204, // No Content
                    message: Results.NO_CONTENT_FOUND,
                };
            }

            // Return the found user data
            return {
                status: 200, // OK
                data: foundUser,
            };
        } catch (error) {
            console.error("Error fetching unauthorized student data:", error);
            return {
                status: 500, // Internal Server Error
                message: "An error occurred while fetching the data.",
            };
        }
    },
}

export default admissionServices