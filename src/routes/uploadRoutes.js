const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const { upload } = require('../utils/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// POST /api/upload
// Uses 'image' as the field name in the multipart form
router.post('/', protect, upload.single('image'), uploadImage);

module.exports = router;
