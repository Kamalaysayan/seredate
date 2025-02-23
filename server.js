const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'docs/uploads'); // Images will be saved in 'docs/uploads'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp for filename
    }
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'docs'))); // Serve static files from 'docs'
app.use(express.json()); // To parse JSON request bodies (important!)

// Handle image uploads
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
    }

    const imageId = Date.now();
    const imageUrl = `/uploads/${req.file.filename}`; // URL for the image
    const filePath = req.file.path; // Path to the uploaded image

    // Optional: Create an HTML page for each image (you can remove this if you don't need it)
    const imagePageContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Image Page</title>
        </head>
        <body>
            <img src="${imageUrl}" alt="Uploaded Image">
        </body>
        </html>
    `;
    fs.writeFileSync(`docs/image-page-${imageId}.html`, imagePageContent);


    res.json({ message: 'Image uploaded successfully!', filePath: imageUrl, imageId: imageId });
});

// Route to get image data (for the pink containers on the editor page)
app.get('/images', (req, res) => {
    const uploadsDir = path.join(__dirname, 'docs', 'uploads');

    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error("Error reading uploads directory:", err);
            return res.status(500).json({ error: "Failed to read images" });
        }

        const images = files.map(file => {
            const id = file.split('.')[0]; // Extract the ID from the filename
            const url = `/uploads/${file}`;
            return { id, url };
        });

        res.json(images);
    });
});

app.delete('/delete-image/:id', (req, res) => {
    const imageId = req.params.id;
    const uploadsDir = path.join(__dirname, 'docs', 'uploads');

    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error("Error reading uploads directory:", err);
            return res.status(500).json({ error: "Failed to read images" });
        }

        const fileToDelete = files.find(file => file.startsWith(imageId));
        if (!fileToDelete) {
            return res.status(404).json({ error: "Image not found" });
        }

        fs.unlink(path.join(uploadsDir, fileToDelete), (err) => {
            if (err) {
                console.error("Error deleting image:", err);
                return res.status(500).json({ error: "Failed to delete image" });
            }
            res.json({ message: "Image deleted successfully" });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});