const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  image: { type: String },
  imageAlt: { type: String, default: '' },
  focusKeyword: { type: String, default: '' },
  readTime: { type: String, default: '5 min read' },
  status: { type: String, enum: ['draft', 'published', 'scheduled', 'unpublished'], default: 'draft' },
  publishDate: { type: Date, default: Date.now },
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  blocks: [{
    type: { type: String, enum: ['text', 'image'], default: 'text' },
    content: { type: String, default: '' },
    url: { type: String, default: '' },
    alt: { type: String, default: '' }
  }],
  faqs: [{ question: String, answer: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
