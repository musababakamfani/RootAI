import { Opportunity, SchemaTable, ApiEndpoint } from './types';

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  // Jobs and Opportunities
  {
    id: 'opp-1',
    title: 'Junior Web Developer Apprenticeship',
    type: 'training',
    category: 'jobs',
    provider: 'ALX Africa & Root Hub',
    location: 'Lagos, Nigeria (Hybrid)',
    summary: '6-month intensive technical cohort with direct pathway to placement.',
    detail: 'This program covers full-stack JavaScript, mobile layouts, and modern database connections. High-performer graduates are matched with startup partners.',
    valueBadge: 'Fully Funded',
    linkText: 'Apply via ALX Portal',
    linkUrl: 'https://alxafrica.com',
    isSaved: false,
    isVerified: true,
    verificationReason: 'Verified by ALX Partnerships Admin with partner agreement #ALX-2026-98',
    scamRiskScore: 'low',
    scamAnalysisText: 'Secure corporate domain. No recruitment fees or registration charges required to apply.',
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
    detail: 'Includes laptops, data allowance, and professional mentorship. Ideal for absolute beginners aiming for local tech opportunities.',
    valueBadge: 'Full Scholarship + Laptop',
    linkText: 'Register on SCA platform',
    linkUrl: 'https://shecodeafrica.org',
    isSaved: true,
    isVerified: true,
    verificationReason: 'Verified by SheCodeAfrica Official Org with direct registration API match.',
    scamRiskScore: 'low',
    scamAnalysisText: 'No up-front costs. Registered NGO status confirmed with Kenyan NGO Board registration #SCA-992.',
    humanReviewedBy: 'Sarah Nakala, Community Engagement Lead'
  },
  {
    id: 'opp-3',
    title: 'Agro-Processor Equipment Grant',
    type: 'grant',
    category: 'business',
    provider: 'Tony Elumelu Foundation',
    location: 'Accra, Ghana (Local Business Registry Required)',
    summary: 'Capital grants for small agri-business machinery additions.',
    detail: 'Applicants must operate a registered agro-processing enterprise. Funds can cover up to 85% of cold storage or milling machine purchases.',
    valueBadge: '$5,000 Micro-Grant',
    linkText: 'TEF Connect Apply',
    linkUrl: 'https://tefconnect.net',
    isSaved: false,
    isVerified: true,
    verificationReason: 'Verified via TEF Annual Grant Registry matching the active 2026 application cycle.',
    scamRiskScore: 'low',
    scamAnalysisText: 'Submissions are hosted exclusively on secure enterprise portal tefconnect.net. Applications are 100% free; beware of copycat domains.',
    humanReviewedBy: 'Amara Mensah, Regional Grant Consultant'
  },

  // Farming Support
  {
    id: 'opp-4',
    title: 'Cassava Blight Prevention Guide',
    type: 'crop_advice',
    category: 'farming',
    provider: 'IITA (International Institute of Tropical Agriculture)',
    location: 'Ibadan, Nigeria',
    summary: 'How to identify and cure brown streak disease in cassava tubers.',
    detail: 'Use certified disease-resistant stems (TMS 98/0505). Ensure early weed clearance and clear visual signs of mosaic or brown streak before deploying chemical intervention.',
    valueBadge: 'Expert Agronomist Advice',
    linkText: 'Download Crop Guide',
    linkUrl: 'https://iita.org',
    isSaved: false,
    isVerified: true,
    verificationReason: 'Verified by IITA Open Access Research Center & Agronomy Advisory panel.',
    scamRiskScore: 'low',
    scamAnalysisText: 'Published by a global non-profit agricultural institute. Free educational resources only.',
    humanReviewedBy: 'Dr. Jean-Pierre Diouf, Chief Agronomist'
  },
  {
    id: 'opp-5',
    title: 'Solar Irrigation Co-op Buying',
    type: 'grant',
    category: 'farming',
    provider: 'Kenya Ministry of Agriculture & SunCulture',
    location: 'Machakos, Kenya',
    summary: 'Subsidized solar pump kit with smart payment flow and soil testing.',
    detail: 'Pay-As-You-Go solar pump setups for low-income smallholders. Reduces labor by substituting diesel generator operations with 12V DC solar pumps.',
    valueBadge: '60% Fuel Subsidy Saved',
    linkText: 'View Distributor Stations',
    linkUrl: 'https://sunculture.com',
    isSaved: false,
    isVerified: true,
    verificationReason: 'Verified against the Kenyan National Agricultural Subsidy Register (NASR-2026).',
    scamRiskScore: 'low',
    scamAnalysisText: 'Direct authorized distribution centers checked. No middlemen handling payment.',
    humanReviewedBy: 'Benjamin Kioko, Machakos Extension Officer'
  },

  // Business Support
  {
    id: 'opp-6',
    title: 'Solar Kiosk Starter Kit',
    type: 'business_plan',
    category: 'business',
    provider: 'RootAI Business Incubator',
    location: 'Johannesburg, South Africa',
    summary: 'Interactive pricing template & setup calculator for charging stations.',
    detail: 'Learn how to establish a low-cost mobile phone charging booth powered by a single 150W solar panel. Includes high-margin power bank rental formulas.',
    valueBadge: 'Step-by-Step Toolkits',
    linkText: 'View Calculator Form',
    isSaved: false,
    isVerified: true,
    verificationReason: 'In-house certified calculator reviewed by RootAI financial modellers.',
    scamRiskScore: 'low',
    scamAnalysisText: 'Internal resources from RootAI. Fully open source and mathematical models only.',
    humanReviewedBy: 'Thabo Ndlovu, Small Business Advisor'
  },

  // Learning and Skills
  {
    id: 'opp-7',
    title: 'Practical Bookkeeping & Taxes for Artisans',
    type: 'training',
    category: 'learning',
    provider: 'Sedo Business Hub',
    location: 'Kampala, Uganda',
    summary: 'WhatsApp-based nightly course on cashflow tracking and mobile money.',
    detail: 'Perfect for carpenters, mechanics, and tailors. Get basic spreadsheet checklists and templates customized for mobile money transactions.',
    valueBadge: 'Free Mobile Training',
    linkText: 'Join WhatsApp Group',
    isSaved: false,
    isVerified: true,
    verificationReason: 'Sedo Business Hub coordinator certificate confirmed with local council training permit.',
    scamRiskScore: 'low',
    scamAnalysisText: 'Uses official registered Sedo company phone numbers. Full course schedule verified.',
    humanReviewedBy: 'Florence Namubiru, Local Council 3 Education rep'
  },

  // Community Services
  {
    id: 'opp-8',
    title: 'Machakos Maternal Health Clinic',
    type: 'clinic',
    category: 'services',
    provider: 'Red Cross & Machakos Health Dept',
    location: 'Machakos, Kenya',
    summary: 'Free wellness checkups, pre-natal vitamins, and counseling.',
    detail: 'No-cost clinic offering immunization, safe delivery counseling, and peer groups. Walk-in slots every Thursday from 08:00 to 14:00.',
    valueBadge: 'No Cost / Public Healthcare',
    isSaved: false,
    isVerified: true,
    verificationReason: 'Verified with Machakos Health Department Public Clinics registry.',
    scamRiskScore: 'low',
    scamAnalysisText: 'Official Red Cross facility. Zero fee requirements guaranteed. Open community healthcare standard.',
    humanReviewedBy: 'Dr. Jane Mwangi, County Medical Director'
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
      { name: 'id', type: 'uuid', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'Unique identifier for the user.' },
      { name: 'name', type: 'varchar(100)', constraints: 'NOT NULL', description: 'Full name or alias of the user.' },
      { name: 'role', type: 'varchar(50)', description: 'Primary occupation (e.g. farmer, entrepreneur, student).' },
      { name: 'location', type: 'varchar(150)', description: 'City/County & Country for geographical matching.' },
      { name: 'language', type: 'varchar(10)', constraints: 'DEFAULT \'en\'', description: 'ISO code of preferred language (e.g., en, sw, fr, ha).' },
      { name: 'interests', type: 'text[]', description: 'Broad tags describing what they want opportunities for.' },
      { name: 'phone_number', type: 'varchar(20)', constraints: 'UNIQUE', description: 'For SMS and WhatsApp gateway routing mapping.' },
      { name: 'created_at', type: 'timestamp', constraints: 'DEFAULT NOW()', description: 'Account creation date.' }
    ]
  },
  {
    name: 'opportunities',
    description: 'Job slots, scholarships, grants, and direct agronomist/pricing reference posts.',
    columns: [
      { name: 'id', type: 'uuid', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'Unique opportunity index.' },
      { name: 'title', type: 'varchar(200)', constraints: 'NOT NULL', description: 'Name of the job, grant, or guide.' },
      { name: 'type', type: 'varchar(50)', description: 'scholarship, grant, job, training, clinic, crop_advice, etc.' },
      { name: 'category', type: 'varchar(50)', description: 'jobs, farming, business, learning, services.' },
      { name: 'provider', type: 'varchar(150)', description: 'Organization offering the opportunity.' },
      { name: 'location', type: 'varchar(200)', description: 'Geographical coverage (e.g. Nairobi, Remote).' },
      { name: 'summary', type: 'text', description: 'Brief description suitable for SMS messaging.' },
      { name: 'detail', type: 'text', description: 'Full breakdown for mobile web viewing.' },
      { name: 'link_url', type: 'text', description: 'Direct external link if matching is successful.' },
      { name: 'value_badge', type: 'varchar(100)', description: 'High-visibility money/resource metrics.' },
      { name: 'created_at', type: 'timestamp', constraints: 'DEFAULT NOW()', description: 'Post date.' }
    ]
  },
  {
    name: 'saved_opportunities',
    description: 'Tracks bookmarked scholarships or programs per user.',
    columns: [
      { name: 'user_id', type: 'uuid', constraints: 'REFERENCES users(id) ON DELETE CASCADE', description: 'Target user.' },
      { name: 'opportunity_id', type: 'uuid', constraints: 'REFERENCES opportunities(id) ON DELETE CASCADE', description: 'Saved opportunity.' },
      { name: 'saved_at', type: 'timestamp', constraints: 'DEFAULT NOW()', description: 'Bookmarking time.' }
    ]
  },
  {
    name: 'chats',
    description: 'Persists user conversations for offline recall and SMS session thread resumption.',
    columns: [
      { name: 'id', type: 'uuid', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'Unique message index.' },
      { name: 'user_id', type: 'uuid', constraints: 'REFERENCES users(id) ON DELETE CASCADE', description: 'Owner user.' },
      { name: 'sender', type: 'varchar(20)', constraints: 'CHECK(sender IN (\'user\', \'assistant\'))', description: 'Who sent the text.' },
      { name: 'message', type: 'text', constraints: 'NOT NULL', description: 'Actual written contents.' },
      { name: 'grounding_metadata', type: 'jsonb', description: 'Stores search URLs returned from Gemini Search.' },
      { name: 'created_at', type: 'timestamp', constraints: 'DEFAULT NOW()', description: 'Message timestamp.' }
    ]
  }
];

