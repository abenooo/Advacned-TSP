const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

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

// Protected routes (require authentication)
router.post('/', protect, createBlogPost);
router.put('/:id', protect, updateBlogPost);
router.delete('/:id', protect, deleteBlogPost);

module.exports = router;
