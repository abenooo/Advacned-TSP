const AdminUser = require('../models/AdminUser');

// Get all admin users
exports.getAllAdminUsers = async (req, res) => {
  const users = await AdminUser.find();
  res.json(users);
};

// Get one admin user by ID
exports.getAdminUserById = async (req, res) => {
  const user = await AdminUser.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
};

// Create admin user
exports.createAdminUser = async (req, res) => {
  const user = new AdminUser(req.body);
  await user.save();
  res.status(201).json(user);
};

// Update admin user
exports.updateAdminUser = async (req, res) => {
  const user = await AdminUser.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
};

// Delete admin user
exports.deleteAdminUser = async (req, res) => {
  await AdminUser.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
