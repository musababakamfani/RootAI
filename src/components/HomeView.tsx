import React from 'react';
import { 
  Building2, 
  Sprout, 
  BriefcaseBusiness, 
  GraduationCap, 
  HeartPulse, 
  Languages, 
  HelpCircle, 
  Tablet, 
  Rss, 
  CheckCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { Opportunity } from '../types';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onQuickPrompt: (promptText: string) => void;
  savedCount: number;
  recentActivity: string[];
}

export default function HomeView({
  onNavigate,
  onQuickPrompt,
  savedCount,
  recentActivity
}: HomeViewProps) {
  return (
    <div className="space-y-6">
      {/* Visual Identity Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-800 to-emerald-950 text-white rounded-2xl p-6 md:p-8 shadow-md">
        <div className="absolute top-0 right-0 -transtype-x-1/3 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-4 animate-pulse">
            <Tablet className="w-3.5 h-3.5" /> Mobile-Optimized Prototype
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">
            RootAI Community Assistant
          </h1>
          <p className="text-teal-100 font-sans text-sm md:text-base leading-relaxed mb-6">
            An intelligent offline-ready assistant designed to empower families, farmers, and small business owners across Africa. Get immediate agricultural advice, look up jobs and scholarships, or connect with emergency community clinics.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              id="hero-start-chat-btn"
              onClick={() => onNavigate('chat')}
              className="px-5 py-2.5 bg-brand-amber text-brand-earth hover:bg-amber-400 font-medium rounded-xl text-sm transition-all shadow-sm flex items-center gap-2"
            >
              Start Interactive Assistant
            </button>
            <button
              id="hero-view-dev-btn"
              onClick={() => onNavigate('dev')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-medium rounded-xl text-sm transition-all"
            >
              Developer Integration Specs
            </button>
          </div>
        </div>
      </div>

      {/* Gateway Bandwidth Alert */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
          <Rss className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-emerald-900 font-sans">SMS & WhatsApp Gateway Active</h4>
          <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">
            This assistant is engineered to work on low-bandwidth SMS or WhatsApp shortcodes without internet connectivity! Use the <strong className="cursor-pointer underline" onClick={() => onNavigate('dev')}>Developer Sandbox</strong> tab below to simulate these integrations instantly.
          </p>
        </div>
      </div>

      {/* Core Sectors Grid / Quick Access */}
      <div>
        <h3 className="text-lg font-display font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span>Explore Key Support Categories</span>
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {/* JOBS */}
          <button
            id="category-jobs-btn"
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center bg-white p-4 rounded-xl border border-slate-100 hover:border-teal-300 hover:shadow-xs transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BriefcaseBusiness className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Jobs & Opportunities</span>
            <span className="text-[10px] text-slate-500 mt-1 text-center">Scholarships, lists</span>
          </button>

          {/* FARMING */}
          <button
            id="category-farming-btn"
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center bg-white p-4 rounded-xl border border-slate-100 hover:border-emerald-300 hover:shadow-xs transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Farming Support</span>
            <span className="text-[10px] text-slate-500 mt-1 text-center">Pathology, soil tips</span>
          </button>

          {/* BUSINESS */}
          <button
            id="category-business-btn"
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center bg-white p-4 rounded-xl border border-slate-100 hover:border-amber-300 hover:shadow-xs transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Business Support</span>
            <span className="text-[10px] text-slate-500 mt-1 text-center">Equipment, setup</span>
          </button>

          {/* LEARNING */}
          <button
            id="category-learning-btn"
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center bg-white p-4 rounded-xl border border-slate-100 hover:border-sky-300 hover:shadow-xs transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Skills & Training</span>
            <span className="text-[10px] text-slate-500 mt-1 text-center">Free course guides</span>
          </button>

          {/* PUBLIC SERVICES */}
          <button
            id="category-services-btn"
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center bg-white p-4 rounded-xl border border-slate-100 hover:border-rose-300 hover:shadow-xs transition-all col-span-2 lg:col-span-1 group"
          >
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Community Services</span>
            <span className="text-[10px] text-slate-500 mt-1 text-center">Clinic, support</span>
          </button>
        </div>
      </div>

      {/* Suggested Fast actions mapping to Chat Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 font-sans mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-500" /> Tap to Ask the Assistant Immediately
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Select one of these urgent community topics to pre-seed the AI chat assistant with relevant parameters:
            </p>
          </div>
          <div className="space-y-2">
            <button
              id="prompt-btn-cassava"
              onClick={() => onQuickPrompt("My cassava leaves have yellow spots and are curling. What is this and how do I prevent further crop damage?")}
              className="w-full text-left p-2.5 text-xs text-teal-900 bg-teal-50/50 hover:bg-teal-50 border border-teal-100 rounded-lg transition-all flex items-center justify-between"
            >
              <span>🌾 How to prevent Cassava leaf disease</span>
              <span className="text-teal-600 font-bold">&rarr;</span>
            </button>
            <button
              id="prompt-btn-grant"
              onClick={() => onQuickPrompt("Can you recommend free business grants or startup funding for a tailoring shop in our local community?")}
              className="w-full text-left p-2.5 text-xs text-amber-900 bg-amber-50/50 hover:bg-amber-50 border border-amber-100 rounded-lg transition-all flex items-center justify-between"
            >
              <span>💰 Micro-grant listings for sole traders</span>
              <span className="text-amber-600 font-bold">&rarr;</span>
            </button>
            <button
              id="prompt-btn-skills"
              onClick={() => onQuickPrompt("I finished high school but have no computer skills. What are the best skills to learn in Africa to get a job fast?")}
              className="w-full text-left p-2.5 text-xs text-sky-900 bg-sky-50/50 hover:bg-sky-50 border border-sky-100 rounded-lg transition-all flex items-center justify-between"
            >
              <span>💻 High-job-demand computer skills for school leavers</span>
              <span className="text-sky-600 font-bold">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Saved Items Summary & Activity */}
        <div className="bg-white p-5 rounded-xl border border-slate-100">
          <h4 className="text-sm font-semibold text-slate-800 font-sans mb-3 flex items-center justify-between">
            <span>Profile Dashboard Stats</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-medium">Session Live</span>
          </h4>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block">Saved opportunities</span>
              <span className="text-lg font-bold text-slate-800 font-display mt-0.5 block">{savedCount} Items</span>
            </div>
            <div className="bg-teal-50/30 p-3 rounded-lg border border-teal-50">
              <span className="text-xs text-teal-700 block">Geographic scope</span>
              <span className="text-xs font-semibold text-teal-900 mt-1 block truncate">Africa Regional</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-1">Recent Activity</span>
            {recentActivity.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No activity logged yet. Start chatting or exploring opportunities!</p>
            ) : (
              <div className="space-y-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                {recentActivity.map((act, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                    <span className="truncate">{act}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Platform Level Impact Analytics */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
        <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-400 mb-3 flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-teal-600" /> RootAI Verified Social Impact Metrics
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center md:text-left">
            <span className="text-lg md:text-2xl font-bold text-slate-800 font-display block">12,490+</span>
            <span className="text-[10px] text-slate-500 block">Farming queries resolved</span>
          </div>
          <div className="text-center md:text-left border-l border-slate-200 pl-4">
            <span className="text-lg md:text-2xl font-bold text-slate-800 font-display block">810 hours</span>
            <span className="text-[10px] text-slate-500 block">USSD offline sessions saved</span>
          </div>
          <div className="text-center md:text-left border-l border-slate-200 pl-4">
            <span className="text-lg md:text-2xl font-bold text-slate-800 font-display block">27 partnerships</span>
            <span className="text-[10px] text-slate-500 block">Active NGOs, Governments</span>
          </div>
        </div>
      </div>

      {/* Developer Spotlight Card */}
      <div id="creator-spotlight-card" className="bg-slate-900 text-slate-150 rounded-xl p-5 border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-slate-800 rounded-xl text-emerald-400 border border-slate-700">
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold font-display text-white">Lead Developer Spotlight</h4>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              RootAI Community Assistant was built and optimized for offline integration by <strong className="text-emerald-400">Musa Baba Kamfani</strong>.
            </p>
          </div>
        </div>
        <a 
          href="https://www.linkedin.com/in/musa-baba-kamfani-765557198" 
          target="_blank" 
          rel="noopener noreferrer" 
          id="linkedin-developer-link"
          className="px-4.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0 uppercase tracking-wider font-sans whitespace-nowrap cursor-pointer"
        >
          <span>Connect on LinkedIn</span>
          <span className="font-bold">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
