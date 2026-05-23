import React, { useState, useEffect } from 'react';
import { 
  Home, 
  MessageSquare, 
  Search, 
  User, 
  Terminal, 
  Tablet, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  Bookmark, 
  Rss,
  Sprout,
  HelpCircle,
  Menu,
  X,
  FileText
} from 'lucide-react';
import { ChatMessage, UserProfile, Opportunity } from './types';
import { INITIAL_OPPORTUNITIES } from './data';
import HomeView from './components/HomeView';
import ChatView from './components/ChatView';
import DashboardView from './components/DashboardView';
import ProfileView from './components/ProfileView';
import DevPortalView from './components/DevPortalView';
import GoogleDocsView from './components/GoogleDocsView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isMobileEmulator, setIsMobileEmulator] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // User Demographics Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: "Sarah Nakato",
    role: "farmer",
    location: "Machakos County, Kenya",
    language: "en",
    interests: ["Cassava & Maize farming", "Pest prevention guides", "No-cost maternal healthcare"]
  });

  // Opportunities pool local state to allow instant additions and saving bookmarks
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  
  // Chat History thread state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Local Audit/Activity Logs state to track interactive changes
  const [recentActivity, setRecentActivity] = useState<string[]>([
    "Initialized RootAI core visual workspace",
    "Loaded sample training databases",
    "Pre-configured cellular SMS gateway interfaces"
  ]);

  // Initial Greeting load tailored to Sarah Nakato or customized profiles
  useEffect(() => {
    setMessages([
      {
        id: 'msg-init',
        sender: 'assistant',
        text: `Habari! Welcome to **RootAI**. I am your Community Service Assistant.\n\nI can help you look up **job opportunities**, find **micro-grants**, analyze **crop pathology symptoms**, or browse free **community health clinics**.\n\nSince you are located in **${profile.location}** and marked interest in **${profile.interests[0] || 'General Growth'}**, try telling me:\n- *"How do I cure Cassava yellow mosaic?"*\n- *"What vocational opportunities are available for students?"*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidenceScore: 99,
        confidenceExplanation: "Vetted greeting sequence authorized under standard carrier onboarding templates.",
        isHumanReviewed: true,
        humanReviewReason: "System onboarding guidelines reviewed and certified by Machakos Community Administration coordinators."
      }
    ]);
  }, []);

  const handleLogActivity = (action: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRecentActivity(prev => [`[${timeStr}] ${action}`, ...prev.slice(0, 9)]);
  };

  const handleProfileChange = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    handleLogActivity(`Updated settings demographics: language=${updatedProfile.language}, loc=${updatedProfile.location}`);
  };

  // Function to save/bookmark opportunities instantly
  const handleToggleSaveOpportunity = (oppId: string) => {
    setOpportunities(prev => prev.map(opp => {
      if (opp.id === oppId) {
        const nextState = !opp.isSaved;
        handleLogActivity(`${nextState ? 'Bookmarked' : 'Removed bookmark'}: ${opp.title}`);
        return { ...opp, isSaved: nextState };
      }
      return opp;
    }));
  };

  // Add new opportunity
  const handlePostNewOpportunity = (newOpp: Opportunity) => {
    setOpportunities(prev => [newOpp, ...prev]);
    handleLogActivity(`Published community listing: "${newOpp.title}"`);
  };

  // Live messaging trigger using Express server route proxied to Gemini
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update state instantly and log
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    handleLogActivity(`User query dispatched: "${text.slice(0, 30)}..."`);

    try {
      // Call modern endpoint in server.ts
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          history: updatedMessages.slice(-5), // Send recent context history
          profile: profile
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP network error: status ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `msg-asst-${Date.now()}`,
        sender: 'assistant',
        text: data.text || "Sorry, I am having trouble fetching a response. Please try re-wording.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingChunks: data.groundingChunks || [],
        confidenceScore: data.confidenceScore,
        confidenceExplanation: data.confidenceExplanation,
        isHumanReviewed: data.isHumanReviewed,
        humanReviewReason: data.humanReviewReason
      };

      setMessages(prev => [...prev, assistantMsg]);
      handleLogActivity(`RootAI response formulated with ${data.groundingChunks?.length || 0} citations`);
    } catch (err: any) {
      console.error("Live assistant fetch failure:", err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ **Server connection issue:**\n\nI couldn't contact the live RootAI backend node. Please verify your internet connection or inspect the active server.ts developer logs.\n\n*Technical info: ${err?.message || 'Express socket unreachable'}*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
      handleLogActivity(`Backend socket error triggered`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPromptPreSeed = (promptText: string) => {
    setCurrentTab('chat');
    handleSendMessage(promptText);
  };

  const clearChatHistory = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'assistant',
        text: `Conversation history cleared. I've reset the WhatsApp SMS carrier thread memory. Let me know how I can guide you under **Sarah Nakato's** active session!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    handleLogActivity("Cleared chat history memory");
  };

  const savedCount = opportunities.filter(o => o.isSaved).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Main Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-3xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo area */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <Sprout className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-display font-bold tracking-tight text-slate-800">
                  Root<span className="text-teal-600 font-extrabold text-2xl tracking-tighter">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-1 font-mono uppercase tracking-widest font-semibold">
                  Community Assistant
                </span>
              </div>
            </div>

            {/* Desktop Tabs Header Navigation */}
            <nav className="hidden md:flex items-center space-x-1.5 text-xs font-semibold">
              <button
                id="tab-home"
                onClick={() => { setCurrentTab('home'); setIsMobileMenuOpen(false); }}
                className={`px-4.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentTab === 'home' 
                    ? 'bg-teal-50 text-teal-800' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Home className="w-4 h-4" /> Home Panel
              </button>
              
              <button
                id="tab-chat"
                onClick={() => { setCurrentTab('chat'); setIsMobileMenuOpen(false); }}
                className={`px-4.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentTab === 'chat' 
                    ? 'bg-teal-50 text-teal-800' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp Assistant
              </button>

              <button
                id="tab-dashboard"
                onClick={() => { setCurrentTab('dashboard'); setIsMobileMenuOpen(false); }}
                className={`px-4.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentTab === 'dashboard' 
                    ? 'bg-teal-50 text-teal-800' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Search className="w-4 h-4" /> Opportunities Board
                {savedCount > 0 && (
                  <span className="bg-rose-500 text-white rounded-full px-1.5 py-0.5 text-[9px] font-bold">
                    {savedCount}
                  </span>
                )}
              </button>

              <button
                id="tab-docs"
                onClick={() => { setCurrentTab('docs'); setIsMobileMenuOpen(false); }}
                className={`px-4.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentTab === 'docs' 
                    ? 'bg-teal-50 text-teal-800' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" /> Google Docs
              </button>

              <button
                id="tab-profile"
                onClick={() => { setCurrentTab('profile'); setIsMobileMenuOpen(false); }}
                className={`px-4.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentTab === 'profile' 
                    ? 'bg-teal-50 text-teal-800' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <User className="w-4 h-4" /> My Profile settings
              </button>

              <button
                id="tab-dev"
                onClick={() => { setCurrentTab('dev'); setIsMobileMenuOpen(false); }}
                className={`px-4.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentTab === 'dev' 
                    ? 'bg-slate-900 text-emerald-400' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Terminal className="w-4 h-4 text-emerald-500" /> Developer Sandbox
              </button>
            </nav>

            {/* Layout simulation selectors */}
            <div className="hidden md:flex items-center gap-2 border-l border-slate-200 pl-4 py-1">
              <button
                id="toggle-emulator-phone"
                onClick={() => setIsMobileEmulator(true)}
                className={`p-1.5 rounded-lg transition ${
                  isMobileEmulator ? 'bg-teal-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
                title="Phone Layout Simulation"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                id="toggle-emulator-desktop"
                onClick={() => setIsMobileEmulator(false)}
                className={`p-1.5 rounded-lg transition ${
                  !isMobileEmulator ? 'bg-teal-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
                title="Fullscreen Desktop"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Action */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-950 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Dropdown Panels */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur px-4 pt-2 pb-4 space-y-1 block shadow-md animate-fade-in">
            <button
              onClick={() => { setCurrentTab('home'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold ${
                currentTab === 'home' ? 'bg-teal-50 text-teal-800' : 'text-slate-600'
              }`}
            >
              <Home className="w-4.5 h-4.5" /> Home Panel
            </button>
            
            <button
              onClick={() => { setCurrentTab('chat'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold ${
                currentTab === 'chat' ? 'bg-teal-50 text-teal-800' : 'text-slate-600'
              }`}
            >
              <MessageSquare className="w-4.5 h-4.5" /> WhatsApp Assistant
            </button>

            <button
              onClick={() => { setCurrentTab('dashboard'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold ${
                currentTab === 'dashboard' ? 'bg-teal-50 text-teal-800' : 'text-slate-600'
              }`}
            >
              <Search className="w-4.5 h-4.5" /> Opportunities Board
            </button>

            <button
              onClick={() => { setCurrentTab('docs'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold ${
                currentTab === 'docs' ? 'bg-teal-50 text-teal-800' : 'text-slate-600'
              }`}
            >
              <FileText className="w-4.5 h-4.5" /> Google Docs
            </button>

            <button
              onClick={() => { setCurrentTab('profile'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold ${
                currentTab === 'profile' ? 'bg-teal-50 text-teal-800' : 'text-slate-600'
              }`}
            >
              <User className="w-4.5 h-4.5" /> My Profile Settings
            </button>

            <button
              onClick={() => { setCurrentTab('dev'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold ${
                currentTab === 'dev' ? 'bg-slate-900 text-emerald-400' : 'text-slate-600'
              }`}
            >
              <Terminal className="w-4.5 h-4.5 text-emerald-500" /> Developer Sandbox
            </button>
            
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">LAYOUT EMULATOR:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setIsMobileEmulator(true); setIsMobileMenuOpen(false); }}
                  className={`text-[10px] px-2.5 py-1 rounded ${isMobileEmulator ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
                >
                  Phone Mode
                </button>
                <button
                  onClick={() => { setIsMobileEmulator(false); setIsMobileMenuOpen(false); }}
                  className={`text-[10px] px-2.5 py-1 rounded ${!isMobileEmulator ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
                >
                  Full width
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Screen Layout (Emulated Smartphone Box vs Full Span Grid) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
        {isMobileEmulator ? (
          /* High Fidelity Mobile Device Frame Wrapper */
          <div className="relative border-[10px] border-slate-800 rounded-[35px] max-w-[430px] w-full bg-slate-100 shadow-2xl overflow-hidden my-2 flex flex-col min-h-[720px]">
            
            {/* Cell Phone Top Speaker notch & Status line details */}
            <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 z-50 flex items-center justify-between px-6 text-[10px] font-mono text-slate-200">
              <span>12:00</span>
              <div className="w-16 h-3 bg-slate-950 rounded-b-lg absolute left-1/2 -translate-x-1/2 top-0"></div>
              <div className="flex items-center gap-1.5">
                <span>SIM LTE (NBO)</span>
                <span className="w-2.5 h-1.5 bg-emerald-400 rounded-xs"></span>
              </div>
            </div>

            {/* Inner Content Area inside emulated device */}
            <div className="pt-8 flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-slate-50 p-2 md:p-3">
              {renderActiveTab()}
            </div>

            {/* Phone Bottom Home indicator line */}
            <div className="bg-slate-850 h-3 py-1 flex items-center justify-center border-t border-slate-800 shrink-0">
              <div className="w-28 h-1 bg-slate-500 rounded-full"></div>
            </div>
          </div>
        ) : (
          /* Normal Fully Expanding Desktop Fluid View */
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-6 shadow-xs min-h-[600px] animate-fade-in">
            {renderActiveTab()}
          </div>
        )}
      </main>

      {/* Humble Footer Section */}
      <footer className="bg-slate-800 text-slate-400 py-6 border-t border-slate-900 shrink-0 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-display text-slate-100">RootAI &bull; Empowering Communities Through Connected Artificial Intelligence</p>
          <p className="text-[10.5px] text-slate-300">
            Engineered by <a href="https://www.linkedin.com/in/musa-baba-kamfani-765557198" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-semibold font-sans">Musa Baba Kamfani</a>
          </p>
          <p className="text-[10px] text-slate-500 font-mono">
            Vite Core Engine Bind: port 3000 &bull; Express routes: Node ESM &bull; Model Alias: gemini-3.5-flash
          </p>
        </div>
      </footer>

    </div>
  );

  // Tab router switch rendering
  function renderActiveTab() {
    switch (currentTab) {
      case 'home':
        return (
          <HomeView
            onNavigate={(tab) => setCurrentTab(tab)}
            onQuickPrompt={handleQuickPromptPreSeed}
            savedCount={savedCount}
            recentActivity={recentActivity}
          />
        );
      case 'chat':
        return (
          <ChatView
            messages={messages}
            profile={profile}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onClearHistory={clearChatHistory}
          />
        );
      case 'dashboard':
        return (
          <DashboardView
            opportunities={opportunities}
            onToggleSave={handleToggleSaveOpportunity}
            onPostNewOpportunity={handlePostNewOpportunity}
          />
        );
      case 'profile':
        return (
          <ProfileView
            profile={profile}
            onChangeProfile={handleProfileChange}
            onLogActivity={handleLogActivity}
          />
        );
      case 'docs':
        return (
          <GoogleDocsView
            profile={profile}
            messages={messages}
            opportunities={opportunities}
            onLogActivity={handleLogActivity}
          />
        );
      case 'dev':
        return <DevPortalView />;
      default:
        return (
          <div className="text-center py-10">
            <HelpCircle className="w-10 h-10 mx-auto text-rose-500 animate-spin" />
            <p className="text-xs text-slate-500 mt-2">Active tab failed loading structure.</p>
          </div>
        );
    }
  }
}
