const BlogPost = require('../models/BlogPost');

// Get all blog posts
exports.getAllBlogPosts = async (req, res) => {
  const posts = await BlogPost.find().populate('author', 'name email');
  res.json(posts);
};

// Get a single blog post by ID
exports.getBlogPostById = async (req, res) => {
  const post = await BlogPost.findById(req.params.id).populate('author', 'name email');
  if (!post) return res.status(404).json({ message: 'Not found' });
  res.json(post);
};

// Create a new blog post
exports.createBlogPost = async (req, res) => {
  const post = new BlogPost(req.body);
  await post.save();
  res.status(201).json(post);
};

// Update a blog post
exports.updateBlogPost = async (req, res) => {
  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!post) return res.status(404).json({ message: 'Not found' });
  res.json(post);
};

// Delete a blog post
exports.deleteBlogPost = async (req, res) => {
  await BlogPost.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
