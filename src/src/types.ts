export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  role: string;
  location: string;
  language: string;
  interests: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  type: string;
  category: string;
  provider: string;
  location: string;
  summary: string;
  detail: string;
  isSaved?: boolean;
}
