const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Root Route (Fixes "Cannot GET /")
app.get('/', (req, res) => {
  res.send('API is working! Example: /Actions/Bully.json');
});

// Dynamic Route to Serve JSON Files
app.get('/:folder/:file', (req, res) => {
  const folder = req.params.folder;
  const file = req.params.file;

  const filePath = path.join(__dirname, folder, file);

  // Check if the file exists before sending it
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

