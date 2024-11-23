const parseMultipart = (req, res, next) => {
    if (req.headers['content-type']?.startsWith('multipart/form-data')) {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString(); // Accumulate the data
        });

        req.on('end', () => {
            const boundary = req.headers['content-type'].split('boundary=')[1];
            if (!boundary) {
                return res.status(400).json({ error: 'Invalid multipart/form-data format' });
            }

            const parts = body.split(`--${boundary}`).filter((part) => part.trim() !== '' && part.trim() !== '--');
            const formData = {};

            parts.forEach((part) => {
                const [header, value] = part.split('\r\n\r\n');
                if (header && value) {
                    const nameMatch = header.match(/name="(.+?)"/);
                    if (nameMatch) {
                        const name = nameMatch[1];
                        formData[name] = value.trim();
                    }
                }
            });

            req.body = formData; // Attach parsed data to `req.body`
            next(); // Pass control to the next middleware
        });
    } else {
        next(); // If not multipart, skip parsing
    }
};

export default parseMultipart;