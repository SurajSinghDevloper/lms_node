
import Messages from "../../../../constants/Messages.js";
import Results from "../../../../constants/Results.js";
import Status from "../../../../constants/Status.js";
import AdmissionDocs from "../../models/AddmissionDocsModel.js";
import Admission from "../../models/AddmissionRejistrationModel.js";

const admissionServices = {
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
            const foundUser = await Admission.findOne({ email: email }).select(' -__v -cwsn -password');

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

    async applicationAction(email, type, userId) {

        const foundUserApplication = await Admission.findOne({ email: email });

        // If no user application is found, return a custom response
        if (!foundUserApplication) {
            return {
                status: 204, // No Content
                message: Results.NO_CONTENT_FOUND,
            };
        }

        // Check the type and update the approval status if it's "TRUE"
        if (type === "TRUE") {
            await foundUserApplication.updateOne(
                {
                    approvalStatus: Status.APPROVED,
                    approvedBy: userId

                }
            );
            return {
                status: 200,
                message: Results.UPDATED_SUCESSFULLY,
            };
        }
        if (type === "FALSE") {
            await foundUserApplication.updateOne({
                approvalStatus: Status.REJECTED,
                approvedBy: userId
            });
            return {
                status: 200,
                message: Results.UPDATED_SUCESSFULLY,
            };
        }

    },

    async applicationDocAction(application_no, docType, type, userId) {

        // Find the user application document
        const foundUserApplicationDoc = await AdmissionDocs.findOne({ application_no: application_no });

        // If no user application document is found
        if (!foundUserApplicationDoc) {
            return {
                status: 204,
                message: "No content found."
            };
        }

        // Locate the specific document by its type
        const targetDocument = foundUserApplicationDoc.documents.find(
            (doc) => doc.type === docType
        );

        // If the document type doesn't exist
        if (!targetDocument) {
            return {
                status: 404,
                message: `Document of type ${docType} not found.`,
            };
        }

        // Update the verification status and approver
        if (type === "TRUE") {
            targetDocument.veryfiedStatus = Status.APPROVED;
            targetDocument.actionby = userId;
        } else if (type === "FALSE") {
            targetDocument.veryfiedStatus = Status.REJECTED;
            targetDocument.actionby = userId;
        } else {
            return {
                status: 400,
                message: "Invalid type provided.",
            };
        }

        // Save the updated document
        await foundUserApplicationDoc.save();

        return {
            status: 200,
            message: "Document status updated successfully.",
        };
    },

    async searchUnApprovedStudent(searchterm) {
        try {
            // Search for the user in multiple fields
            // const foundUsers = await Admission.find({
            //     $or: [
            //         { email: searchterm },
            //         { mobile: searchterm },
            //         { applicationNo: searchterm },
            //     ],
            // }).select('-__v -cwsn -password');
            const foundUsers = await Admission.find({
                $or: [
                    { email: { $regex: searchterm, $options: "i" } },
                    { mobile: { $regex: searchterm, $options: "i" } },
                    { applicationNo: { $regex: searchterm, $options: "i" } },
                ],
            }).select('-__v -cwsn -password');

            // If no user is found, return a custom response
            if (foundUsers.length === 0) {
                return {
                    status: 204, // No Content
                    message: "No students found.",
                };
            }

            // Return the found user data
            return {
                status: 200, // OK
                data: foundUsers,
            };
        } catch (error) {
            console.error("Error fetching student data:", error);
            return {
                status: 500, // Internal Server Error
                message: "An error occurred while fetching the data.",
            };
        }
    },

    async getAllApprovedStudent(offset, limit) {
        try {
            // Fetch total count and paginated data concurrently
            const [total, result] = await Promise.all([
                Admission.countDocuments({ approvalStatus: Status.APPROVED.toString() }),
                Admission.find({ approvalStatus: Status.APPROVED.toString() })
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


}

export default admissionServices