// seedCareerJobs.js
const mongoose = require('mongoose');
const CareerJob = require('./models/CareerJob');

// Replace with your actual MongoDB connection string
const MONGODB_URI = 'mongodb+srv://codexethiopia:j0cqOhHzbb2KGspt@cluster0.kqqii5i.mongodb.net/';

const jobs = [
  {
    title: "Software Engineer",
    slug: "software-engineer",
    description: "Develop and maintain web applications.",
    requirements: ["BSc in Computer Science", "2+ years experience", "JavaScript", "Node.js"],
    postedAt: new Date("2024-06-01"),
    closingAt: new Date("2024-07-01"),
    published: true,
  },
  {
    title: "Data Analyst",
    slug: "data-analyst",
    description: "Analyze data to help business decisions.",
    requirements: ["BSc in Statistics", "Excel", "SQL", "Python"],
    postedAt: new Date("2024-06-05"),
    closingAt: new Date("2024-07-05"),
    published: true,
  },
  {
    title: "Marketing Manager",
    slug: "marketing-manager",
    description: "Lead marketing campaigns and strategies.",
    requirements: ["BSc in Marketing", "5+ years experience", "Leadership skills"],
    postedAt: new Date("2024-06-10"),
    closingAt: new Date("2024-07-10"),
    published: true,
  },
  {
    title: "UX/UI Designer",
    slug: "ux-ui-designer",
    description: "Design user interfaces and experiences.",
    requirements: ["Portfolio", "Figma", "Adobe XD", "Creativity"],
    postedAt: new Date("2024-06-12"),
    closingAt: new Date("2024-07-12"),
    published: true,
  },
  {
    title: "Project Manager",
    slug: "project-manager",
    description: "Manage software development projects.",
    requirements: ["PMP Certification", "3+ years experience", "Agile/Scrum"],
    postedAt: new Date("2024-06-15"),
    closingAt: new Date("2024-07-15"),
    published: true,
  },
  {
    title: "HR Specialist",
    slug: "hr-specialist",
    description: "Handle recruitment and employee relations.",
    requirements: ["BSc in HR", "Communication skills", "Organizational skills"],
    postedAt: new Date("2024-06-18"),
    closingAt: new Date("2024-07-18"),
    published: true,
  },
  {
    title: "Content Writer",
    slug: "content-writer",
    description: "Write and edit content for various platforms.",
    requirements: ["Excellent writing skills", "SEO knowledge", "Portfolio"],
    postedAt: new Date("2024-06-20"),
    closingAt: new Date("2024-07-20"),
    published: true,
  },
  {
    title: "QA Engineer",
    slug: "qa-engineer",
    description: "Test software for bugs and issues.",
    requirements: ["Attention to detail", "Testing tools", "Automation experience"],
    postedAt: new Date("2024-06-22"),
    closingAt: new Date("2024-07-22"),
    published: true,
  },
  {
    title: "DevOps Engineer",
    slug: "devops-engineer",
    description: "Maintain CI/CD pipelines and cloud infrastructure.",
    requirements: ["AWS/Azure", "Docker", "CI/CD tools"],
    postedAt: new Date("2024-06-25"),
    closingAt: new Date("2024-07-25"),
    published: true,
  },
  {
    title: "Customer Support Specialist",
    slug: "customer-support-specialist",
    description: "Assist customers with inquiries and issues.",
    requirements: ["Patience", "Communication skills", "Problem-solving"],
    postedAt: new Date("2024-06-28"),
    closingAt: new Date("2024-07-28"),
    published: true,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await CareerJob.deleteMany({});
  await CareerJob.insertMany(jobs);
  console.log('Seeded 10 career jobs!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
