const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Function to get all JSON files in the directory
const getRandomJsonFile = () => {
    const files = fs.readdirSync(__dirname).filter(file => file.endsWith(".json"));
    if (files.length === 0) return null;
    return files[Math.floor(Math.random() * files.length)];
};

app.get("/", (req, res) => {
    const randomJsonFile = getRandomJsonFile();
    if (!randomJsonFile) {
        return res.status(404).send("No JSON files found in the directory.");
    }

    const filePath = path.join(__dirname, randomJsonFile);
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading file.");
        }

        try {
            const jsonData = JSON.parse(data);
            if (!jsonData.result || !Array.isArray(jsonData.result) || jsonData.result.length === 0) {
                return res.status(500).send("Invalid JSON format.");
            }

            // Select a random media URL
            const mediaUrl = jsonData.result[Math.floor(Math.random() * jsonData.result.length)];

            // Detect media type
            const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
            const isImage = /\.(jpg|jpeg|png|gif)$/i.test(mediaUrl);

            // Return HTML to display the media
            res.send(`
                <html>
                <head>
                    <title>Random Media Viewer</title>
                    <style>
                        body { text-align: center; font-family: Arial, sans-serif; margin: 50px; }
                        img, video { max-width: 100%; height: auto; border: 2px solid black; }
                        p { font-size: 18px; margin-top: 10px; }
                    </style>
                </head>
                <body>
                    ${isImage ? `<img src="${mediaUrl}" alt="Random Image">` : ""}
                    ${isVideo ? `<video controls autoplay><source src="${mediaUrl}" type="video/mp4"></video>` : ""}
                    <p>Source: <a href="${mediaUrl}" target="_blank">${mediaUrl}</a></p>
                </body>
                </html>
            `);
        } catch (parseError) {
            res.status(500).send("Error parsing JSON file.");
        }
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
