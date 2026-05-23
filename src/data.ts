import { Opportunity, SchemaTable, ApiEndpoint } from './types';

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Junior Web Developer Apprenticeship',
    type: 'job',
    category: 'jobs',
    provider: 'ALX Africa & Root Hub',
    location: 'Lagos, Nigeria (Hybrid)',
    summary: '6-month intensive technical cohort with direct pathway to placement.',
    detail: 'This program covers full-stack JavaScript, mobile layouts, and modern database connections.',
    valueBadge: 'Fully Funded',
    linkText: 'Apply via ALX Portal',
    linkUrl: 'https://alxafrica.com',
    isSaved: false,
    isVerified: true,
    verificationReason: 'Verified by ALX Partnerships Admin',
    scamRiskScore: 'low',
    scamAnalysisText: 'Secure corporate domain. No recruitment fees required.',
    humanReviewedBy: 'Omotola Williams, Learning Pathways Officer'
  },
  {
    id: 'opp-2',
    title: 'Women in Tech Scholarship',
    type: 'scholarship',
    category: 'learning',
    provider: 'SheCodeAfrica Foundation',
    location: 'Nairobi, Kenya',
    summary: 'Tuition-free cloud computing and cybersecurity bootcamps for women.',
    detail: 'Includes laptops, data allowance, and professional mentorship.',
    valueBadge: 'Full Scholarship + Laptop',
    linkText: 'Register on SCA platform',
    linkUrl: 'https://shecodeafrica.org',
    isSaved: true,
    isVerified: true,
    verificationReason: 'Verified by SheCodeAfrica Official Org',
    scamRiskScore: 'low',
    scamAnalysisText: 'No up-front costs. Registered NGO status confirmed.',
    humanReviewedBy: 'Sarah Nakala, Community Engagement Lead'
  },
  {
    id: 'opp-3',
    title: 'Cassava Blight Prevention Guide',
    type: 'crop_advice',
    category: 'farming',
    provider: 'IITA (International Institute of Tropical Agriculture)',
    location: 'Ibadan, Nigeria',
    summary: 'How to identify and cure brown streak disease in cassava tubers.',
    detail: 'Use certified disease-resistant stems (TMS 98/0505). Ensure early weed clearance.',
    valueBadge: 'Expert Agronomist Advice',
    linkText: 'Download Crop Guide',
    linkUrl: 'https://iita.org',
    isSaved: false,
    isVerified: true,
    verificationReason: 'Verified by IITA Open Access Research Center',
    scamRiskScore: 'low',
    scamAnalysisText: 'Published by a global non-profit agricultural institute.',
    humanReviewedBy: 'Dr. Jean-Pierre Diouf, Chief Agronomist'
  }
];

export const SUGGESTED_PROMPTS = [
  {
    label: "🌾 Crop Disease help",
    text: "My cassava leaves have yellow spots and are curling. What is this and how do I prevent further crop damage?",
    category: "farming"
  },
  {
    label: "💰 Grants for small shop",
    text: "Can you recommend free business grants or startup funding for a tailoring shop in our local community?",
    category: "business"
  },
  {
    label: "📁 Skill recommendations",
    text: "I finished high school but have no computer skills. What are the best skills to learn in Africa to get a job fast?",
    category: "learning"
  },
  {
    label: "🏥 Nearest hospitals/services",
    text: "Show me emergency medical services, local clinics or community support programs in rural areas.",
    category: "services"
  }
];

export const ROOTAI_SCHEMA: SchemaTable[] = [
  {
    name: 'users',
    description: 'Holds core profile state, demographics, interests, and language preferences.',
    columns: [
      { name: 'id', type: 'uuid', constraints: 'PRIMARY KEY', description: 'Unique identifier for the user.' },
      { name: 'name', type: 'varchar(100)', constraints: 'NOT NULL', description: 'Full name or alias of the user.' },
      { name: 'role', type: 'varchar(50)', description: 'Primary occupation' },
      { name: 'location', type: 'varchar(150)', description: 'City/County & Country' },
      { name: 'language', type: 'varchar(10)', constraints: 'DEFAULT \'en\'', description: 'ISO code of preferred language' },
      { name: 'interests', type: 'text[]', description: 'Broad tags describing interests' }
    ]
  },
  {
    name: 'opportunities',
    description: 'Job slots, scholarships, grants, and agronomist posts.',
    columns: [
      { name: 'id', type: 'uuid', constraints: 'PRIMARY KEY', description: 'Unique opportunity index.' },
      { name: 'title', type: 'varchar(200)', constraints: 'NOT NULL', description: 'Name of the opportunity.' },
      { name: 'type', type: 'varchar(50)', description: 'scholarship, grant, job, training, etc.' },
      { name: 'category', type: 'varchar(50)', description: 'jobs, farming, business, learning, services.' },
      { name: 'provider', type: 'varchar(150)', description: 'Organization offering the opportunity.' },
      { name: 'location', type: 'varchar(200)', description: 'Geographical coverage.' },
      { name: 'summary', type: 'text', description: 'Brief description suitable for SMS.' }
    ]
  }
];

export const ROOTAI_API_ENDPOINTS: ApiEndpoint[] = [
  {
    name: 'WhatsApp Webhook Listener',
    method: 'POST',
    path: '/api/webhooks/whatsapp',
    description: 'Invoked by Meta/WhatsApp Business Cloud API when a user sends a WhatsApp message.',
    requestExample: `{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "23324000000",
          "text": { "body": "Need farming advice" }
        }]
      }
    }]
  }]
}`,
    responseExample: `{
  "status": "ok",
  "message_id": "wamid_12345"
}`
  },
  {
    name: 'SMS Gateway Link',
    method: 'POST',
    path: '/api/webhooks/sms',
    description: 'Receives regular mobile network SMS messages.',
    requestExample: `{
  "from": "+254712345678",
  "to": "20880",
  "text": "RootAI lookup jobs"
}`,
    responseExample: `{
  "status": "sent",
  "sms": "RootAI: Found 2 job matches"
}`
  }
];
