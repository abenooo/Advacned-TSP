require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error(err));

const services = [
  {
    name: 'Managed IT Services',
    slug: 'managed-it-services',
    description: 'Proactive management of IT infrastructure.',
    imageUrl: 'https://example.com/images/managed-it.jpg',
    subServices: [
      { name: '24/7 IT Infrastructure Monitoring & Support' },
      { name: 'Help Desk & Remote Troubleshooting' },
      { name: 'Patch Management & System Updates' },
      { name: 'Backup & Disaster Recovery Planning' },
      { name: 'Performance Optimization & Reporting' },
      { name: 'Endpoint Management (PCs, servers, mobile)' },
      { name: 'Vendor Management (ISP, software providers)' }
    ]
  },
  {
    name: 'Cloud Computing & Migration (AWS, Azure)',
    slug: 'cloud-computing-migration',
    description: 'Migration and management of cloud infrastructure.',
    imageUrl: 'https://example.com/images/cloud-computing.jpg',
    subServices: [
      { name: 'Cloud Readiness Assessment' },
      { name: 'Design and Deployment of Scalable Cloud Architecture' },
      { name: 'Server, Database & App Migration' },
      { name: 'Cost Optimization & Auto-scaling Setup' },
      { name: 'Multi-cloud and Hybrid Cloud Setup' },
      { name: 'Ongoing Cloud Infrastructure Management' },
      { name: 'Connect on-premise systems with cloud services using VPN, Direct Connect, or ExpressRoute' },
      { name: 'Integrate SaaS platforms (e.g., Salesforce, Office 365) with cloud-native applications' },
      { name: 'Setup of CI/CD pipelines for cloud-hosted applications' }
    ]
  },
  {
    name: 'Cybersecurity & Risk Management',
    slug: 'cybersecurity-risk-management',
    description: 'Security and compliance for your business.',
    imageUrl: 'https://example.com/images/cybersecurity.jpg',
    subServices: [
      { name: 'Risk Assessments & Security Audits' },
      { name: 'Firewall and Intrusion Detection/Prevention Setup' },
      { name: 'Endpoint Protection and Anti-malware Solutions' },
      { name: 'Identity & Access Management (IAM)' },
      { name: 'Compliance Support (ISO, GDPR, HIPAA)' },
      { name: 'Security Awareness Training' },
      { name: 'SSO & IAM integration with cloud platforms (e.g., Azure AD, Okta)' },
      { name: 'MFA and VPN integration across business systems' }
    ]
  },
  {
    name: 'IT Consulting & Strategy',
    slug: 'it-consulting-strategy',
    description: 'Strategic planning and digital transformation.',
    imageUrl: 'https://example.com/images/it-consulting.jpg',
    subServices: [
      { name: 'IT Infrastructure Assessments' },
      { name: 'Digital Transformation Roadmaps' },
      { name: 'IT Budgeting & Cost Optimization Plans' },
      { name: 'Business Continuity & Disaster Recovery Planning' },
      { name: 'Cloud and Security Strategy Alignment' },
      { name: 'Technology Vendor Selection Guidance' },
      { name: 'Evaluate integration feasibility across legacy and modern platforms' },
      { name: 'Design interoperability frameworks for CRM, ERP, and business tools' },
      { name: 'Strategic planning for enterprise application modernization' }
    ]
  },
  {
    name: 'Custom Web & Software Development',
    slug: 'custom-web-software-development',
    description: 'Custom solutions tailored to your business.',
    imageUrl: 'https://example.com/images/web-dev.jpg',
    subServices: [
      { name: 'Requirement Gathering & Business Analysis' },
      { name: 'UI/UX Design and Prototyping' },
      { name: 'Frontend and Backend Development' },
      { name: 'API Development & Integration' },
      { name: 'QA Testing and Bug Fixing' },
      { name: 'Deployment & Maintenance' },
      { name: 'Develop RESTful or GraphQL APIs for integration with ERPs, CRMs' },
      { name: 'Integrate 3rd-party services (e.g., Stripe, Twilio, Google Maps)' },
      { name: 'Create microservices to connect various systems and databases' }
    ]
  },
  {
    name: 'Learning & Training',
    slug: 'learning-training',
    description: 'Upskill your team with targeted training.',
    imageUrl: 'https://example.com/images/learning.jpg',
    subServices: [
      { name: 'Corporate IT Training (Cloud, Cybersecurity, DevOps, etc.)' },
      { name: 'User Onboarding for New Systems' },
      { name: 'Certification Preparation (AWS, Azure, CompTIA, etc.)' },
      { name: 'Teaching courses in: MuleSoft, MERN Full Stack, Salesforce, AWS, Power BI, SharePoint' },
      { name: 'Integrate enterprise applications using MuleSoft Anypoint Platform' }
    ]
  }
];

const seed = async () => {
  await Service.deleteMany();
  await Service.insertMany(services);
  console.log('✅ Seed data inserted!');
  mongoose.disconnect();
};

seed();
