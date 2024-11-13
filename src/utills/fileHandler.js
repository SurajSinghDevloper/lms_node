import fs from 'fs';
import path from 'path';

/**
 * Saves a file locally.
 * @param {Buffer} file - The file buffer to save.
 * @param {string} fileType - The type of the file (e.g., 'image/png', 'text/plain').
 * @param {string} fileName - The name to save the file as.
 * @returns {string} - The file path where the file was saved.
 */
const saveFile = (file, fileType, fileName) => {
    const directoryPath = path.join(__dirname, 'uploads');

    // Ensure uploads directory exists
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }

    const extension = fileType.split('/')[1]; // Extract extension from MIME type
    const filePath = path.join(directoryPath, `${fileName}.${extension}`);

    // Write the file to the specified path
    fs.writeFileSync(filePath, file);

    return filePath;
};


/**
 * Retrieves an image by its name.
 * @param {string} imageName - The name of the image to retrieve (without extension).
 * @returns {Buffer|null} - The image file buffer if found, or null if not found.
 */
const getImageByName = (imageName) => {
    const directoryPath = path.join(__dirname, 'uploads');

    // Find the file with the specified name in the uploads directory
    const files = fs.readdirSync(directoryPath);
    const imageFile = files.find(file => file.startsWith(imageName));

    if (imageFile) {
        const filePath = path.join(directoryPath, imageFile);
        return fs.readFileSync(filePath);
    } else {
        console.error(`Image ${imageName} not found.`);
        return null;
    }
};

/**
 * Deletes a file from the server.
 * @param {string} filePath - The full file path to delete.
 * @returns {boolean} - Returns true if file deleted successfully, otherwise false.
 */
const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error deleting file:", error);
        return false;
    }
};

export default {
    saveFile,
    deleteFile,
    getImageByName
};