export const ROOTAI_API_ENDPOINTS: ApiEndpoint[] = [
  {
    name: 'WhatsApp Webhook Listener',
    method: 'POST',
    path: '/api/webhooks/whatsapp',
    description: 'Invoked by Meta/WhatsApp Business Cloud API when a user sends a WhatsApp message. Routes message to Gemini, formats plain helpful text, and triggers low-bandwidth replies.',
    requestExample: `{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "1009384755102",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": { "display_phone_number": "1234567890", "phone_number_id": "987654321" },
            "contacts": [{ "profile": { "name": "Kwame Mensah" }, "wa_id": "23324000000" }],
            "messages": [
              {
                "from": "23324000000",
                "id": "wamid.HBgLMjMzMjQwMDAwMDAVAgARGBI1QTAzNzM4REFBQ0U0MkNFOUQA",
                "timestamp": "1716382022",
                "text": { "body": "Need farming advice: how to fight brown rust on maize?" },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}`,
    responseExample: `{
  "status": "delivered_to_whatsapp",
  "recipient": "23324000000",
  "textResponse": "Hello Kwame, here is structural guidance for maize rust... 🌽 Apply copper fungicides..."
}`
  },
  {
    name: 'SMS Gateway Link (USSD / Shortcode)',
    method: 'POST',
    path: '/api/webhooks/sms',
    description: 'Receives regular mobile network SMS messages pushed by Africa\'s Talking or Twilio gateways. Converts the query to a compact plain-text response capped under 160 characters or splits seamlessly.',
    requestExample: `{
  "from": "+254712345678",
  "to": "20880",
  "text": "RootAI lookup jobs in Kisumu",
  "date": "2026-05-22T16:00:10Z",
  "id": "Sms_Event_93817AB"
}`,
    responseExample: `{
  "smsResponse": "RootAI Direct: Found 2 matches in Kisumu: (1) Agrisolar Agent (2) Poultry Supervisor. Chat on WhatsApp for contact detals!"
}`
  },
  {
    name: 'n8n Automation Lead Sync',
    method: 'POST',
    path: '/api/n8n/trigger',
    description: 'Triggers automated service workflows, synchronizing matching artisan listings or alerting community volunteers when emergency needs arise.',
    requestExample: `{
  "event": "artisan_request_alert",
  "requesterPhone": "+27821110002",
  "serviceNeeded": "Pipes Leak / Plumber",
  "location": "Soweto, SA",
  "geminiRecommendationId": "opp-8"
}`,
    responseExample: `{
  "workflow_active": true,
  "n8n_execution_id": "8293819-2A",
  "notified_artisans_count": 3
}`
  }
];
