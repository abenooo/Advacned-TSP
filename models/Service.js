const mongoose = require('mongoose');

const SubServiceSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  imageUrl: String,
  mainTasks: [String],
});

const ServiceSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  imageUrl: String,
  subService: [{
    title: String,
    description: String,
    heading: String,
    image: String
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
