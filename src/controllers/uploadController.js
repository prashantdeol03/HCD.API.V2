const { upload } = require('../utils/cloudinary');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // Multer-storage-cloudinary automatically uploads and provides the URL
    res.json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
};
