import React, { useState } from 'react';
import { User, MapPin, Languages, CheckSquare, Sparkles, Sliders, Linkedin, ExternalLink, Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  onChangeProfile: (updated: UserProfile) => void;
  onLogActivity: (activity: string) => void;
}

const INTEREST_TAGS = [
  "Cassava & Maize farming",
  "Pest prevention guides",
  "Free startup micro-grants",
  "Equipment subsidies",
  "No-cost maternal healthcare",
  "Coding bootcamps & apprenticeships",
  "M-Pesa cashflow trackers",
  "Local artisan networking"
];

const LANGUAGE_MAP: { [key: string]: string } = {
  en: "English (Standard)",
  sw: "Kiswahili (East Africa)",
  fr: "French (West Africa)",
  yo: "Yoruba (Nigeria)",
  ha: "Hausa (Northern region)"
};

export default function ProfileView({
  profile,
  onChangeProfile,
  onLogActivity
}: ProfileViewProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  // Check if we are currently running inside an iframe (such as sandboxed AI Studio previews)
  const isIframe = typeof window !== 'undefined' && window.self !== window.top;

  const handleConnectWallet = async () => {
    setWalletError(null);
    setIsConnectingWallet(true);
    onLogActivity("Initiated MetaMask wallet link request...");

    try {
      if (typeof window === 'undefined') {
        throw new Error("Window context is not available.");
      }

      const ethereum = (window as any).ethereum;

      if (!ethereum) {
        if (isIframe) {
          throw new Error("Ethereum provider is missing inside our sandboxed preview iframe. Web3 injectors are blocked by iframe sandboxes. Please open our application in a NEW browser tab using the 'Open App' option in the top-right to connect MetaMask directly!");
        } else {
          throw new Error("MetaMask is not installed in your current browser. Please install MetaMask extension to link your blockchain identity.");
        }
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts[0]) {
        const address = accounts[0];
        handleInputChange('walletAddress', address);
        onLogActivity(`Connected web3 wallet: ${address}`);
        setWalletError(null);
      } else {
        throw new Error("MetaMask did not return any connected accounts.");
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || "Unknown MetaMask association error.";
      if (err.code === 4001) {
        msg = "The linking sequence was cancelled inside MetaMask. Please click linking and authorize the prompt.";
      } else if (err.code === -32002) {
        msg = "A connection petition is already waiting in MetaMask. Check your plug-in alerts for a pending link.";
      }
      setWalletError(msg);
      onLogActivity(`Wallet connection failed: ${msg.slice(0, 45)}...`);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleSimulateWallet = () => {
    const mockAddress = "0x7a8Bf8e569F1B2cE9eF3323055998a1C2Ea13F59";
    handleInputChange('walletAddress', mockAddress);
    setWalletError(null);
    onLogActivity(`Simulated wallet association connected with mock address: ${mockAddress}`);
  };

  const handleDisconnectWallet = () => {
    handleInputChange('walletAddress', '');
    setWalletError(null);
    onLogActivity("Web3 wallet identity connection revoked.");
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    const updated = { ...profile, [field]: value };
    onChangeProfile(updated);
  };

  const handleToggleInterest = (interest: string) => {
    let updatedInterests = [...profile.interests];
    if (updatedInterests.includes(interest)) {
      updatedInterests = updatedInterests.filter(i => i !== interest);
    } else {
      updatedInterests.push(interest);
    }
    onChangeProfile({ ...profile, interests: updatedInterests });
    onLogActivity(`Updated interest tags: ${interest}`);
  };

  const handleSimulateGPS = () => {
    setIsLocating(true);
    onLogActivity("Requested GPS Geolocation positioning...");
    setTimeout(() => {
      setIsLocating(false);
      onChangeProfile({
        ...profile,
        location: "Machakos County, Kenya (GSM Tower Sim)"
      });
      onLogActivity("GPS successfully matched tower coordinate to Machakos County, Kenya");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="p-2.5 bg-teal-50 rounded-lg text-teal-600">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold font-display text-slate-800">Configure Demographic Preferences</h2>
            <p className="text-xs text-slate-500">
              Customize your profile metadata below. RootAI uses this context to automatically tailor its answers and suggested links.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" /> Full Name / Alias
            </label>
            <input
              id="profile-name-input"
              type="text"
              value={profile.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-sans"
              placeholder="e.g. Kwame Mensah"
            />
          </div>

          {/* Role Choice */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Primary Occupation
            </label>
            <select
              id="profile-role-select"
              value={profile.role}
              onChange={(e) => handleInputChange('role', e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-sans"
            >
              <option value="student">🎓 Higher Ed Student</option>
              <option value="job_seeker">💼 Young Job Seeker</option>
              <option value="farmer">🌾 Smallholder Farmer / Agronomist</option>
              <option value="small_business_owner">🔌 Small Business Owner (SME)</option>
              <option value="artisan">🛠️ Local Artisan / Welder / Carpenter</option>
              <option value="parent">🏡 Parent / Community Organiser</option>
              <option value="entrepreneur">⚡ Tech Founder / Entrepreneur</option>
              <option value="other">💬 Other / Generative Tester</option>
            </select>
          </div>

          {/* Location Lookup */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Geographic Region
              </span>
              <button
                id="profile-gps-btn"
                onClick={handleSimulateGPS}
                type="button"
                className="text-[10px] text-teal-600 hover:underline font-mono font-bold"
              >
                {isLocating ? "Locating..." : "📍 Request GPS / Cellular Link"}
              </button>
            </label>
            <input
              id="profile-location-input"
              type="text"
              value={profile.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-sans"
              placeholder="e.g. Nairobi, Kenya"
            />
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-slate-400" /> Assistant Response Language
            </label>
            <select
              id="profile-lang-select"
              value={profile.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-sans"
            >
              <option value="en">English (All countries)</option>
              <option value="sw">Kiswahili (East African Context)</option>
              <option value="fr">French (West African Context)</option>
              <option value="yo">Yoruba (Nigeria Local)</option>
              <option value="ha">Hausa (Ghana/Nigeria/Niger)</option>
            </select>
            <span className="text-[10px] text-slate-400 italic mt-1 block">
              Gemini translates or adapts agricultural terms based on this.
            </span>
          </div>
        </div>

        {/* Interests Selector */}
        <div className="border-t border-slate-100 pt-5">
          <h3 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider mb-2 flex items-center gap-1">
            <CheckSquare className="w-4 h-4 text-teal-600" /> Focus Topics of Interest
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Select one or more topics. When the AI assists, it weights matches tagged under these headings first.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {INTEREST_TAGS.map((tag) => {
              const isSelected = profile.interests.includes(tag);
              return (
                <button
                  key={tag}
                  id={`tag-btn-${tag.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => handleToggleInterest(tag)}
                  className={`text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'bg-teal-50/50 border-teal-200 text-teal-900 font-medium' 
                      : 'bg-slate-50/30 hover:bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span>{tag}</span>
                  <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all ${
                    isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-slate-300'
                  }`}>
                    {isSelected && <span className="text-[10px]">&check;</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Integration readiness visual indicator */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-amber-900 font-display flex items-center gap-1.5 mb-1">
          <Sparkles className="w-4 h-4 text-brand-amber animate-spin" /> Custom Grounding Payload Verified
        </h4>
        <p className="text-xs text-amber-800 leading-relaxed">
          Your profile context constitutes a structured JSON block sent alongside your text inputs to the backend. In physical deployment, this profile maps seamlessly to your WhatsApp sender business ID (WA_ID) or SMS cellular header, allowing instant recall without repeating credentials.
        </p>
        <div className="mt-3 p-3 bg-white/70 rounded-lg text-[10px] font-mono text-slate-600 border border-amber-100 overflow-x-auto">
          {`{
  "user_phone_wa_id": "RECALLED_FROM_SESSION_METADATA",
  "name": "${profile.name || 'Anonymous'}",
  "demographics": {
    "occupation": "${profile.role}",
    "location": "${profile.location}",
    "iso_lang_preference": "${profile.language}"
  },
  "blockchain_context": {
    "wallet_address": "${profile.walletAddress || 'NOT_CONNECTED'}"
  },
  "interests_array_size": ${profile.interests.length}
}`}
        </div>
      </div>

      {/* Web3 Wallet Association (MetaMask integration) */}
      <div id="metamask-wallet-card" className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold font-display text-slate-800">Web3 Crop Grant & Micropayment Wallet</h2>
            <p className="text-xs text-slate-500">
              Link your MetaMask wallet to receive international stablecoin crop grants, micro-funding, and authenticated developer credential badges.
            </p>
          </div>
        </div>

        {profile.walletAddress ? (
          /* Wallet is Connected view state */
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4.5 space-y-3.5 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block font-mono">
                    🟢 Wallet Active & Linked
                  </span>
                  <code className="text-xs font-mono font-bold text-slate-700 bg-white/80 border border-emerald-100 px-2 py-0.5 rounded-md block mt-0.5 break-all text-ellipsis overflow-hidden">
                    {profile.walletAddress}
                  </code>
                </div>
              </div>
              <button
                id="profile-disconnect-wallet-btn"
                onClick={handleDisconnectWallet}
                className="px-3.5 py-1.5 bg-slate-200/80 hover:bg-slate-300 hover:text-slate-950 text-slate-700 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap"
              >
                Disconnect
              </button>
            </div>

            <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
              We have associated the address <strong className="text-emerald-800 font-mono text-[10.5px] bg-emerald-100/50 px-1 py-0.2 rounded">{profile.walletAddress.slice(0, 10)}...{profile.walletAddress.slice(-8)}</strong> with your active demographic file. RootAI can now auto-query blockchain certificate registers.
            </p>
          </div>
        ) : (
          /* Wallet NOT Connected view state */
          <div className="space-y-3.5">
            {walletError && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-2.5 animate-fade-in text-rose-800 text-xs">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block font-bold text-rose-950">Wallet Association Error</strong>
                  <p className="leading-relaxed text-slate-700">{walletError}</p>
                  
                  {isIframe && (
                    <div className="mt-2 text-[10.5px] bg-white border border-rose-100 p-2.5 rounded-lg text-slate-600 leading-relaxed space-y-1.5">
                      <span className="font-bold text-rose-700 block">💡 Why did this happen?</span>
                      <p>
                        You are in our sandboxed Applet iframe preview mode. Sandbox constraints prevent standard browser extensions like MetaMask from injecting variables (`window.ethereum`) safely.
                      </p>
                      <p className="font-semibold text-rose-800 font-sans">
                        Use the <strong className="font-extrabold text-rose-950">"Open App in New Tab"</strong> option in your developer workspace to test the real MetaMask popup integration in a standalone browser context!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="profile-connect-wallet-btn"
                onClick={handleConnectWallet}
                disabled={isConnectingWallet}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-3xs cursor-pointer select-none"
              >
                <Wallet className="w-4 h-4" />
                {isConnectingWallet ? "Confirming in MetaMask..." : "Connect MetaMask Wallet"}
              </button>

              {/* Simulation fallback for testability inside sandboxed frames */}
              <button
                id="profile-simulate-wallet-btn"
                onClick={handleSimulateWallet}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap"
                title="Bypass iframe injection security blocks for preview purposes"
              >
                Simulate Secure Link
              </button>
            </div>

            <div className="text-[10.5px] text-slate-400 bg-slate-50 border border-slate-150 p-3 rounded-xl leading-relaxed">
              🔐 <strong>Non-Custodial Design</strong>: MetaMask connection processes entirely client-side. We never transmit your private keys or request token spending permissions. Safe, audited, open-ledger connection only.
            </div>
          </div>
        )}
      </div>

      {/* Developer Contact Card specifically targeting the user prompt request */}
      <div id="profile-contact-developer-card" className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-slate-800 rounded-xl text-emerald-400 border border-slate-700 shrink-0">
            <Linkedin className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold font-display text-white">Let's Connect on LinkedIn!</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans mt-0.5">
              RootAI Community Assistant is designed and maintained by <strong className="text-emerald-400">Musa Baba Kamfani</strong>. Let's collaborate or deploy high-performance AI services for our local communities.
            </p>
          </div>
        </div>
        <a 
          href="https://www.linkedin.com/in/musa-baba-kamfani-765557198" 
          target="_blank" 
          rel="noopener noreferrer" 
          id="profile-linkedin-connect-btn"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0 uppercase tracking-wider font-sans cursor-pointer"
        >
          <span>Connect via LinkedIn</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
