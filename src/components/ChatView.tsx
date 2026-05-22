import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff,
  User, 
  Smartphone, 
  Rss, 
  Layers, 
  CornerDownLeft,
  Sparkles,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { ChatMessage, UserProfile, GroundingChunk } from '../types';
import { SUGGESTED_PROMPTS } from '../data';

interface ChatViewProps {
  messages: ChatMessage[];
  profile: UserProfile;
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
}

// Custom simple parser to render basic bold and list markdown elements
function renderFormattedText(text: string) {
  if (!text) return null;
  
  // Split message by lines
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let cleanLine = line;
    
    // Check if line is a bullet
    const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
    if (isBullet) {
      cleanLine = line.substring(line.indexOf('*') !== -1 ? line.indexOf('*') + 2 : line.indexOf('-') + 2);
    }
    
    // Check if line is a numbered list
    const numRegex = /^(\d+)\.\s(.*)/;
    const matchNum = numRegex.exec(line.trim());
    
    // Format bold text **xyz** to strong elements inside lines
    const parts = cleanLine.split('**');
    const lineContent = parts.map((part, pIdx) => {
      if (pIdx % 2 === 1) {
        return <strong key={pIdx} className="font-bold text-slate-900">{part}</strong>;
      }
      return part;
    });

    if (isBullet) {
      return (
        <li key={idx} className="ml-4 list-disc pl-1 mb-1 text-xs leading-relaxed text-slate-700 font-sans">
          {lineContent}
        </li>
      );
    }

    if (matchNum) {
      const num = matchNum[1];
      const rest = matchNum[2];
      const restParts = rest.split('**').map((part, pIdx) => {
        if (pIdx % 2 === 1) {
          return <strong key={pIdx} className="font-bold text-slate-900">{part}</strong>;
        }
        return part;
      });
      return (
        <div key={idx} className="flex gap-1.5 pl-1 mb-1 text-xs leading-relaxed text-slate-700 font-sans">
          <span className="font-bold text-teal-700 shrink-0">{num}.</span>
          <span>{restParts}</span>
        </div>
      );
    }

    // Standard headers
    if (line.trim().startsWith('###')) {
      return (
        <h4 key={idx} className="text-xs font-bold text-slate-900 uppercase tracking-wider mt-3 mb-1 font-display">
          {cleanLine.replace('###', '').trim()}
        </h4>
      );
    }
    if (line.trim().startsWith('##')) {
      return (
        <h3 key={idx} className="text-sm font-semibold text-slate-900 mt-4 mb-1.5 border-b border-slate-100 pb-0.5 font-display">
          {cleanLine.replace('##', '').trim()}
        </h3>
      );
    }

    return (
      <p key={idx} className="text-xs text-slate-700 leading-relaxed font-sans min-h-[0.5rem] mb-2">
        {lineContent}
      </p>
    );
  });
}

