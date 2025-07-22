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
    subService: [
      {
        title: "24/7 IT Infrastructure Monitoring & Support",
        description: "We monitor and support your IT infrastructure around the clock to ensure maximum uptime.",
        heading: "Infrastructure Monitoring",
        image: "https://example.com/images/monitoring.jpg"
      },
      {
        title: "Help Desk & Remote Troubleshooting",
        description: "Our help desk provides fast remote troubleshooting for all your IT issues.",
        heading: "Help Desk",
        image: "https://example.com/images/helpdesk.jpg"
      },
      {
        title: "Patch Management & System Updates",
        description: "We keep your systems secure and up-to-date with regular patch management.",
        heading: "Patch Management",
        image: "https://example.com/images/patch.jpg"
      },
      {
        title: "Backup & Disaster Recovery Planning",
        description: "We ensure your data is safe and recoverable in case of a disaster.",
        heading: "Disaster Recovery",
        image: "https://example.com/images/backup.jpg"
      },
      {
        title: "Performance Optimization & Reporting",
        description: "We analyze and optimize your systems to ensure peak performance.",
        heading: "Performance Optimization",
        image: "https://example.com/images/performance.jpg"
      },
      {
        title: "Endpoint Management (PCs, servers, mobile)",
        description: "We manage and secure all your endpoints, from desktops to mobile devices.",
        heading: "Endpoint Management",
        image: "https://example.com/images/endpoint.jpg"
      },
      {
        title: "Vendor Management (ISP, software providers)",
        description: "We negotiate and manage contracts with your technology vendors.",
        heading: "Vendor Management",
        image: "https://example.com/images/vendor.jpg"
      }
    ]
  },
  {
    name: 'Cloud Computing & Migration (AWS, Azure)',
    slug: 'cloud-computing-migration',
    description: 'Migration and management of cloud infrastructure.',
    imageUrl: 'https://example.com/images/cloud-computing.jpg',
    subService: [
      {
        title: "Cloud Readiness Assessment",
        description: "We assess your current IT environment to determine readiness for cloud adoption.",
        heading: "Cloud Readiness",
        image: "https://example.com/images/cloud-readiness.jpg"
      },
      {
        title: "Design and Deployment of Scalable Cloud Architecture",
        description: "We design and implement a scalable, cost-effective cloud infrastructure.",
        heading: "Cloud Architecture",
        image: "https://example.com/images/cloud-architecture.jpg"
      },
      {
        title: "Server, Database & App Migration",
        description: "We migrate your applications, databases, and servers to the cloud.",
        heading: "Cloud Migration",
        image: "https://example.com/images/cloud-migration.jpg"
      },
      {
        title: "Cost Optimization & Auto-scaling Setup",
        description: "We optimize your cloud costs and set up auto-scaling for your applications.",
        heading: "Cost Optimization",
        image: "https://example.com/images/cost-optimization.jpg"
      },
      {
        title: "Multi-cloud and Hybrid Cloud Setup",
        description: "We design and implement a multi-cloud or hybrid cloud strategy.",
        heading: "Multi-cloud Strategy",
        image: "https://example.com/images/multi-cloud.jpg"
      },
      {
        title: "Ongoing Cloud Infrastructure Management",
        description: "We manage and maintain your cloud infrastructure to ensure reliability and security.",
        heading: "Cloud Management",
        image: "https://example.com/images/cloud-management.jpg"
      },
      {
        title: "Connect on-premise systems with cloud services using VPN, Direct Connect, or ExpressRoute",
        description: "We establish secure, high-performance connections between your on-premise and cloud environments.",
        heading: "Cloud Connectivity",
        image: "https://example.com/images/cloud-connectivity.jpg"
      },
      {
        title: "Integrate SaaS platforms (e.g., Salesforce, Office 365) with cloud-native applications",
        description: "We help you integrate your existing SaaS applications with new cloud-native applications.",
        heading: "SaaS Integration",
        image: "https://example.com/images/saas-integration.jpg"
      },
      {
        title: "Setup of CI/CD pipelines for cloud-hosted applications",
        description: "We set up continuous integration and continuous delivery pipelines for your cloud applications.",
        heading: "CI/CD Pipeline",
        image: "https://example.com/images/ci-cd.jpg"
      }
    ]
  },
  {
    name: 'Cybersecurity & Risk Management',
    slug: 'cybersecurity-risk-management',
    description: 'Security and compliance for your business.',
    imageUrl: 'https://example.com/images/cybersecurity.jpg',
    subService: [
      {
        title: "Risk Assessments & Security Audits",
        description: "We conduct comprehensive security assessments and audits to identify vulnerabilities.",
        heading: "Security Audits",
        image: "https://example.com/images/security-audits.jpg"
      },
      {
        title: "Firewall and Intrusion Detection/Prevention Setup",
        description: "We design and implement robust firewall and intrusion prevention systems.",
        heading: "Firewall & IDS/IPS",
        image: "https://example.com/images/firewall.jpg"
      },
      {
        title: "Endpoint Protection and Anti-malware Solutions",
        description: "We provide comprehensive endpoint protection and anti-malware solutions.",
        heading: "Endpoint Protection",
        image: "https://example.com/images/endpoint-protection.jpg"
      },
      {
        title: "Identity & Access Management (IAM)",
        description: "We manage and secure access to your systems and applications.",
        heading: "IAM",
        image: "https://example.com/images/iam.jpg"
      },
      {
        title: "Compliance Support (ISO, GDPR, HIPAA)",
        description: "We ensure your systems and data are compliant with industry standards.",
        heading: "Compliance",
        image: "https://example.com/images/compliance.jpg"
      },
      {
        title: "Security Awareness Training",
        description: "We educate your team on security best practices and incident response.",
        heading: "Security Training",
        image: "https://example.com/images/security-training.jpg"
      },
      {
        title: "SSO & IAM integration with cloud platforms (e.g., Azure AD, Okta)",
        description: "We integrate single sign-on and identity management across your cloud and on-premise systems.",
        heading: "SSO & IAM",
        image: "https://example.com/images/sso-iam.jpg"
      },
      {
        title: "MFA and VPN integration across business systems",
        description: "We implement multi-factor authentication and secure VPN access for all your systems.",
        heading: "MFA & VPN",
        image: "https://example.com/images/mfa-vpn.jpg"
      }
    ]
  },
  {
    name: 'IT Consulting & Strategy',
    slug: 'it-consulting-strategy',
    description: 'Strategic planning and digital transformation.',
    imageUrl: 'https://example.com/images/it-consulting.jpg',
    subService: [
      {
        title: "IT Infrastructure Assessments",
        description: "We evaluate your current IT infrastructure to identify areas for improvement.",
        heading: "Infrastructure Assessment",
        image: "https://example.com/images/infrastructure-assessment.jpg"
      },
      {
        title: "Digital Transformation Roadmaps",
        description: "We develop detailed roadmaps for your digital transformation initiatives.",
        heading: "Digital Roadmap",
        image: "https://example.com/images/digital-roadmap.jpg"
      },
      {
        title: "IT Budgeting & Cost Optimization Plans",
        description: "We create detailed budgets and cost optimization strategies for your IT investments.",
        heading: "IT Budgeting",
        image: "https://example.com/images/it-budgeting.jpg"
      },
      {
        title: "Business Continuity & Disaster Recovery Planning",
        description: "We develop comprehensive plans for business continuity and disaster recovery.",
        heading: "BCDR Planning",
        image: "https://example.com/images/bcdr.jpg"
      },
      {
        title: "Cloud and Security Strategy Alignment",
        description: "We ensure your cloud and security strategies are aligned and effective.",
        heading: "Strategy Alignment",
        image: "https://example.com/images/strategy-alignment.jpg"
      },
      {
        title: "Technology Vendor Selection Guidance",
        description: "We help you select the right technology vendors for your specific needs.",
        heading: "Vendor Selection",
        image: "https://example.com/images/vendor-selection.jpg"
      },
      {
        title: "Evaluate integration feasibility across legacy and modern platforms",
        description: "We assess the technical feasibility of integrating legacy systems with modern technologies.",
        heading: "Integration Feasibility",
        image: "https://example.com/images/integration-feasibility.jpg"
      },
      {
        title: "Design interoperability frameworks for CRM, ERP, and business tools",
        description: "We design frameworks to ensure seamless integration between your business tools and applications.",
        heading: "Interoperability",
        image: "https://example.com/images/interoperability.jpg"
      },
      {
        title: "Strategic planning for enterprise application modernization",
        description: "We develop strategies for modernizing and optimizing your enterprise applications.",
        heading: "Application Modernization",
        image: "https://example.com/images/application-modernization.jpg"
      }
    ]
  },
  {
    name: 'Custom Web & Software Development',
    slug: 'custom-web-software-development',
    description: 'Custom solutions tailored to your business.',
    imageUrl: 'https://example.com/images/web-dev.jpg',
    subService: [
      {
        title: "Requirement Gathering & Business Analysis",
        description: "We gather requirements and analyze your business needs to develop the right solution.",
        heading: "Requirement Gathering",
        image: "https://example.com/images/requirement-gathering.jpg"
      },
      {
        title: "UI/UX Design and Prototyping",
        description: "We design intuitive and user-friendly interfaces and create prototypes.",
        heading: "UI/UX Design",
        image: "https://example.com/images/ui-ux.jpg"
      },
      {
        title: "Frontend and Backend Development",
        description: "We develop the front-end (UI) and back-end (server-side) of your application.",
        heading: "Development",
        image: "https://example.com/images/development.jpg"
      },
      {
        title: "API Development & Integration",
        description: "We design, develop, and integrate APIs for seamless communication between systems.",
        heading: "API Development",
        image: "https://example.com/images/api-development.jpg"
      },
      {
        title: "QA Testing and Bug Fixing",
        description: "We perform thorough testing and fix any bugs or issues in your application.",
        heading: "QA & Bug Fixing",
        image: "https://example.com/images/qa.jpg"
      },
      {
        title: "Deployment & Maintenance",
        description: "We deploy your application and provide ongoing maintenance and support.",
        heading: "Deployment & Maintenance",
        image: "https://example.com/images/deployment.jpg"
      },
      {
        title: "Develop RESTful or GraphQL APIs for integration with ERPs, CRMs",
        description: "We create APIs that integrate with your enterprise resource planning (ERP) and customer relationship management (CRM) systems.",
        heading: "API Integration",
        image: "https://example.com/images/api-integration.jpg"
      },
      {
        title: "Integrate 3rd-party services (e.g., Stripe, Twilio, Google Maps)",
        description: "We integrate third-party services (payment processing, communication, mapping) into your application.",
        heading: "3rd-party Integration",
        image: "https://example.com/images/3rd-party-integration.jpg"
      },
      {
        title: "Create microservices to connect various systems and databases",
        description: "We design and implement a microservices architecture to connect different systems and databases.",
        heading: "Microservices",
        image: "https://example.com/images/microservices.jpg"
      }
    ]
  },
  {
    name: 'Learning & Training',
    slug: 'learning-training',
    description: 'Upskill your team with targeted training.',
    imageUrl: 'https://example.com/images/learning.jpg',
    subService: [
      {
        title: "Corporate IT Training (Cloud, Cybersecurity, DevOps, etc.)",
        description: "We provide comprehensive training programs for your IT professionals.",
        heading: "Corporate Training",
        image: "https://example.com/images/corporate-training.jpg"
      },
      {
        title: "User Onboarding for New Systems",
        description: "We ensure your team is proficient with new systems and technologies.",
        heading: "User Onboarding",
        image: "https://example.com/images/user-onboarding.jpg"
      },
      {
        title: "Certification Preparation (AWS, Azure, CompTIA, etc.)",
        description: "We prepare your team for industry certifications.",
        heading: "Certification Preparation",
        image: "https://example.com/images/certification.jpg"
      },
      {
        title: "Teaching courses in: MuleSoft, MERN Full Stack, Salesforce, AWS, Power BI, SharePoint",
        description: "We offer various courses to help your team develop specific skills.",
        heading: "Training Courses",
        image: "https://example.com/images/training-courses.jpg"
      },
      {
        title: "Integrate enterprise applications using MuleSoft Anypoint Platform",
        description: "We help you integrate your enterprise applications using the MuleSoft Anypoint Platform.",
        heading: "MuleSoft Integration",
        image: "https://example.com/images/mule-integration.jpg"
      }
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
