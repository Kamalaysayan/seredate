const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('.'));
app.use(express.json());

const dataPath = path.join(__dirname, 'data.json');

app.get('/api/links', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading links:', err);
      return res.status(500).json({ error: 'Failed to read links' });
    }
    const links = JSON.parse(data || '[]');
    res.json(links);
  });
});

app.post('/api/links', (req, res) => {
  const newLink = req.body.link;
  fs.readFile(dataPath, 'utf8', (err, data) => {
    let links = [];
    if (!err && data) {
      links = JSON.parse(data);
    }
    links.push({ link: newLink, password: String(links.length + 1).padStart(3, '0') });
    fs.writeFile(dataPath, JSON.stringify(links), (err) => {
      if (err) {
        console.error('Error saving link:', err);
        return res.status(500).json({ error: 'Failed to save link' });
      }
      res.json({ success: true });
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
