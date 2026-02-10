const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Storage Engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    // Unique filename: fieldname-timestamp.ext
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image'); // 'image' key frontend se match honi chahiye

// Check File Type Function
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// POST endpoint
router.post('/', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err });
    } else {
      if (req.file == undefined) {
        return res.status(400).json({ success: false, message: 'No File Selected!' });
      } else {
        // ✅ Correct URL return kar raha hai
        return res.json({
          success: true,
          filePath: `/uploads/${req.file.filename}`
        });
      }
    }
  });
});

module.exports = router;