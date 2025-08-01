export const managedItServices = {
    name: "Managed IT Services",
    slug: "managed-it-services",
    description:
      "Comprehensive IT support and infrastructure management to ensure operational stability, security, and scalability.",
    moto:
      "Stay focused on your business while we manage, monitor, and optimize your IT environment.",
    imageUrl: "/images/services/managed-it.png",
    icon: "shield-check",
    createdBy: null, // Replace with ObjectId of AdminUser
    subServices: [
      {
        subServiceName: "24/7 Network Monitoring",
        slug: "network-monitoring",
        moto:
          "Always-on monitoring to keep your systems running smoothly and securely.",
        Definition:
          "24/7 network monitoring is the continuous oversight of cloud and on-premise infrastructure to detect issues, track performance, and ensure uninterrupted operations.",
        Commitment:
          "We use real-time monitoring tools and expert support to proactively detect and resolve issues before they affect your business.",
        OrganizationNeed: {
          organizationalDefinition:
            "In a digital world, uninterrupted service and rapid issue detection are mission-critical.",
          Need: [
            {
              title: "Prevent Outages",
              description:
                "Identify and resolve problems before they impact your business.",
            },
            {
              title: "Ensure Compliance",
              description:
                "Meet uptime SLAs and security standards across your infrastructure.",
            },
          ],
        },
        BusinessValue: {
          businessValueDefinition:
            "Proactive monitoring reduces downtime, improves visibility, and enhances user experience.",
          values: [
            {
              title: "Minimized Downtime",
              description:
                "Resolve issues quickly to maintain high availability.",
            },
            {
              title: "Operational Visibility",
              description:
                "Get real-time insight into system health and trends.",
            },
          ],
        },
        CTA: {
          title: "Need reliable uptime?",
          description:
            "Contact us to learn how 24/7 network monitoring supports business continuity.",
        },
      },
      {
        subServiceName: "Help Desk Support",
        slug: "help-desk-support",
        moto:
          "Fast, friendly, and expert IT support when you need it most.",
        Definition:
          "Help Desk Support provides frontline technical assistance to users, handling software issues, system errors, access requests, and IT questions.",
        Commitment:
          "Our responsive support team ensures users stay productive with timely and expert resolution of IT problems.",
        OrganizationNeed: {
          organizationalDefinition:
            "As reliance on technology grows, so does the need for fast and reliable user support.",
          Need: [
            {
              title: "Reduce Downtime",
              description:
                "Minimize interruptions to business with quick issue resolution.",
            },
            {
              title: "Scalable Support",
              description:
                "Adapt to business growth without overwhelming internal IT staff.",
            },
          ],
        },
        BusinessValue: {
          businessValueDefinition:
            "Effective help desk support increases efficiency, satisfaction, and IT governance.",
          values: [
            {
              title: "Increased Productivity",
              description:
                "Keep teams focused on work, not IT troubles.",
            },
            {
              title: "Improved Satisfaction",
              description:
                "Provide responsive, helpful service across departments.",
            },
          ],
        },
        CTA: {
          title: "Support your users 24/7.",
          description:
            "Talk to us about scalable, professional help desk services.",
        },
      },
      {
        subServiceName: "Proactive Maintenance",
        slug: "proactive-maintenance",
        moto:
          "Prevent issues before they disrupt your business.",
        Definition:
          "Proactive maintenance involves regular monitoring, updates, and system health checks to identify and address potential issues early.",
        Commitment:
          "Our team ensures your systems stay healthy through scheduled reviews, patching, and optimization.",
        OrganizationNeed: {
          organizationalDefinition:
            "Waiting for failure leads to costly downtime. Prevention ensures continuity.",
          Need: [
            {
              title: "System Health Monitoring",
              description:
                "Continuously assess performance, patches, and usage trends.",
            },
            {
              title: "Compliance & Security",
              description:
                "Stay current with updates to prevent vulnerabilities.",
            },
          ],
        },
        BusinessValue: {
          businessValueDefinition:
            "Preventative care reduces support costs, improves uptime, and extends system life.",
          values: [
            {
              title: "Lower IT Costs",
              description:
                "Avoid emergency fixes and downtime costs with scheduled maintenance.",
            },
            {
              title: "Higher Reliability",
              description:
                "Keep systems running smoothly and predictably.",
            },
          ],
        },
        CTA: {
          title: "Prevent, don't react.",
          description:
            "Let’s put a proactive IT maintenance plan in place today.",
        },
      },
      {
        subServiceName: "Rapid Response",
        slug: "rapid-response",
        moto:
          "Critical IT incidents resolved fast to protect your business.",
        Definition:
          "Rapid Response is a high-priority support service to quickly resolve system outages, security incidents, or technical emergencies.",
        Commitment:
          "We respond immediately to major incidents—restoring services, mitigating damage, and identifying root causes.",
        OrganizationNeed: {
          organizationalDefinition:
            "Every second counts during IT disruptions—swift resolution protects operations and reputation.",
          Need: [
            {
              title: "Contain Threats Fast",
              description:
                "Act quickly to limit damage from breaches or failures.",
            },
            {
              title: "Minimize Downtime",
              description:
                "Get critical systems back online fast with expert intervention.",
            },
          ],
        },
        BusinessValue: {
          businessValueDefinition:
            "Rapid recovery preserves continuity, customer trust, and business performance.",
          values: [
            {
              title: "Business Continuity",
              description:
                "Restore normal operations with minimal disruption.",
            },
            {
              title: "Expert Intervention",
              description:
                "Access certified engineers for critical events.",
            },
          ],
        },
        CTA: {
          title: "Need urgent help?",
          description:
            "Contact our 24/7 Rapid Response team to handle critical IT issues now.",
        },
      },
    ],
  };
  