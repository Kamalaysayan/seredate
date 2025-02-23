const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or port 3000

app.get('/api/images', (req, res) => {
  const imageDir = path.join(__dirname, 'images');

  fs.readdir(imageDir, (err, files) => {
    if (err) {
      console.error('Error reading image directory:', err);
      return res.status(500).json({ error: 'Failed to read images' });
    }

    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    });

    res.json(imageFiles);
  });
});

// Serve static files (your HTML, CSS, JavaScript)
app.use(express.static('.')); // Serves files from the current directory

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});