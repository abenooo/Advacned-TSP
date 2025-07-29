const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

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
router.post('/', auth, createBlogPost);
router.put('/:id', auth, updateBlogPost);
router.delete('/:id', auth, deleteBlogPost);

module.exports = router;
