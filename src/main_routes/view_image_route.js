import path from 'path';


app.get('/view', (req, res) => {
    const { FOR, imageName } = req.params;

    // Function to get the upload path based on the "FOR" parameter
    const getFileUploadPath = (FOR) => {
        // Define the path logic for "FOR" here
        return path.join(__dirname, 'uploads', FOR);
    };

    const imageUploadPath = getFileUploadPath(FOR);
    const imagePath = path.join(imageUploadPath, imageName);

    // Check if the file exists
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist
            return res.status(404).send('File not found');
        }

        // Determine the content type based on the file extension
        const fileExtension = path.extname(imageName).toLowerCase();
        let contentType = 'image/jpeg';
        if (fileExtension === '.pdf') {
            contentType = 'application/pdf';
        }

        // Set headers and send the file
        res.setHeader('Content-Type', contentType);
        res.sendFile(imagePath, (error) => {
            if (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
        });
    });
});

export default router;