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
      index: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
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

// Removed duplicate index definitions since they're now defined in the schema

const Service = mongoose.model("Service", serviceSchema)

module.exports = Service
