import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileHandler = {
    saveFile(file, fileType, fileName) {
        const directoryPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
        }

        const extension = fileType.split('/')[1];
        const filePath = path.join(directoryPath, `${fileName}.${extension}`);
        fs.writeFileSync(filePath, file);
        return filePath;
    },

    getImageByName(imageName) {
        const directoryPath = path.join(__dirname, 'uploads');
        const files = fs.readdirSync(directoryPath);
        const imageFile = files.find(file => file.startsWith(imageName));

        if (imageFile) {
            return fs.readFileSync(path.join(directoryPath, imageFile));
        }
        console.error(`Image ${imageName} not found.`);
        return null;
    },

    deleteFile(filePath) {
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
    }
}

export default fileHandler;
