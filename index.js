const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Dynamic route: Automatically detects file type (image/video)
app.get('/:filename', (req, res) => {
  const fileName = req.params.filename; // Get file name from URL
  const filePath = path.join(__dirname, fileName);

  if (fs.existsSync(filePath)) {
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const mediaList = jsonData.result;

    if (mediaList.length > 0) {
      const randomMedia = mediaList[Math.floor(Math.random() * mediaList.length)];

      // Check file type (image or video)
      const isVideo = /\.(mp4|webm|mov|avi)$/i.test(randomMedia);
      const isImage = /\.(jpg|jpeg|png|gif)$/i.test(randomMedia);

      if (isImage) {
        res.send(`
          <style>body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: black; }</style>
          <img src="${randomMedia}" style="max-width:100%; max-height:100%;" />
        `);
      } else if (isVideo) {
        res.send(`
          <style>body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: black; }</style>
          <video controls autoplay style="max-width:100%; max-height:100%;">
            <source src="${randomMedia}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `);
      } else {
        res.status(400).send('Invalid file format!');
      }
    } else {
      res.status(404).json({ error: 'No media files found in the JSON' });
    }
  } else {
    res.status(404).json({ error: 'File not found!' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
