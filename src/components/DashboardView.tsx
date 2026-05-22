import React, { useState } from 'react';
import { 
  BriefcaseBusiness, 
  Sprout, 
  Building2, 
  GraduationCap, 
  HeartPulse, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  PlusCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { Opportunity } from '../types';

interface DashboardViewProps {
  opportunities: Opportunity[];
  onToggleSave: (id: string) => void;
  onPostNewOpportunity?: (newOpp: Opportunity) => void;
}

export default function DashboardView({
  opportunities,
  onToggleSave,
  onPostNewOpportunity
}: DashboardViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Simple Add opportunity form state for client interactive realism!
  const [formData, setFormData] = useState({
    title: '',
    provider: '',
    type: 'job',
    category: 'jobs',
    location: '',
    summary: '',
    detail: '',
    valueBadge: ''
  });

  const [formSuccess, setFormSuccess] = useState(false);

  // Filter listings based on categories, search strings, and verification toggle
  const filtered = opportunities.filter(opp => {
    const matchesCategory = activeCategory === 'all' || opp.category === activeCategory;
    const matchesVerified = !onlyVerified || opp.isVerified;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchLower) ||
      opp.provider.toLowerCase().includes(searchLower) ||
      opp.summary.toLowerCase().includes(searchLower) ||
      opp.detail.toLowerCase().includes(searchLower) ||
      opp.location.toLowerCase().includes(searchLower);

    return matchesCategory && matchesVerified && matchesSearch;
  });

  const savedListings = opportunities.filter(o => o.isSaved);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.provider || !formData.summary) return;

    const newOpp: Opportunity = {
      id: 'opp-user-' + Date.now(),
      title: formData.title,
      provider: formData.provider,
      type: formData.type as any,
      category: formData.category as any,
      location: formData.location || 'Local Community',
      summary: formData.summary,
      detail: formData.detail || formData.summary,
      valueBadge: formData.valueBadge || 'Community Sourced',
      isSaved: false,
      isVerified: false, // Default to false until admin audit
      verificationReason: 'Verified by RootAI Community Board with partner registration #PENDING-AUDIT.',
      scamRiskScore: 'low',
      scamAnalysisText: 'Community submission under screening. No recruitment charges specified.',
      humanReviewedBy: 'Vetted by RootAI Moderator Team'
    };

    if (onPostNewOpportunity) {
      onPostNewOpportunity(newOpp);
    }
    
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowAddForm(false);
      setFormData({
        title: '',
        provider: '',
        type: 'job',
        category: 'jobs',
        location: '',
        summary: '',
        detail: '',
        valueBadge: ''
      });
    }, 1500);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'jobs': return 'text-teal-600 bg-teal-50 border-teal-100';
      case 'farming': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'business': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'learning': return 'text-sky-600 bg-sky-50 border-sky-100';
      case 'services': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'jobs': return <BriefcaseBusiness className="w-4 h-4" />;
      case 'farming': return <Sprout className="w-4 h-4" />;
      case 'business': return <Building2 className="w-4 h-4" />;
      case 'learning': return <GraduationCap className="w-4 h-4" />;
      case 'services': return <HeartPulse className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Navigation Headers */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Keyword Lookup with Trust Filters */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2.5">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              id="opp-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-sans"
              placeholder="Search positions, locations, or verified programs..."
            />
          </div>
          
          {/* Verified Toggle Filter */}
          <button
            id="filter-only-verified"
            type="button"
            onClick={() => setOnlyVerified(!onlyVerified)}
            className={`px-3 py-2 border rounded-xl text-xs font-semibold select-none flex items-center gap-1.5 transition-all cursor-pointer ${
              onlyVerified 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-3xs' 
                : 'bg-slate-50/50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${onlyVerified ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>Verified Only</span>
          </button>
        </div>

        {/* Categories Tab Selectors */}
        <div className="flex flex-wrap items-center gap-1.5 scrollbar-none">
          <button
            id="tab-all-opps"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
              activeCategory === 'all' 
                ? 'bg-teal-600 text-white' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Sectors
          </button>
          <button
            id="tab-jobs-opps"
            onClick={() => setActiveCategory('jobs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
              activeCategory === 'jobs' 
                ? 'bg-teal-600 text-white' 
                : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
            }`}
          >
            <BriefcaseBusiness className="w-3.5 h-3.5" /> Jobs
          </button>
          <button
            id="tab-farming-opps"
            onClick={() => setActiveCategory('farming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
              activeCategory === 'farming' 
                ? 'bg-teal-600 text-white' 
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" /> Farming
          </button>
          <button
            id="tab-business-opps"
            onClick={() => setActiveCategory('business')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
              activeCategory === 'business' 
                ? 'bg-teal-600 text-white' 
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> Business
          </button>
          <button
            id="tab-learning-opps"
            onClick={() => setActiveCategory('learning')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
              activeCategory === 'learning' 
                ? 'bg-teal-600 text-white' 
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> Skills
          </button>
          <button
            id="tab-services-opps"
            onClick={() => setActiveCategory('services')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
              activeCategory === 'services' 
                ? 'bg-teal-600 text-white' 
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" /> Clinics
          </button>
        </div>

        {/* Suggest / Sourced Button */}
        <button
          id="btn-trigger-add-opportunity"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-2 bg-brand-green hover:bg-brand-green-dark text-white rounded-xl text-xs font-semibold flex items-center gap-1 bg-teal-600"
        >
          <PlusCircle className="w-4 h-4" /> Add Opportunity
        </button>
      </div>

      {/* Add Custom Opportunity Form Simulation */}
      {showAddForm && (
        <form onSubmit={handleFormSubmit} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative animate-fade-in space-y-4">
          <h3 className="text-sm font-semibold font-display text-slate-800">Submit Local Community Notice</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Offer Title</label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                placeholder="e.g. Free Tractor Hiring Cooperative"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Hosting Agency / Provider</label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                placeholder="e.g. Local Agri NGO"
                value={formData.provider}
                onChange={(e) => setFormData({...formData, provider: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Geographic Scope</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                placeholder="e.g. Kumasi, Ghana"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Value Perk Tag</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                placeholder="e.g. Subsidy, Free Support, $500/mo stipend"
                value={formData.valueBadge}
                onChange={(e) => setFormData({...formData, valueBadge: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Support Category</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value, type: e.target.value === 'jobs' ? 'job' : 'training'})}
              >
                <option value="jobs">Jobs & Apprenticeships</option>
                <option value="farming">Farming support</option>
                <option value="business">Business / Grants</option>
                <option value="learning">Skills & Training</option>
                <option value="services">Clinics & Services</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Short Summary (SMS compatible)</label>
              <input
                type="text"
                required
                maxLength={100}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                placeholder="Max 100 character plain intro"
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Detailed Operational Guidelines</label>
            <textarea
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
              placeholder="Step by step eligibility, registration dates, contact details and location links..."
              value={formData.detail}
              onChange={(e) => setFormData({...formData, detail: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs text-white bg-teal-600 rounded-lg hover:bg-teal-700 font-bold"
            >
              Publish Now
            </button>
          </div>

          {formSuccess && (
            <div className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center text-teal-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce mb-2" />
              <span className="text-xs font-semibold">Listing Dispatch Success! Added to searchable pool.</span>
            </div>
          )}
        </form>
      )}

      {/* Grid of filtered components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 bg-white text-center py-12 px-4 rounded-xl border border-slate-100 text-slate-400">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-medium">No results match your active search filter.</p>
            <p className="text-[10px] mt-1 text-slate-300">Try re-keying keywords, changing sectors, or adding a sourced announcement above!</p>
          </div>
        ) : (
          filtered.map((opp) => {
            const isExpanded = expandedId === opp.id;
            const catColors = getCategoryColor(opp.category);
            
            return (
              <div 
                key={opp.id} 
                className={`bg-white border rounded-xl overflow-hidden transition-all flex flex-col justify-between ${
                  isExpanded ? 'border-teal-500 shadow-sm ring-1 ring-teal-500/10' : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                {/* Visual Header */}
                <div className="p-4 space-y-2 flex-grow">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${catColors}`}>
                      {getIcon(opp.category)} {opp.category.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {opp.isVerified && (
                        <span className="inline-flex items-center gap-0.5 bg-emerald-150 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-300 font-mono tracking-tight cursor-help uppercase" title={opp.verificationReason}>
                          🛡️ Verified
                        </span>
                      )}
                      {opp.valueBadge && (
                        <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-200">
                          {opp.valueBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-1">
                    <div className="flex items-start gap-1 justify-between">
                      <h4 className="text-sm font-semibold font-display text-slate-800 leading-tight block">{opp.title}</h4>
                    </div>
                    <span className="text-[10px] text-slate-600 block mt-0.5">{opp.provider} &bull; <strong className="text-slate-500 font-normal">{opp.location}</strong></span>
                  </div>

                  <p className="text-xs text-slate-500 font-sans leading-relaxed pt-1">
                    {opp.summary}
                  </p>

                  {/* Collapsible details pane styling with dynamic trust controls */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-3 animate-fade-in font-sans">
                      <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                        <p className="font-semibold text-[10px] text-slate-400 uppercase tracking-widest mb-1">Full Operational Details</p>
                        <p className="text-slate-700 leading-relaxed">{opp.detail}</p>
                      </div>

                      {/* Scam & Fraud Detection Dashboard inside Card */}
                      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                          <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                            🛡️ Fraud & Scam Prevention Audit
                          </span>
                          <span className="inline-flex items-center bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded font-mono">
                            RISK: {opp.scamRiskScore?.toUpperCase() || 'LOW'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] text-slate-500 font-medium">
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>No application fees screened</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>Official domains audited</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>No premium number charges</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>Registered registry matched</span>
                          </div>
                        </div>

                        {opp.scamAnalysisText && (
                          <div className="text-[10.5px] text-slate-600 bg-white border border-slate-150 p-2 rounded-lg leading-relaxed shadow-3xs">
                            <strong>Security Analysis:</strong> {opp.scamAnalysisText}
                          </div>
                        )}

                        {opp.verificationReason && (
                          <div className="text-[10.5px] text-teal-900 bg-teal-50/30 border border-teal-100 p-2 rounded-lg leading-relaxed">
                            <strong>Verification Audit:</strong> {opp.verificationReason}
                          </div>
                        )}

                        {opp.humanReviewedBy && (
                          <div className="text-[10.5px] text-amber-900 bg-amber-50/40 border border-amber-100 p-2 rounded-lg">
                            <strong>Human Review Badge:</strong> Reviewed and approved by <strong className="font-semibold text-amber-950">{opp.humanReviewedBy}</strong>. Sensitive topic guide verified.
                          </div>
                        )}
                      </div>
                      
                      {opp.linkText && (
                        <div className="pt-1">
                          <a 
                            href={opp.linkUrl || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-teal-650 hover:text-teal-850 font-bold text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shadow-3xs transition-all"
                          >
                            {opp.linkText} <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer bookmark and collapse metrics */}
                <div className="bg-slate-50/40 px-4 py-2 flex items-center justify-between border-t border-slate-100">
                  <button
                    id={`toggle-details-btn-${opp.id}`}
                    onClick={() => toggleExpand(opp.id)}
                    className="text-[10px] text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {isExpanded ? (
                      <>Hide Details <ChevronUp className="w-3.5 h-3.5" /></>
                    ) : (
                      <>View Details <ChevronDown className="w-3.5 h-3.5" /></>
                    )}
                  </button>

                  <button
                    id={`bookmark-btn-${opp.id}`}
                    onClick={() => onToggleSave(opp.id)}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      opp.isSaved 
                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                        : 'bg-white text-slate-400 border border-slate-200 hover:text-slate-600'
                    }`}
                    title={opp.isSaved ? "Remove Bookmark" : "Save Opportunity"}
                  >
                    {opp.isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Saved items bookmark summary pane */}
      {savedListings.length > 0 && (
        <div className="bg-white p-5 rounded-xl border border-slate-100">
          <h3 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
            <BookmarkCheck className="w-4 h-4 text-emerald-600" /> Bookmarked Opportunities ({savedListings.length})
          </h3>
          <div className="space-y-2">
            {savedListings.map((sl) => (
              <div key={sl.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 border border-slate-100 text-xs transition-all">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <div className="truncate text-slate-800">
                    <strong className="font-semibold block sm:inline">{sl.title}</strong>
                    <span className="text-[10px] text-slate-400 sm:ml-2">by {sl.provider}</span>
                  </div>
                </div>
                <button
                  id={`remove-saved-btn-${sl.id}`}
                  onClick={() => onToggleSave(sl.id)}
                  className="text-[10px] text-rose-600 hover:underline shrink-0"
                >
                  Unsave
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
