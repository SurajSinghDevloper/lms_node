

const getFile = (req, res) => {
    const { fileOf, fileType, fileName } = req.querry;

    try {
        // Determine the file's destination directory
        const destination = manageFileLocation(fileOf, fileType);

        // Construct the full file path
        const filePath = path.join(destination, fileName);

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found." });
        }

        // Send the file to the client
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).json({ message: "Error sending file." });
            }
        });
    } catch (error) {
        console.error("Error retrieving file:", error);
        res.status(500).json({ message: "Server error retrieving file." });
    }
};

const manageFileLocation = (fileOf, fileType) => {
    let destination = "";
    switch (fileOf) {
        case "STUDENTS":
            switch (fileType) {
                case "PERSONAL_DOCS":
                    destination = FILE_LOCATIONS.STUDENTS.PERSONAL_DOCS;
                    break;
                case "CERTIFICATES":
                    destination = FILE_LOCATIONS.STUDENTS.CERTIFICATES;
                    break;
                case "OTHERS":
                    destination = FILE_LOCATIONS.STUDENTS.OTHERS;
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

export default getFile;
