export interface GroundingChunk {
  title: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: string;
  groundingChunks?: GroundingChunk[];
  confidenceScore?: number; // e.g., 95 for 95%
  confidenceExplanation?: string; // explanation of how confidence score was computed
  isHumanReviewed?: boolean; // Human reviewed badge for sensitive topics
  humanReviewReason?: string; // Reason / editor info
}

export interface UserProfile {
  name: string;
  role: 'student' | 'job_seeker' | 'farmer' | 'small_business_owner' | 'artisan' | 'parent' | 'entrepreneur' | 'other';
  location: string;
  language: string;
  interests: string[];
  walletAddress?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type: 'job' | 'scholarship' | 'grant' | 'training' | 'crop_advice' | 'business_plan' | 'clinic';
  category: 'jobs' | 'business' | 'farming' | 'services' | 'learning';
  provider: string;
  location: string;
  summary: string;
  detail: string;
  linkText?: string;
  linkUrl?: string;
  isSaved?: boolean;
  valueBadge?: string; // e.g. "$5,000 Grant", "Free Crop Checkup", "Paid Internship"
  isVerified?: boolean; // Verified jobs/grants/scholarships only toggles
  verificationReason?: string; // How it was verified (e.g. "Verified by Admin Team with Gov Registry ID 93821")
  scamRiskScore?: 'low' | 'medium' | 'high'; // Scam detection for opportunities
  scamAnalysisText?: string; // Short notes on risk indicators checked (e.g. no upfront payment requested, genuine domain)
  humanReviewedBy?: string; // "Human reviewed" badge details
}

export interface SchemaTable {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    constraints?: string;
    description: string;
  }[];
}

export interface ApiEndpoint {
  name: string;
  method: 'POST' | 'GET';
  path: string;
  description: string;
  requestExample: string;
  responseExample: string;
}
