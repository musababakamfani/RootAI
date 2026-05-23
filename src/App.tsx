import React, { useState, useEffect } from 'react';
import { 
  Home, MessageSquare, Search, User, Terminal, Smartphone, Monitor, Sprout, Menu, X
} from 'lucide-react';

// Define types directly in App.tsx to avoid import issues
interface GroundingChunk {
  title: string;
  uri: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  groundingChunks?: GroundingChunk[];
  confidenceScore?: number;
  confidenceExplanation?: string;
  isHumanReviewed?: boolean;
  humanReviewReason?: string;
}

interface UserProfile {
  name: string;
  role: string;
  location: string;
  language: string;
  interests: string[];
  walletAddress?: string;
}

interface Opportunity {
  id: string;
  title: string;
  type: string;
  category: string;
  provider: string;
  location: string;
  summary: string;
  detail: string;
  valueBadge?: string;
  isSaved?: boolean;
  isVerified?: boolean;
  scamRiskScore?: string;
}

// Simple placeholder components
const HomeView = ({ onNavigate, onQuickPrompt, savedCount, recentActivity }: any) => (
  <div className="space-y-4">
    <div className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white rounded-xl p-6">
      <h1 className="text-2xl font-bold">RootAI Community Assistant</h1>
      <p className="mt-2">Your intelligent assistant for jobs, farming, business, and community services.</p>
      <button onClick={() => onNavigate('chat')} className="mt-4 bg-amber-500 px-4 py-2 rounded-lg">Start Chatting →</button>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {['Jobs', 'Farming', 'Business', 'Learning', 'Services'].map(cat => (
        <button key={cat} onClick={() => onNavigate('dashboard')} className="bg-white p-4 rounded-xl border text-center hover:shadow">
          <div className="font-semibold">{cat}</div>
        </button>
      ))}
    </div>
  </div>
);

const ChatView = ({ messages, isLoading, onSendMessage, onClearHistory }: any) => {
  const [input, setInput] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };
  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg: ChatMessage) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl ${msg.sender === 'user' ? 'bg-teal-600 text-white' : 'bg-gray-100'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <span className="text-[10px] opacity-70 mt-1 block">{msg.timestamp}</span>
            </div>
          </div>
        ))}
        {isLoading && <div className="text-center text-gray-400">RootAI is thinking...</div>}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1 border rounded-xl px-4 py-2 text-sm" disabled={isLoading} />
        <button type="submit" disabled={!input.trim() || isLoading} className="bg-teal-600 text-white px-4 py-2 rounded-xl disabled:opacity-50">Send</button>
      </form>
    </div>
  );
};

const DashboardView = ({ opportunities, onToggleSave }: any) => (
  <div className="space-y-3">
    <h2 className="text-xl font-bold">Opportunities Board</h2>
    {opportunities.map((opp: Opportunity) => (
      <div key={opp.id} className="bg-white border rounded-xl p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{opp.title}</h3>
            <p className="text-sm text-gray-600">{opp.provider} • {opp.location}</p>
            <p className="text-sm mt-2">{opp.summary}</p>
          </div>
          <button onClick={() => onToggleSave(opp.id)} className="text-rose-500">
            {opp.isSaved ? '❤️ Saved' : '🤍 Save'}
          </button>
        </div>
      </div>
    ))}
  </div>
);

