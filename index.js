const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/*', (req, res) => {
    const filePath = path.join(__dirname, req.params[0]);

    // Check if the file exists and is NOT a directory
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
        const fileExtension = path.extname(filePath).toLowerCase();

        if (fileExtension === '.json') {
            // If JSON file, parse and return random media
            try {
                const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                const mediaList = jsonData.result;

                if (Array.isArray(mediaList) && mediaList.length > 0) {
                    const randomMedia = mediaList[Math.floor(Math.random() * mediaList.length)];

                    // Detect if it's an image or video
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
                        res.status(400).json({ error: 'Invalid media format!' });
                    }
                } else {
                    res.status(404).json({ error: 'No media found in JSON' });
                }
            } catch (error) {
                res.status(500).json({ error: 'Error parsing JSON file!' });
            }
        } else {
            // If not a JSON file, return the file directly
            res.sendFile(filePath);
        }
    } else {
        res.status(404).json({ error: 'File not found!' });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
