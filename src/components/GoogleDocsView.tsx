import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  LogIn, 
  LogOut, 
  CheckCircle, 
  Share2, 
  MessageSquare, 
  Bookmark, 
  Loader2, 
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  BookOpen
} from 'lucide-react';
import { 
  initAuth, 
  signInWithGoogle, 
  signOutFromGoogle, 
  createGoogleDocument, 
  appendTextToGoogleDocument,
  GoogleDocInsertRequest,
  getGoogleDocument
} from '../lib/googleDocs';
import { User } from 'firebase/auth';
import { ChatMessage, UserProfile, Opportunity } from '../types';

interface GoogleDocsViewProps {
  profile: UserProfile;
  messages: ChatMessage[];
  opportunities: Opportunity[];
  onLogActivity: (action: string) => void;
}

interface LocalDoc {
  id: string;
  title: string;
  createdTime: string;
  url: string;
}

export default function GoogleDocsView({
  profile,
  messages,
  opportunities,
  onLogActivity
}: GoogleDocsViewProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Interaction and Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Document History List (stores creations made in the session)
  const [docHistory, setDocHistory] = useState<LocalDoc[]>([
    {
      id: 'mock-1',
      title: 'RootAI Manual - Low Bandwidth Farming Integration Guide',
      createdTime: '2:15 PM',
      url: 'https://docs.google.com/document'
    }
  ]);

  // Handle Firebase OAuth initialization on mounting
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, cachedToken) => {
        setCurrentUser(user);
        setToken(cachedToken);
        setNeedsAuth(false);
      },
      () => {
        setCurrentUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    onLogActivity("Initiated auth sign-in popup flow for Google Docs...");
    try {
      const result = await signInWithGoogle();
      if (result) {
        setCurrentUser(result.user);
        setToken(result.token);
        setNeedsAuth(false);
        onLogActivity(`Authenticated safely as ${result.user.email}`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'OAuth authentication cancelled or denied.');
      onLogActivity("OAuth integration flow cancelled or aborted");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to disconnect your Google Docs session? You can link again at any time.")) {
      return;
    }
    await signOutFromGoogle();
    setCurrentUser(null);
    setToken(null);
    setNeedsAuth(true);
    setSuccessMessage("Successfully logged out from Google Workspace.");
    onLogActivity("Logged out from Google Workspace Docs session");
  };

  const addDocToHistory = (id: string, title: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const url = `https://docs.google.com/document/d/${id}/edit`;
    setDocHistory(prev => [
      { id, title, createdTime: timeStr, url },
      ...prev.filter(d => d.id !== 'mock-1') // Clear sample list
    ]);
  };

  // Preview & fetching summary of Google Document files
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [docPreviews, setDocPreviews] = useState<Record<string, { 
    textContent?: string; 
    wordCount?: number; 
    characterCount?: number; 
    isLoading: boolean; 
    error?: string;
  }>>({});

  const handleExpandPreview = async (doc: LocalDoc) => {
    if (expandedDocId === doc.id) {
      setExpandedDocId(null);
      return;
    }

    setExpandedDocId(doc.id);

    // Skip redundant API fetches if already parsed
    if (docPreviews[doc.id] && !docPreviews[doc.id].error) {
      return;
    }

    setDocPreviews(prev => ({
      ...prev,
      [doc.id]: { isLoading: true }
    }));

    onLogActivity(`Expanding and loading document summary preview for "${doc.title}"...`);

    // For initial mock document (so the site is robustly testable, even if user is not fully authenticated or in a sandbox frame)
    if (doc.id === 'mock-1') {
      setTimeout(() => {
        setDocPreviews(prev => ({
          ...prev,
          [doc.id]: {
            textContent: "ROOTAI INSTRUCTIONAL GUIDE FOR LOW BANDWIDTH COMMUNITIES\n\n=========================================================\n\n1. SYSTEM PARAMETERS\n- Low bandwidth configuration: enabled\n- Gateway server endpoint: https://ais-dev.europe-west2.run.app\n- Carrier network packet transport model: secure SMS chunks\n\n2. CROP PEST DIAGNOSTICS CONTROL BOARD\n- Local farmers can input symptoms as text.\n- AI matches indicators with standard agricultural remedies.\n\n3. SCHOLARSHIPS & EDUCATION FUND GRANTS\n- Match eligible youth in specific linguistic cohorts with international study vouchers or technical training stipends.",
            wordCount: 81,
            characterCount: 562,
            isLoading: false
          }
        }));
      }, 450);
      return;
    }

    // Live retrieval using getGoogleDocument
    try {
      if (!token) {
        throw new Error("Google Workspace authentication required. Note: sandbox frame limits might block popup tokens. Open in new tab if needed!");
      }

      const result = await getGoogleDocument(doc.id, token);
      const text = result.textContent || "The fetched Google Doc doesn't have any body text in it yet.";
      const chars = text.length;
      const words = text.split(/\s+/).filter(Boolean).length;

      setDocPreviews(prev => ({
        ...prev,
        [doc.id]: {
          textContent: text,
          wordCount: words,
          characterCount: chars,
          isLoading: false
        }
      }));
      onLogActivity(`Successfully retrieved Google Doc summary for ${doc.id}`);
    } catch (err: any) {
      console.error(err);
      setDocPreviews(prev => ({
        ...prev,
        [doc.id]: {
          isLoading: false,
          error: err.message || "Failed to contact Google Docs API. Verify your credential scope permissions."
        }
      }));
      onLogActivity(`Failed to fetch Google Doc text summary: ${err.message || 'Verification Error'}`);
    }
  };

  // Mutator 1: Create a Custom Community Profile & Interest Report in Google Docs
  const handleExportProfileDoc = async () => {
    if (!token || !currentUser) {
      setErrorMessage("No active authentications found.");
      return;
    }

    const docTitle = `${profile.name}'s RootAI Community Profile & Guides`;
    const confirmed = window.confirm(
      `Create a new Google Document titled "${docTitle}"?\n\nThis will write your demographics, role interests, and active diagnostic reports to your Google Drive.`
    );
    if (!confirmed) return;

    setIsCreating(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    onLogActivity("Compiling user diagnostics document...");

    try {
      const doc = await createGoogleDocument(docTitle, token);
      
      const segments: GoogleDocInsertRequest[] = [
        { text: `\n=======================================================\n` },
        { text: `\nGenerated dynamically on ${new Date().toLocaleDateString()} using the carrier-grade RootAI Network.\n` },
        { text: `\nRootAI Digital Onboarding Services & Resources Report\n`, isHeading: true },
        { text: `\n=======================================================\n` },
        { text: `\n\n[Interests & Subscriptions]\n${profile.interests.map(i => ` - ${i}`).join('\n') || 'None recorded'}\n` },
        { text: `\n[Location / Province]\n${profile.location}\n` },
        { text: `\n[Linguistic Interface Settings]\nPrimary Communication Language: ${profile.language.toUpperCase()}\n` },
        { text: `\n[Demographics Overview]\nName: ${profile.name}\nActive Role: ${profile.role.toUpperCase()}\n` },
        { text: `\nROOTAI COMMUNITY INTELLIGENCE RECORD\n`, isHeading: true }
      ];

      await appendTextToGoogleDocument(doc.documentId, segments, token);
      addDocToHistory(doc.documentId, docTitle);
      setSuccessMessage(`Document "${docTitle}" built successfully! Open it in Google Docs.`);
      onLogActivity(`Exported user profile doc: ${doc.documentId}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failure writing Google Document.');
    } finally {
      setIsCreating(false);
    }
  };

  // Mutator 2: Export active messaging chat conversation history to Google Docs
  const handleExportChatHistory = async () => {
    if (!token || !currentUser) {
      setErrorMessage("Please authenticate to access Google Workspace.");
      return;
    }

    if (messages.length === 0) {
      setErrorMessage("No active conversation thread messages found to export.");
      return;
    }

    const docTitle = `RootAI Thread Export - ${new Date().toLocaleDateString()}`;
    const confirmed = window.confirm(
      `Export the current conversation containing ${messages.length} message(s) directly to your Google Docs?\n\nThis will create a new file in your Docs directory.`
    );
    if (!confirmed) return;

    setIsCreating(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    onLogActivity("Assembling WhatsApp/SMS chat transcription...");

    try {
      const doc = await createGoogleDocument(docTitle, token);

      const segments: GoogleDocInsertRequest[] = [];
      segments.push({ text: `\n=======================================================\n` });
      segments.push({ text: `\nExported from RootAI on: ${new Date().toLocaleString()}\n` });
      segments.push({ text: `\nROOTAI ASSISTANT CHAT TRANSCRIPTION\n`, isHeading: true });
      segments.push({ text: `\n=======================================================\n\n` });

      messages.forEach((msg, idx) => {
        const titleStr = `${idx + 1}. [${msg.timestamp}] ${msg.sender.toUpperCase()}:\n`;
        const textPayload = `${msg.text}\n\n`;
        segments.push({ text: textPayload });
        segments.push({ text: titleStr });
      });

      segments.push({ text: `\n--- End of Active Interactive Transcript ---\n` });

      await appendTextToGoogleDocument(doc.documentId, segments, token);
      addDocToHistory(doc.documentId, docTitle);
      setSuccessMessage(`Conversations extracted into Google Doc "${docTitle}"!`);
      onLogActivity(`Exported chat transcript: ${doc.documentId}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Could not write chat history to Docs.');
    } finally {
      setIsCreating(false);
    }
  };

  // Mutator 3: Export Saved Bookmarked opportunities
  const handleExportBookmarkedList = async () => {
    if (!token || !currentUser) {
      setErrorMessage("Authentication token required.");
      return;
    }

    const bookmarked = opportunities.filter(o => o.isSaved);
    if (bookmarked.length === 0) {
      setErrorMessage("You don't have any bookmarked Opportunities on your board to export yet.");
      return;
    }

    const docTitle = `My Saved Opportunities List - ${profile.name}`;
    const confirmed = window.confirm(
      `Export ${bookmarked.length} bookmarked list item(s) to a Google Document?\n\nThis creates a clean report containing provider addresses, application scopes, and vetted details.`
    );
    if (!confirmed) return;

    setIsCreating(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    onLogActivity("Compiling bookmarked opportunities report...");

    try {
      const doc = await createGoogleDocument(docTitle, token);

      const segments: GoogleDocInsertRequest[] = [];
      segments.push({ text: `\n=======================================================\n` });
      segments.push({ text: `\nCompiled for: ${profile.name} (${profile.location})\n` });
      segments.push({ text: `\nROOTAI CERTIFIED OPPORTUNITIES SHEET\n`, isHeading: true });
      segments.push({ text: `\n=======================================================\n\n` });

      bookmarked.forEach((opp, index) => {
        segments.push({ text: `\n------------------------------------\n` });
        segments.push({ text: `\nDetails: ${opp.detail}\n` });
        segments.push({ text: `\nValue Bracket: ${opp.valueBadge || 'Fully Vetted service'}\n` });
        segments.push({ text: `\nLocation: ${opp.location} | Provided by: ${opp.provider}\n` });
        segments.push({ text: `\nCategory: ${opp.category.toUpperCase()}\n` });
        segments.push({ text: `\n${index + 1}. TITLE: ${opp.title}\n`, isHeading: true });
      });

      await appendTextToGoogleDocument(doc.documentId, segments, token);
      addDocToHistory(doc.documentId, docTitle);
      setSuccessMessage(`Opportunities exported successfully file: "${docTitle}"`);
      onLogActivity(`Exported bookmarked opportunities report: ${doc.documentId}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Export compiled structure failed.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* View Header Info */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 flex items-start gap-3 shadow-3xs">
        <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-800 font-display">Google Docs Integration Portal</h1>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
            Link your Google Workspace account to export offline program guides, compose custom farming schedules, or print chat advice summaries seamlessly.
          </p>
        </div>
      </div>

      {/* Main Authentication Flow Box */}
      {needsAuth ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center space-y-4">
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-3xl block">📁</span>
            <h3 className="text-sm font-semibold text-slate-800 font-display">Connect to Google Workspace Docs</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unlock direct Document publishing tools to compile your crop symptoms, bookmarked scholarships, or maternal healthcare schedules directly inside Google Docs.
            </p>
          </div>

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-xl max-w-md mx-auto text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <p className="text-left font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Genuine Google Material Sign in Button */}
          <div className="flex justify-center pt-2">
            <button 
              id="google-workspace-signin-btn"
              onClick={handleLogin}
              disabled={isLoggingIn}
              className={`px-6 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-3 transition-all cursor-pointer shadow-3xs hover:shadow-2xs select-none ${
                isLoggingIn ? 'opacity-80' : ''
              }`}
            >
              {isLoggingIn ? (
                <Loader2 className="w-4.5 h-4.5 text-teal-600 animate-spin" />
              ) : (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4.5 h-4.5">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
              )}
              <span>{isLoggingIn ? "Logging into Google..." : "Sign in with Google"}</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-400 font-medium">
            🔒 Connection processed securely client-side. We keep authentication credentials locked in memory.
          </p>
        </div>
      ) : (
        /* Connected Workspace Management Board */
        <div className="space-y-6">
          
          {/* Active Google Session Header */}
          <div className="bg-teal-50/50 border border-teal-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || "Google User"} 
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full border border-teal-300 shadow-3xs"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
                  {currentUser?.displayName?.[0] || 'U'}
                </div>
              )}
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider font-mono">
                  🟢 Linked Google Session
                </span>
                <h4 className="text-sm font-semibold text-slate-800 leading-tight">
                  {currentUser?.displayName || 'Workspace Account'}
                </h4>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">{currentUser?.email}</p>
              </div>
            </div>

            <button
              id="google-workspace-signout-btn"
              onClick={handleLogout}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 text-[11px] font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Unlink Account</span>
            </button>
          </div>

          {/* Action Alerts Block */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3.5 rounded-xl text-xs flex items-start gap-2 animate-fade-in font-sans">
              <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="block font-bold">Action Request Rejected</strong>
                <p className="text-slate-700">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-150 text-emerald-800 p-3.5 rounded-xl text-xs flex items-start gap-2 animate-fade-in font-sans">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="block font-bold">Task Completed Successfully</strong>
                <p className="text-slate-700">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Docs Core Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Action 1: Export Profile Guide */}
            <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-3xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  📝
                </div>
                <h4 className="text-xs font-bold text-slate-800 font-display">Build Demographic Report</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  Generate an offline-formatted report combining profile info, location guidelines, and role-interest vectors for <strong>{profile.name}</strong>.
                </p>
              </div>
              <button
                id="doc-export-profile-btn"
                onClick={handleExportProfileDoc}
                disabled={isCreating}
                className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-[11.5px] transition-all flex items-center justify-center gap-1 cursor-pointer select-none"
              >
                {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Build Report Doc</span>
              </button>
            </div>

            {/* Action 2: Export Chat transcription */}
            <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-3xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  💬
                </div>
                <h4 className="text-xs font-bold text-slate-800 font-display">Export Active Chat Dialogue</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  Transcribe the current digital assistant dialogue (totaling <strong>{messages.length}</strong> message(s)) into a printable document ledger.
                </p>
              </div>
              <button
                id="doc-export-chat-btn"
                onClick={handleExportChatHistory}
                disabled={isCreating || messages.length === 0}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-550 text-white font-bold rounded-lg text-[11.5px] transition-all flex items-center justify-center gap-1 cursor-pointer select-none disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-100 disabled:cursor-not-allowed"
              >
                {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>Export Diagnostics Chat</span>
              </button>
            </div>

            {/* Action 3: Export Opportunities list */}
            <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-3xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                  🔖
                </div>
                <h4 className="text-xs font-bold text-slate-800 font-display font-sans">Export Saved Opportunities</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  Download <strong>{opportunities.filter(o => o.isSaved).length}</strong> bookmarked listings, matching scholarships, and free clinics to a secure Google Document.
                </p>
              </div>
              <button
                id="doc-export-opps-btn"
                onClick={handleExportBookmarkedList}
                disabled={isCreating || opportunities.filter(o => o.isSaved).length === 0}
                className="w-full py-2 bg-pink-600 hover:bg-pink-550 text-white font-bold rounded-lg text-[11.5px] transition-all flex items-center justify-center gap-1 cursor-pointer select-none disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-100 disabled:cursor-not-allowed"
              >
                {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>Export Bookmarks</span>
              </button>
            </div>

          </div>

          {/* Documents History Feed list for fast checking */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-3xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 font-display flex items-center gap-1.5 uppercase tracking-wide">
              📁 Created Session Documents Directory
            </h4>
            <div className="divide-y divide-slate-100">
              {docHistory.map((doc) => {
                const isExpanded = expandedDocId === doc.id;
                const preview = docPreviews[doc.id];

                return (
                  <div key={doc.id} className="py-3.5 first:pt-1 last:pb-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="text-teal-600 font-bold mt-0.5">📝</span>
                        <div className="min-w-0">
                          <strong className="font-semibold text-slate-700 block text-ellipsis overflow-hidden whitespace-nowrap">
                            {doc.title}
                          </strong>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            ID: <span className="font-mono text-[9px] text-slate-500 bg-slate-50 px-1 py-0.2 rounded border border-slate-200">{doc.id}</span> &bull; {doc.createdTime}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-7 sm:ml-0 shrink-0 self-start sm:self-center">
                        {/* Interactive Toggle Button */}
                        <button
                          id={`doc-preview-toggle-${doc.id}`}
                          onClick={() => handleExpandPreview(doc)}
                          className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                            isExpanded 
                              ? 'bg-teal-50 text-teal-850 border border-teal-200' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {isExpanded ? <EyeOff className="w-3.5 h-3.5 text-teal-700" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
                          <span>{isExpanded ? "Close Preview" : "Expand Preview"}</span>
                        </button>

                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 rounded-lg text-[10.5px] font-semibold text-slate-600 flex items-center gap-1 shrink-0 transition-all select-none cursor-pointer"
                        >
                          <span>Open in Docs</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </div>
                    </div>

                    {/* Collapsible Content Preview Panel */}
                    {isExpanded && (
                      <div className="mt-3.5 ml-7 bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2.5 animate-slide-down">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 border-b border-dashed border-slate-200 pb-2">
                          <span className="flex items-center gap-1.5 uppercase tracking-wider text-teal-800 font-mono">
                            <BookOpen className="w-3 h-3 text-teal-600" /> Live Content Summary
                          </span>
                          {preview && !preview.isLoading && !preview.error && (
                            <span className="font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                              {preview.wordCount} words &bull; {preview.characterCount} chars
                            </span>
                          )}
                        </div>

                        {preview?.isLoading ? (
                          <div className="flex items-center justify-center py-6 gap-2 text-xs text-slate-500 font-sans">
                            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                            <span>Fetching live document body from Google Docs API...</span>
                          </div>
                        ) : preview?.error ? (
                          <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-lg text-xs space-y-2 leading-relaxed text-rose-800">
                            <div className="font-bold flex items-center gap-1.5 text-rose-950">
                              <AlertCircle className="w-4 h-4 text-rose-600" />
                              <span>Live API Request Unresolved</span>
                            </div>
                            <p className="text-slate-700">{preview.error}</p>
                            
                            {doc.id !== 'mock-1' && (
                              <div className="bg-white border border-rose-150 p-2 text-[10.5px] text-slate-500 rounded-md">
                                💡 <strong>Tips for Sandbox environments</strong>: If your browser's security limits prevent blockable oauth cookie triggers in our iframe sandbox, try loading the app in a <strong>new browser tab</strong> or verifying active scopes.
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            <div className="bg-white border border-slate-150 p-3.5 rounded-lg max-h-48 overflow-y-auto shadow-inner">
                              <pre className="text-xs text-slate-700 font-sans whitespace-pre-wrap leading-relaxed">
                                {preview?.textContent}
                              </pre>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-normal flex items-center gap-1">
                              🤖 <span>This document is completely dynamic. Submitting updates above syncs directly with this viewer!</span>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
