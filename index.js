const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (needed for JSON files)
app.use(express.static(__dirname));

// Function to serve images or videos from JSON
const serveJsonMedia = (req, res) => {
    const jsonFileName = req.path.substring(1); // Remove leading "/"
    const filePath = path.join(__dirname, jsonFileName);

    // Check if the JSON file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).send("JSON file not found.");
    }

    // Read and parse the JSON file
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return res.status(500).send("Error reading file.");

        try {
            const jsonData = JSON.parse(data);
            if (!jsonData.result || !Array.isArray(jsonData.result) || jsonData.result.length === 0) {
                return res.status(500).send("Invalid JSON format.");
            }

            // Randomly select one media URL
            const mediaUrl = jsonData.result[Math.floor(Math.random() * jsonData.result.length)];
            const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
            const isImage = /\.(jpg|jpeg|png|gif)$/i.test(mediaUrl);

            // HTML response to display image/video
            res.send(`
                <html>
                <head>
                    <title>Random Media Viewer</title>
                    <style>
                        body { text-align: center; font-family: Arial, sans-serif; margin: 50px; background-color: #111; color: white; }
                        img, video { max-width: 80%; height: auto; border: 3px solid white; margin: 20px 0; }
                        a { color: yellow; font-size: 18px; }
                    </style>
                </head>
                <body>
                    <h2>Random Media Viewer</h2>
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
};

// Dynamic route for any JSON file
app.get("/*.json", serveJsonMedia);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