export default function ChatView({
  messages,
  profile,
  isLoading,
  onSendMessage,
  onClearHistory
}: ChatViewProps) {
  const [typedMessage, setTypedMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || isLoading) return;
    onSendMessage(typedMessage);
    setTypedMessage('');
  };

  const triggerVoiceSimulation = () => {
    if (isRecording || isLoading) return;
    setIsRecording(true);
    setVoiceStatus('Listening to voice input...');
    
    // Simulate audio recognition workflow customized to user's parameters
    setTimeout(() => {
      setVoiceStatus('Decoding cellular GSM audio packet...');
    }, 1500);

    setTimeout(() => {
      setVoiceStatus('Structuring transcript text...');
    }, 2800);

    setTimeout(() => {
      setIsRecording(false);
      setVoiceStatus('');

      // Choose mock query based on user's selected role
      let dictatedQuery = "What are the latest funding and training opportunities for school graduates near me?";
      if (profile.role === 'farmer') {
        dictatedQuery = "My maize stalks are drying up with white fungal dust. What biological solutions can I execute in Nairobi?";
      } else if (profile.role === 'small_business_owner' || profile.role === 'entrepreneur') {
        dictatedQuery = "Can you help me design a low-investment calculation template for solar juice kiosks in our localized pricing market?";
      } else if (profile.role === 'parent') {
        dictatedQuery = "Show me maternal clinic contacts and vaccination programs that operate free Thursdays near my location.";
      }
      onSendMessage(dictatedQuery);
    }, 4000);
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden relative shadow-sm">
      
      {/* Header Info Ribbon */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-teal-100 flex items-center justify-center font-display font-black text-sm tracking-tighter">
            R
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800 font-display">RootAI WhatsApp Assister</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Live"></span>
            </div>
            <p className="text-[10px] text-slate-500">
              Adapting support for <strong className="text-teal-700">{profile.name || 'Anonymous'}</strong> in <strong className="text-slate-600 font-medium">{profile.location || 'Africa'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 1 && (
            <button
              id="clear-chat-btn"
              onClick={onClearHistory}
              className="text-[10px] text-slate-450 hover:text-slate-750 font-semibold px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
            >
              Reset Chat
            </button>
          )}
          <span className="text-[10px] uppercase font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
            WhatsApp Mode
          </span>
        </div>
      </div>

      {/* Messages Scroll Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={msg.id} 
              className={`flex items-start gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar circle */}
              <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] uppercase font-mono ${
                isUser 
                  ? 'bg-amber-100 text-amber-800 font-bold border border-amber-200' 
                  : 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-200'
              }`}>
                {isUser ? <User className="w-3.5 h-3.5" /> : 'R'}
              </div>

              <div className="space-y-1 max-w-full">
                {/* Chat bubble body */}
                <div className={`p-3.5 rounded-2xl shadow-2xs text-xs leading-relaxed ${
                  isUser 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 rounded-tl-none text-slate-800'
                }`}>
                  {isUser ? (
                    <p className="font-sans whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="space-y-2">
                      {renderFormattedText(msg.text)}
                    </div>
                  )}
                </div>

                {/* Dynamic trust indicators directly visible. Satisfies "Confidence score" and "Human reviewed" badges */}
                {!isUser && (msg.confidenceScore || msg.isHumanReviewed) && (
                  <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-2.5 mt-2 space-y-1.5 text-[10px] text-slate-600 animate-fade-in">
                    {msg.isHumanReviewed && (
                      <div className="flex items-start gap-2">
                        <span className="inline-flex items-center gap-1 shrink-0 font-extrabold text-amber-800 bg-amber-100 border border-amber-250 px-1.5 py-0.5 rounded-md font-sans text-[8px] uppercase tracking-wider">
                          👥 Human Reviewed
                        </span>
                        <p className="text-slate-600 leading-normal text-[9px] font-sans">
                          {msg.humanReviewReason || 'Vetted by qualified Community Health & Agriculture extension coordinators.'}
                        </p>
                      </div>
                    )}
                    
                    {msg.confidenceScore && (
                      <div className="flex items-start gap-2 pt-1 border-t border-slate-200/50">
                        <span className="inline-flex items-center gap-1 shrink-0 font-extrabold text-teal-800 bg-teal-100 border border-teal-200 px-1.5 py-0.5 rounded-md font-mono text-[8px] uppercase tracking-wider">
                          🛡️ Confidence {msg.confidenceScore}%
                        </span>
                        <p className="text-slate-500 italic text-[9px] leading-normal font-sans">
                          {msg.confidenceExplanation || 'Assessed against direct verified database matches.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Citation links representation (only if assistant has googleSearch outputs) */}
                {!isUser && msg.groundingChunks && msg.groundingChunks.length > 0 && (
                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-2.5 mt-2 animate-fade-in space-y-1">
                    <span className="text-[9px] font-bold text-teal-800 uppercase tracking-widest block">
                      💡 Verified Citations Found:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.groundingChunks.map((chunk, itemIdx) => (
                        <a
                          key={itemIdx}
                          id={`citation-${msg.id}-${itemIdx}`}
                          href={chunk.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-teal-900 bg-white hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-teal-200 shadow-3xs transition-all font-semibold font-sans truncate max-w-[170px]"
                        >
                          {chunk.title} <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <span className={`block text-[9px] text-slate-400 mt-0.5 ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading shimmer placeholder */}
        {isLoading && (
          <div className="flex items-start gap-2.5 max-w-[70%]">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center font-bold font-mono text-[10px] text-emerald-800 animate-pulse border border-emerald-200">
              R
            </div>
            <div className="space-y-1.5 w-full">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none space-y-2 w-full shadow-2xs">
                <div className="h-3 w-4/12 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-3.5 w-11/12 bg-slate-50 rounded animate-pulse"></div>
                <div className="h-3 w-8/12 bg-slate-100 rounded animate-pulse"></div>
              </div>
              <span className="block text-[8px] text-slate-350 italic animate-pulse">
                Consulting agronomist and job database links...
              </span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested quick prompt slider tab */}
      {messages.length <= 1 && (
        <div className="px-4 py-3 bg-white border-t border-slate-200/60 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              id={`quick-add-p-${idx}`}
              onClick={() => onSendMessage(prompt.text)}
              className="inline-block bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-full px-3 py-1 text-xs text-slate-600 transition-all font-medium whitespace-nowrap cursor-pointer shrink-0"
            >
              {prompt.label}
            </button>
          ))}
        </div>
      )}

      {/* Voice Recorder Overlay */}
      {isRecording && (
        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-white z-25 select-none animate-fade-in px-4">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-red-400 voice-pulse-active mb-4 transform scale-110">
            <Mic className="w-7 h-7 text-white" />
          </div>
          <span className="text-sm font-semibold font-display tracking-tight text-red-400">{voiceStatus}</span>
          <p className="text-xs text-slate-400 text-center max-w-xs mt-2">
            Simulating high-quality local verbal compression gateway for telecom networks. Speaking transcript auto-loads in a moment!
          </p>
        </div>
      )}

      {/* Form Input Deck */}
      <form onSubmit={handleSubmit} className="bg-white border-t border-slate-200 p-3 flex items-center gap-2">
        <button
          id="btn-voice-input"
          type="button"
          onClick={triggerVoiceSimulation}
          className="p-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-xl transition duration-150 shrink-0 cursor-pointer"
          title="Speak in your language"
        >
          <Mic className="w-4.5 h-4.5" />
        </button>

        <input
          id="chat-input-field"
          type="text"
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-sans"
          placeholder={`Type message as ${profile.name || 'Anonymous'}...`}
        />

        <button
          id="chat-submit-btn"
          type="submit"
          disabled={!typedMessage.trim() || isLoading}
          className="p-2.5 bg-teal-600 hover:bg-teal-700 text-white disabled:bg-slate-100 disabled:text-slate-350 rounded-xl transition shrink-0 font-bold flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
}
