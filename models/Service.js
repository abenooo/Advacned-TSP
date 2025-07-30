const mongoose = require("mongoose")

const subServiceSchema = new mongoose.Schema({
  subServiceName: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  moto: String,
  definition: String,
  commitment: String,
  organizationNeed: {
    organizationalDefinition: String,
    needs: [
      {
        title: String,
        description: String,
      },
    ],
  },
  businessValue: {
    businessValueDefinition: String,
    values: [
      {
        title: String,
        description: String,
      },
    ],
  },
  cta: {
    title: String,
    description: String,
  },
})

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    moto: String,
    imageUrl: String,
    icon: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },
    subServices: [subServiceSchema],
  },
  {
    timestamps: true,
  },
)

// Create indexes for better performance
serviceSchema.index({ slug: 1 })
serviceSchema.index({ name: 1 })

const Service = mongoose.model("Service", serviceSchema)

module.exports = Service
