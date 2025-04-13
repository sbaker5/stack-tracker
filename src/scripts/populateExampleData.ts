import { 
  addClient, 
  addTechnology 
} from '../firebase/clients';
import { 
  addTechnologyType,
  getAllTechnologyTypes
} from '../firebase/technologyTypes';
import { auth } from '../firebase/config';
import { Client, Technology, TechnologyType } from '../types/models';

/**
 * Populates the database with example technology types, clients, and technologies
 * based on enterprise tech stack categories
 */
export const populateExampleData = async () => {
  if (!auth.currentUser) {
    console.error('User must be logged in to populate example data');
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // First, create technology types based on enterprise tech stack categories
    const techTypes = [
      {
        name: 'Cloud Infrastructure',
        value: 'cloud-infrastructure',
        description: 'IaaS, PaaS, and cloud foundation services',
        icon: 'cloud'
      },
      {
        name: 'Networking',
        value: 'networking',
        description: 'LAN, WAN, SD-WAN, and network security',
        icon: 'language'
      },
      {
        name: 'Storage',
        value: 'storage',
        description: 'Block, file, and object storage solutions',
        icon: 'storage'
      },
      {
        name: 'Security',
        value: 'security',
        description: 'Identity, network, and data security',
        icon: 'security'
      },
      {
        name: 'Databases',
        value: 'databases',
        description: 'Relational and NoSQL databases',
        icon: 'storage'
      },
      {
        name: 'Containers',
        value: 'containers',
        description: 'Container platforms and orchestration',
        icon: 'code'
      },
      {
        name: 'DevOps',
        value: 'devops',
        description: 'CI/CD, IaC, and automation tools',
        icon: 'code'
      },
      {
        name: 'Analytics',
        value: 'analytics',
        description: 'Data warehousing, BI, and ML platforms',
        icon: 'storage'
      },
      {
        name: 'Frontend',
        value: 'frontend',
        description: 'UI frameworks and libraries',
        icon: 'code'
      },
      {
        name: 'Backend',
        value: 'backend',
        description: 'Application servers and APIs',
        icon: 'code'
      }
    ];

    // Check existing tech types to avoid duplicates
    const { techTypes: existingTypes } = await getAllTechnologyTypes();
    const existingValues = existingTypes.map(t => t.value);
    
    // Add new tech types that don't already exist
    for (const type of techTypes) {
      if (!existingValues.includes(type.value)) {
        await addTechnologyType(type);
        console.log(`Added technology type: ${type.name}`);
      }
    }

    // Create example clients
    const clients = [
      {
        name: 'Global Financial Services Inc.',
        industry: 'Financial Services',
        description: 'Multinational financial institution with high-security requirements and complex regulatory compliance needs.',
        tags: ['enterprise', 'finance', 'global'],
        flags: ['VIP', 'Expansion Planned']
      },
      {
        name: 'HealthTech Innovations',
        industry: 'Healthcare',
        description: 'Healthcare technology provider focused on patient data management and clinical workflow solutions.',
        tags: ['healthcare', 'tech', 'startup'],
        flags: ['Follow-Up Needed']
      },
      {
        name: 'Retail Dynamics Corporation',
        industry: 'Retail',
        description: 'Omnichannel retail company with e-commerce platform and physical store locations across North America.',
        tags: ['retail', 'enterprise', 'e-commerce'],
        flags: ['Renewal Due']
      },
      {
        name: 'EduSphere Learning',
        industry: 'Education',
        description: 'Educational technology company providing digital learning platforms for K-12 and higher education.',
        tags: ['education', 'tech', 'startup'],
        flags: []
      },
      {
        name: 'Manufacturing Excellence Ltd.',
        industry: 'Manufacturing',
        description: 'Industrial manufacturing company with smart factory initiatives and IoT implementation.',
        tags: ['manufacturing', 'enterprise', 'industrial'],
        flags: ['At Risk']
      }
    ];

    // Add clients
    const clientIds = [];
    for (const client of clients) {
      const { id, error } = await addClient(client as Omit<Client, 'id'>);
      if (id) {
        clientIds.push({ name: client.name, id });
        console.log(`Added client: ${client.name}`);
      } else {
        console.error(`Error adding client ${client.name}:`, error);
      }
    }

    // Define technologies for each client
    const clientTechnologies = [
      // Global Financial Services Inc.
      {
        clientName: 'Global Financial Services Inc.',
        technologies: [
          {
            name: 'AWS Financial Services Cloud',
            type: 'cloud-infrastructure',
            description: 'Secure cloud infrastructure for financial services'
          },
          {
            name: 'Palo Alto Networks NGFW',
            type: 'security',
            description: 'Next-generation firewall for network security'
          },
          {
            name: 'Oracle Database Enterprise',
            type: 'databases',
            description: 'Mission-critical database for financial transactions'
          },
          {
            name: 'F5 BIG-IP',
            type: 'networking',
            description: 'Application delivery and load balancing'
          },
          {
            name: 'Splunk Enterprise Security',
            type: 'security',
            description: 'SIEM solution for security monitoring'
          },
          {
            name: 'Pure Storage FlashArray',
            type: 'storage',
            description: 'All-flash storage for high-performance applications'
          },
          {
            name: 'Red Hat OpenShift',
            type: 'containers',
            description: 'Enterprise Kubernetes platform'
          }
        ]
      },
      // HealthTech Innovations
      {
        clientName: 'HealthTech Innovations',
        technologies: [
          {
            name: 'Microsoft Azure',
            type: 'cloud-infrastructure',
            description: 'Cloud platform with HIPAA compliance'
          },
          {
            name: 'MongoDB Atlas',
            type: 'databases',
            description: 'Managed NoSQL database for patient data'
          },
          {
            name: 'React',
            type: 'frontend',
            description: 'Frontend framework for clinical applications'
          },
          {
            name: 'Node.js',
            type: 'backend',
            description: 'Backend runtime for APIs'
          },
          {
            name: 'Okta',
            type: 'security',
            description: 'Identity and access management'
          },
          {
            name: 'Datadog',
            type: 'devops',
            description: 'Monitoring and observability platform'
          }
        ]
      },
      // Retail Dynamics Corporation
      {
        clientName: 'Retail Dynamics Corporation',
        technologies: [
          {
            name: 'Google Cloud Platform',
            type: 'cloud-infrastructure',
            description: 'Cloud infrastructure for e-commerce platform'
          },
          {
            name: 'Snowflake',
            type: 'analytics',
            description: 'Data warehouse for retail analytics'
          },
          {
            name: 'Kubernetes',
            type: 'containers',
            description: 'Container orchestration for microservices'
          },
          {
            name: 'Elasticsearch',
            type: 'databases',
            description: 'Search engine for product catalog'
          },
          {
            name: 'Tableau',
            type: 'analytics',
            description: 'Business intelligence and visualization'
          },
          {
            name: 'Kafka',
            type: 'backend',
            description: 'Event streaming for real-time inventory'
          },
          {
            name: 'Akamai CDN',
            type: 'networking',
            description: 'Content delivery network for global reach'
          }
        ]
      },
      // EduSphere Learning
      {
        clientName: 'EduSphere Learning',
        technologies: [
          {
            name: 'AWS Amplify',
            type: 'frontend',
            description: 'Full-stack development framework'
          },
          {
            name: 'PostgreSQL',
            type: 'databases',
            description: 'Relational database for learning management'
          },
          {
            name: 'Vue.js',
            type: 'frontend',
            description: 'Progressive framework for user interfaces'
          },
          {
            name: 'GitHub Actions',
            type: 'devops',
            description: 'CI/CD for automated deployments'
          },
          {
            name: 'AWS S3',
            type: 'storage',
            description: 'Object storage for educational content'
          }
        ]
      },
      // Manufacturing Excellence Ltd.
      {
        clientName: 'Manufacturing Excellence Ltd.',
        technologies: [
          {
            name: 'Azure IoT Hub',
            type: 'cloud-infrastructure',
            description: 'IoT platform for factory devices'
          },
          {
            name: 'Cisco Meraki',
            type: 'networking',
            description: 'Cloud-managed network infrastructure'
          },
          {
            name: 'Microsoft Power BI',
            type: 'analytics',
            description: 'Business intelligence for manufacturing metrics'
          },
          {
            name: 'VMware vSphere',
            type: 'cloud-infrastructure',
            description: 'Virtualization platform for on-premises workloads'
          },
          {
            name: 'Fortinet Security Fabric',
            type: 'security',
            description: 'Integrated security architecture'
          },
          {
            name: 'SAP HANA',
            type: 'databases',
            description: 'In-memory database for ERP'
          },
          {
            name: 'Ansible Automation Platform',
            type: 'devops',
            description: 'IT automation for infrastructure management'
          }
        ]
      }
    ];

    // Add technologies for each client
    for (const clientTech of clientTechnologies) {
      const client = clientIds.find(c => c.name === clientTech.clientName);
      if (client) {
        for (const tech of clientTech.technologies) {
          const { id, error } = await addTechnology(client.id, tech as Omit<Technology, 'id'>);
          if (id) {
            console.log(`Added technology ${tech.name} to ${clientTech.clientName}`);
          } else {
            console.error(`Error adding technology ${tech.name}:`, error);
          }
        }
      }
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error populating example data:', error);
    return { success: false, error };
  }
};

export default populateExampleData;
