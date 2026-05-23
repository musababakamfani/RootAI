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
  confidenceScore?: number;
  confidenceExplanation?: string;
  isHumanReviewed?: boolean;
  humanReviewReason?: string;
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
  valueBadge?: string;
  isVerified?: boolean;
  verificationReason?: string;
  scamRiskScore?: 'low' | 'medium' | 'high';
  scamAnalysisText?: string;
  humanReviewedBy?: string;
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
