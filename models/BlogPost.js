const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  coverImageUrl: String,
  tags: [String],
  published: { type: Boolean, default: false },
  publishedAt: Date,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', BlogPostSchema);
