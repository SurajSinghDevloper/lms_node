import fs from 'fs';
import path from 'path';

let __dirname = ''
const fileHandler = {
    saveFile(file, fileType, fileOf, fileName) {
        __dirname = manageFileLocation(fileOf, fileType);
        const directoryPath = path.join(__dirname);
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
        }

        // const extension = fileType.split('/')[1];
        const filePath = path.join(directoryPath, `${fileName}`);
        fs.writeFileSync(filePath, file);
        return filePath;
    },

    getImageByName(imageName) {
        const directoryPath = path.join(__dirname);
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

const manageFileLocation = (fileOf, fileType) => {
    let destination = ''
    switch (fileOf) {
        case 'STUDENTS':
            switch (fileType) {
                case 'PERSONAL_DOCS':
                    destination = 'D://Personla_WS//MERN_RESOURCES//STUDENTS//PERSONAL_DOCS//'
                    break;
                case 'CERTIFICATES':
                    destination = 'D://Personla_WS//MERN_RESOURCES//STUDENTS//CERTIFICATES//'
                    break;
                case 'OTHERS':
                    destination = 'D://Personla_WS//MERN_RESOURCES//STUDENTS//OTHERS//'
                    break;

                default:
                    break;
            }
            break;

        default:
            break;
    }
    return destination;
}

export default fileHandler;
