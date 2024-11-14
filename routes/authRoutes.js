const express = require('express')
const router = express.Router()
const { hello, register, login, user, } = require('../Controller/authController')
const authmiddleware = require("../Middleware/AuthMiddleware")
const upload= require('../store');

const logger = require('../logger');



router.get('/', hello )
router.post('/register', register  )
router.post('/login', login  )
router.get('/user',authmiddleware ,user  )


router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      path: req.file.path
    });
  });
  
  

module.exports = router;
