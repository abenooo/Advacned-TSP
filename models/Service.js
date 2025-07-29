const mongoose = require('mongoose');

const OrganizationNeedSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const BusinessValueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const CTASchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const SubServiceSchema = new mongoose.Schema({
  subServiceName: { type: String, required: true },
  slug: { type: String, required: true },
  moto: { type: String, required: true },
  definition: { type: String, required: true },
  commitment: { type: String, required: true },
  organizationNeed: {
    organizationalDefinition: { type: String, required: true },
    needs: [OrganizationNeedSchema]
  },
  businessValue: {
    businessValueDefinition: { type: String, required: true },
    values: [BusinessValueSchema]
  },
  cta: CTASchema
});

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  moto: { type: String, required: true },
  imageUrl: { type: String, required: true },
  icon: { type: String, required: true },
  subServices: [SubServiceSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
