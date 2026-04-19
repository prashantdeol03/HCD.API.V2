const express = require('express');
const router = express.Router();
const { createBlog, getBlogs, getBlogBySlug, getBlogById, updateBlog, deleteBlog } = require('../controllers/blogController');
const { uploadImage } = require('../controllers/uploadController');
const { protect, adminOrEditor, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinary');

router.post('/upload', protect, adminOrEditor, upload.single('image'), uploadImage);

router.route('/')
  .get(getBlogs)
  .post(protect, adminOrEditor, createBlog);

router.route('/:slug').get(getBlogBySlug);

router.route('/id/:id').get(getBlogById);

router.route('/:id')
  .put(protect, adminOrEditor, updateBlog)
  .delete(protect, adminOnly, deleteBlog);

module.exports = router;
