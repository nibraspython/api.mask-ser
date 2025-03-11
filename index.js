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
                            <html>
                            <head>
                                <style>
                                    body { margin: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background: black; color: white; text-align: center; }
                                    img { max-width: 90vw; max-height: 80vh; object-fit: contain; border-radius: 10px; }
                                    .url { margin-top: 10px; font-size: 18px; word-wrap: break-word; }
                                    a { color: yellow; text-decoration: none; }
                                </style>
                            </head>
                            <body>
                                <img src="${randomMedia}" />
                                <div class="url">
                                    <a href="${randomMedia}" target="_blank">${randomMedia}</a>
                                </div>
                            </body>
                            </html>
                        `);
                    } else if (isVideo) {
                        res.send(`
                            <html>
                            <head>
                                <style>
                                    body { margin: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background: black; color: white; text-align: center; }
                                    video { max-width: 90vw; max-height: 80vh; object-fit: contain; border-radius: 10px; }
                                    .url { margin-top: 10px; font-size: 18px; word-wrap: break-word; }
                                    a { color: yellow; text-decoration: none; }
                                </style>
                            </head>
                            <body>
                                <video controls autoplay>
                                    <source src="${randomMedia}" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                                <div class="url">
                                    <a href="${randomMedia}" target="_blank">${randomMedia}</a>
                                </div>
                            </body>
                            </html>
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
