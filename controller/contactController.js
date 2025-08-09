const Contact = require('../models/Contact');

// Public: Create a contact submission
exports.createContact = async (req, res) => {
  try {
    const requiredFields = ['fullName', 'email', 'companyName', 'description'];
    const missing = requiredFields.filter(f => !req.body[f]);
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const contact = new Contact({
      fullName: req.body.fullName,
      email: req.body.email,
      companyName: req.body.companyName,
      description: req.body.description,
      source: req.body.source || 'website-contact-form'
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Contact submitted successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating contact',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Admin: Get all contacts
exports.getAllContacts = async (req, res) => {
  try {
    const { status, from, to } = req.query;
    const query = {};

    if (status) query.status = status;
    if (from && to) {
      query.createdAt = { $gte: new Date(from), $lte: new Date(to) };
    }

    const contacts = await Contact.find(query)
      .populate('processedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Admin: Get a single contact
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('processedBy', 'name email role');

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Update contact status or mark processed
exports.updateContact = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.status && !['new', 'reviewed', 'contacted', 'archived'].includes(updates.status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'markProcessed') && updates.markProcessed) {
      updates.processedBy = req.user._id;
    }

    const contact = await Contact.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('processedBy', 'name email role');

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Delete contact
exports.deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