const ProfileView = ({ profile, onChangeProfile }: any) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">Your Profile</h2>
    <div className="space-y-3">
      <input type="text" value={profile.name} onChange={(e) => onChangeProfile({...profile, name: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Name" />
      <input type="text" value={profile.location} onChange={(e) => onChangeProfile({...profile, location: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Location" />
      <select value={profile.role} onChange={(e) => onChangeProfile({...profile, role: e.target.value})} className="w-full border rounded-lg p-2">
        <option value="farmer">Farmer</option>
        <option value="student">Student</option>
        <option value="job_seeker">Job Seeker</option>
        <option value="entrepreneur">Entrepreneur</option>
      </select>
    </div>
  </div>
);

const DevPortalView = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">Developer Portal</h2>
    <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm">
      <p>$ curl -X POST http://localhost:3000/api/chat \</p>
      <p>  -H "Content-Type: application/json" \</p>
      <p>  -d '{"message":"Hello RootAI"}'</p>
    </div>
    <div className="bg-blue-50 p-4 rounded-xl">
      <h3 className="font-semibold">API Endpoints:</h3>
      <ul className="text-sm space-y-1 mt-2">
        <li><code>POST /api/chat</code> - Send messages to AI</li>
        <li><code>POST /api/webhooks/whatsapp</code> - WhatsApp integration</li>
        <li><code>POST /api/webhooks/sms</code> - SMS gateway</li>
        <li><code>POST /api/n8n/trigger</code> - Automation webhook</li>
      </ul>
    </div>
  </div>
);

// Sample data
const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    title: 'Junior Web Developer Apprenticeship',
    type: 'job',
    category: 'jobs',
    provider: 'ALX Africa',
    location: 'Nairobi, Kenya',
    summary: '6-month intensive program with job placement',
    detail: 'Learn full-stack development',
    valueBadge: 'Fully Funded',
    isSaved: false,
    isVerified: true,
    scamRiskScore: 'low'
  },
  {
    id: '2',
    title: 'Cassava Farming Grant',
    type: 'grant',
    category: 'farming',
    provider: 'IFAD',
    location: 'Lagos, Nigeria',
    summary: '$5,000 for smallholder farmers',
    detail: 'Apply by December 2026',
    valueBadge: '$5,000 Grant',
    isSaved: true,
    isVerified: true,
    scamRiskScore: 'low'
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isMobileEmulator, setIsMobileEmulator] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Sarah Nakato",
    role: "farmer",
    location: "Machakos County, Kenya",
    language: "en",
    interests: ["Farming", "Community Development"]
  });
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "Habari! Welcome to RootAI. How can I help you today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState<string[]>(["App initialized"]);

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages, profile })
      });
      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.text || "I received your message but couldn't generate a response.",
        timestamp: new Date().toLocaleTimeString(),
        groundingChunks: data.groundingChunks,
        confidenceScore: data.confidenceScore
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: "Sorry, I'm having trouble connecting. Please check if the server is running.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSave = (id: string) => {
    setOpportunities(prev => prev.map(opp => 
      opp.id === id ? { ...opp, isSaved: !opp.isSaved } : opp
    ));
  };

  const savedCount = opportunities.filter(o => o.isSaved).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sprout className="w-8 h-8 text-teal-600" />
            <span className="font-bold text-xl">Root<span className="text-teal-600">AI</span></span>
          </div>
          <nav className="hidden md:flex gap-2">
            {['home', 'chat', 'dashboard', 'profile', 'dev'].map(tab => (
              <button key={tab} onClick={() => setCurrentTab(tab)} className={`px-4 py-2 rounded-lg capitalize ${currentTab === tab ? 'bg-teal-600 text-white' : 'hover:bg-gray-100'}`}>
                {tab === 'dev' ? 'Developer' : tab}
              </button>
            ))}
          </nav>
          <div className="flex gap-2">
            <button onClick={() => setIsMobileEmulator(!isMobileEmulator)} className="p-2 rounded-lg bg-gray-100">
              {isMobileEmulator ? <Monitor size={20} /> : <Smartphone size={20} />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <div className={`${isMobileEmulator ? 'max-w-md mx-auto' : ''} bg-white rounded-2xl shadow-lg p-6 min-h-[500px]`}>
          {currentTab === 'home' && <HomeView onNavigate={setCurrentTab} onQuickPrompt={handleSendMessage} savedCount={savedCount} recentActivity={recentActivity} />}
          {currentTab === 'chat' && <ChatView messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} onClearHistory={() => setMessages([])} />}
          {currentTab === 'dashboard' && <DashboardView opportunities={opportunities} onToggleSave={handleToggleSave} />}
          {currentTab === 'profile' && <ProfileView profile={profile} onChangeProfile={setProfile} />}
          {currentTab === 'dev' && <DevPortalView />}
        </div>
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>RootAI Community Assistant • Built with ❤️ for Africa</p>
      </footer>
    </div>
  );
}
