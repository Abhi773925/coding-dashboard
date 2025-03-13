const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define a global upload directory (change if needed)
const uploadDir = path.join(__dirname, "../uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in the `uploads` folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Keep original name with timestamp
  },
});

const upload = multer({ storage });

module.exports = upload;
