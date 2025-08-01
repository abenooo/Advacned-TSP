import mongoose from "mongoose"
import Service from "./models/Service.js"
import { cloudComputingMigration } from "./services/cloudComputingMigration.js"
import { managedItServices } from "./services/managedItServices.js"
import { cybersecurityAndRiskManagement } from "./services/cybersecurityAndRiskManagement.js"
import { itConsultingAndStrategy } from "./services/itConsultingAndStrategy.js"
import { customWebSoftwareDevelopment } from "./services/customWebSoftwareDevelopment.js"

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = "mongodb+srv://codexethiopia:j0cqOhHzbb2KGspt@cluster0.kqqii5i.mongodb.net/"

// Array of all services to be seeded
const services = [
  cloudComputingMigration,
  managedItServices,
  cybersecurityAndRiskManagement,
  itConsultingAndStrategy,
  customWebSoftwareDevelopment,
]

async function seed() {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected to MongoDB")

    // Clear existing services
    console.log("Clearing existing services...")
    await Service.deleteMany({})
    console.log("✅ Cleared existing services")

    // Insert all services
    console.log("Seeding services...")
    const createdServices = await Service.insertMany(services)
    console.log(`✅ Successfully seeded ${createdServices.length} services`)

    // Log the created services for verification
    createdServices.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name} (${service.subServices.length} sub-services)`)
    })

    // Close the connection
    await mongoose.connection.close()
    console.log("✅ Database connection closed")

    // Exit the process
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding services:", error)
    await mongoose.connection.close()
    process.exit(1)
  }
}

// Run the seed function
seed()
