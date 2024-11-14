const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set up storage engine using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Directory where the uploaded files will be stored
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    // Generate a unique file name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Middleware to create the 'uploads' directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Route for handling file uploads

module.exports=upload;