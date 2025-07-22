const express = require('express');
const router = express.Router();

const {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} = require('../controller/blogPostController');

// Public routes
router.get('/', getAllBlogPosts);
router.get('/:id', getBlogPostById);

// Admin routes (you can add authentication middleware if needed)
router.post('/', createBlogPost);
router.put('/:id', updateBlogPost);
router.delete('/:id', deleteBlogPost);

module.exports = router;
