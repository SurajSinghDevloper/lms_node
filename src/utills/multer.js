import multer from "multer";
import fs from 'fs';
import path from 'path';

const manageFileLocation = (fileOf, fileType) => {
    let destination = "";
    switch (fileOf) {
        case "STUDENTS":
            switch (fileType) {
                case "PERSONAL_DOCS":
                    destination =
                        "D://Personla_WS//MERN_RESOURCES//STUDENTS//PERSONAL_DOCS//";
                    break;
                case "CERTIFICATES":
                    destination =
                        "D://Personla_WS//MERN_RESOURCES//STUDENTS//CERTIFICATES//";
                    break;
                case "OTHERS":
                    destination =
                        "D://Personla_WS//MERN_RESOURCES//STUDENTS//OTHERS//";
                    break;
                default:
                    throw new Error("Invalid fileType");
            }
            break;
        default:
            throw new Error("Invalid fileOf");
    }
    return destination;
};

// Utility function to delete an existing file
const deleteImage = (destination, imageName) => {
    const filePath = path.join(destination, imageName);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
        console.log(`Deleted existing file: ${filePath}`);
        return true;
    } else {
        console.log(`File not found: ${filePath}`);
        return false;
    }
};

let stdId = ''
let filesOf = ''
let types = ''
let destination = ''
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { fileOf, fileType, studentId, type } = req.body;
        stdId = studentId;
        filesOf = fileOf
        types = type
        try {
            console.log(req.body);
            destination = manageFileLocation(fileOf, fileType);

            // Ensure the folder exists
            if (!fs.existsSync(destination)) {
                fs.mkdirSync(destination, { recursive: true });
            }

            cb(null, destination);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const fileName = `${stdId}_${filesOf}_${types}_${file.originalname}`;
        // Check if the file exists and delete it
        const deleted = deleteImage(destination, fileName);

        if (deleted) {
            console.log(`Replaced file: ${fileName}`);
        }

        req.savedFileName = fileName;
        cb(null, fileName);
    },
});

const uploadStorage = multer({ storage: storage });

export default uploadStorage