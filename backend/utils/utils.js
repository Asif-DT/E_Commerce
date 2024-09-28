const multer = require("multer");

// Configure Multer storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Set the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Use a unique filename
  },
});

// Initialize the Multer middleware with storage settings
const upload = multer({ storage: storage });

module.exports = upload;
