const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Root Route (For API Status)
app.get('/', (req, res) => {
  res.send('API is working! Example: /Naruto.json or /Actions/Bully.json');
});

// Serve JSON Files from Root Directory
app.get('/:file', (req, res) => {
  const file = req.params.file;
  const filePath = path.join(__dirname, file);

  if (fs.existsSync(filePath) && file.endsWith('.json')) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Serve JSON Files from Subfolders (e.g., /Actions/Bully.json)
app.get('/:folder/:file', (req, res) => {
  const folder = req.params.folder;
  const file = req.params.file;
  const filePath = path.join(__dirname, folder, file);

  if (fs.existsSync(filePath) && file.endsWith('.json')) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
