const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Root Route
app.get('/', (req, res) => {
  res.send('API is working! Example: /random-video');
});

// Random Video Route
app.get('/random-video', (req, res) => {
  const filePath = path.join(__dirname, 'Naruto.json'); // Change file name if needed
  
  if (fs.existsSync(filePath)) {
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const videos = jsonData.result;
    
    if (videos.length > 0) {
      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      
      res.send(`
        <h2>Random Video</h2>
        <video controls autoplay width="600">
          <source src="${randomVideo}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <br><a href="/random-video">Get Another Video</a>
      `);
    } else {
      res.status(404).json({ error: 'No videos found in the JSON file' });
    }
  } else {
    res.status(404).json({ error: 'JSON file not found' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
