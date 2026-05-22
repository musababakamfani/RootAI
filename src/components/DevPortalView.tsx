import React, { useState } from 'react';
import { 
  Database, 
  Terminal, 
  RefreshCw, 
  Check, 
  Send, 
  Cpu, 
  GitBranch, 
  MessageSquareCode, 
  Layers,
  ArrowRight,
  Smartphone,
  Server
} from 'lucide-react';
import { ROOTAI_SCHEMA, ROOTAI_API_ENDPOINTS } from '../data';
import { SchemaTable, ApiEndpoint } from '../types';

export default function DevPortalView() {
  const [activeSchema, setActiveSchema] = useState<string>(ROOTAI_SCHEMA[0].name);
  const [selectedApi, setSelectedApi] = useState<ApiEndpoint>(ROOTAI_API_ENDPOINTS[0]);
  
  // Custom API Test Input
  const [apiInput, setApiInput] = useState<string>(selectedApi.requestExample);
  const [apiOutput, setApiOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<string | null>(null);

  const activeTable = ROOTAI_SCHEMA.find(t => t.name === activeSchema) || ROOTAI_SCHEMA[0];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(label);
    setTimeout(() => setIsCopied(null), 1500);
  };

  const handleApiChange = (api: ApiEndpoint) => {
    setSelectedApi(api);
    setApiInput(api.requestExample);
    setApiOutput('');
  };

  const triggerSimulatedCall = async () => {
    setIsLoading(true);
    setApiOutput('');
    try {
      // Parse custom typed inputs safely or default to raw
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(apiInput);
      } catch (e) {
        parsedPayload = { error: "Invalid JSON input", raw: apiInput };
      }

      const response = await fetch(selectedApi.path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedPayload)
      });

      const data = await response.json();
      setApiOutput(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiOutput(JSON.stringify({
        status: "simulated_error",
        error: "Sandbox Endpoint Failure",
        message: err?.message || "Failed to dispatch request to Express server."
      }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  // SQL Schema generation block
  const getSqlSchema = (table: SchemaTable) => {
    const cols = table.columns.map(c => {
      return `  ${c.name.padEnd(16)} ${c.type}${c.constraints ? ' ' + c.constraints : ''}`;
    }).join(',\n');
    return `CREATE TABLE ${table.name} (\n${cols}\n);`;
  };

  return (
    <div className="space-y-6">
      {/* Intro Portal Banner */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 shadow-md">
        <h2 className="text-base font-semibold font-display text-emerald-400 flex items-center gap-2 mb-1">
          <Cpu className="w-5 h-5 text-emerald-400" /> RootAI Developer Integration & Sandbox
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          Review the system integration specs. RootAI is engineered to match relational database layouts and receive low-bandwidth carrier webhooks. Test active APIs in the live sandbox below.
        </p>
      </div>

      {/* Visual System Architecture Diagram */}
      <div className="bg-white p-5 rounded-xl border border-slate-100">
        <h3 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider mb-4 flex items-center gap-1.5">
          <GitBranch className="w-4 h-4 text-teal-600" /> SMS / WhatsApp Low-Bandwidth Gateway Flowchart
        </h3>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 px-1 text-xs">
          {/* Node 1 */}
          <div className="flex flex-col items-center p-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 w-full md:w-36 text-center">
            <Smartphone className="w-6 h-6 text-slate-600 mb-1" />
            <span className="font-semibold block">User Handset</span>
            <span className="text-[10px] text-slate-500">Low-cost phone<br />(SMS / WhatsApp)</span>
          </div>
          
          <ArrowRight className="w-4 h-4 text-slate-300 hidden md:block rotate-90 md:rotate-0" />
          
          {/* Node 2 */}
          <div className="flex flex-col items-center p-3 border border-slate-200 rounded-lg bg-emerald-50 text-emerald-800 w-full md:w-44 text-center">
            <Smartphone className="w-6 h-6 text-emerald-600 mb-1" />
            <span className="font-semibold block">Carrier Gateways</span>
            <span className="text-[10px] text-slate-500">Africa's Talking / Twilio<br />Shortcode HTTP Push</span>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-300 hidden md:block rotate-90 md:rotate-0" />

          {/* Node 3 */}
          <div className="flex flex-col items-center p-3 border border-teal-200 bg-teal-50/50 text-teal-900 w-full md:w-48 text-center relative">
            <Server className="w-6 h-6 text-teal-600 mb-1" />
            <span className="font-semibold block">Express API Hub</span>
            <span className="text-[10px] text-slate-500">Node.js server.ts<br />Webhook processors</span>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-300 hidden md:block rotate-90 md:rotate-0" />

          {/* Node 4 */}
          <div className="flex flex-col items-center p-3 border border-purple-200 bg-purple-50 text-purple-900 w-full md:w-44 text-center">
            <Terminal className="w-6 h-6 text-purple-600 mb-1" />
            <span className="font-semibold block">Gemini 3.5 AI</span>
            <span className="text-[10px] text-slate-500">Google Search Grounding<br />& SMS summarizer</span>
          </div>
        </div>
      </div>

      {/* Relational Database Schemas Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-100 lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-teal-600" /> PostgreSQL / Supabase Schema Diagrams
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              RootAI persists accounts, historic queries and opportunity matches inside a relational database to enable instant USSD session recovery. Select tables below:
            </p>

            <div className="space-y-1.5">
              {ROOTAI_SCHEMA.map((table) => (
                <button
                  key={table.name}
                  id={`schema-btn-${table.name}`}
                  onClick={() => setActiveSchema(table.name)}
                  className={`w-full text-left p-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                    activeSchema === table.name 
                      ? 'bg-teal-50/70 border-teal-200 text-teal-900' 
                      : 'bg-slate-50/50 hover:bg-slate-100 border-slate-150 text-slate-600'
                  }`}
                >
                  <span className="font-mono">📂 tbl_{table.name}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                    {table.columns.length} cols
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-500">
            📌 <strong>Referential Integrity</strong>: cascades are mapped on user deletions to protect conversational storage footprints.
          </div>
        </div>

        {/* Column list and SQL Generator */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <h4 className="text-sm font-semibold font-display text-slate-800">
              Columns for <code className="text-teal-600 bg-slate-100 px-1.5 py-0.5 rounded text-xs">tbl_{activeTable.name}</code>
            </h4>
            <button
              id="copy-sql-btn"
              onClick={() => handleCopy(getSqlSchema(activeTable), 'sql')}
              className="text-xs text-teal-600 hover:underline font-mono"
            >
              {isCopied === 'sql' ? '✓ Copied SQL!' : 'Copy CREATE SQL'}
            </button>
          </div>

          <p className="text-xs text-slate-500 italic mt-0">{activeTable.description}</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-250 bg-slate-50 text-slate-500 font-mono">
                  <th className="py-2 px-2">Column</th>
                  <th className="py-2 px-2">Type</th>
                  <th className="py-2 px-2">Role & Rules</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeTable.columns.map((col) => (
                  <tr key={col.name} className="hover:bg-slate-50 font-sans">
                    <td className="py-2.5 px-2 font-mono text-slate-800 font-semibold">{col.name}</td>
                    <td className="py-2.5 px-2 text-slate-500 font-mono text-[11px]">{col.type}</td>
                    <td className="py-2.5 px-2 text-slate-600 font-mono text-[11px]">
                      {col.description}
                      {col.constraints && (
                        <span className="block text-[9px] text-orange-600 font-bold uppercase mt-0.5">
                          {col.constraints}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Live Sandbox Interactive Call Simulator */}
      <div className="bg-white p-5 rounded-xl border border-slate-100">
        <h3 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-emerald-600" /> Live Webhook & Client Request Simulator Sandbox
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Select an API to inspect. You can modify the JSON payload body in real-time, then fire it into the live running server to look at the exact formatted response.
        </p>

        {/* Endpoint Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3 mb-4">
          {ROOTAI_API_ENDPOINTS.map((endpoint) => (
            <button
              key={endpoint.name}
              id={`api-tab-${endpoint.name.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => handleApiChange(endpoint)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                selectedApi.name === endpoint.name 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-150 border border-slate-100'
              }`}
            >
              {endpoint.method} {endpoint.path}
            </button>
          ))}
        </div>

        {/* Live Simulator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Request Header */}
          <div className="space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Request Payload Body</span>
              <textarea
                id="sandbox-payload-textarea"
                rows={11}
                value={apiInput}
                onChange={(e) => setApiInput(e.target.value)}
                className="w-full bg-slate-900 text-slate-100 font-mono text-xs p-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner"
              />
            </div>
            
            <button
              id="sandbox-dispatch-btn"
              onClick={triggerSimulatedCall}
              disabled={isLoading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Fetching Endpoint Output...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Fire Simulated Call to Express Backend
                </>
              )}
            </button>
          </div>

          {/* Response Panel output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Response JSON</span>
              {apiOutput && (
                <button
                  id="copy-response-btn"
                  onClick={() => handleCopy(apiOutput, 'resp')}
                  className="text-[10px] text-teal-600 hover:underline inline-block font-mono"
                >
                  {isCopied === 'resp' ? '✓ Copied' : 'Copy Response'}
                </button>
              )}
            </div>

            <div className={`w-full min-h-[250px] bg-slate-950 text-slate-200 font-mono text-xs p-4 rounded-xl border border-slate-900 overflow-auto scroll-smooth custom-scrollbar relative ${isLoading ? 'opacity-50' : ''}`}>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40">
                  <span className="text-xs bg-slate-800 p-2 text-emerald-400 font-semibold rounded-lg shadow-md flex items-center gap-1.5 animate-pulse border border-emerald-500/20">
                    <Send className="w-4 h-4 text-emerald-500" /> Transacting event packets...
                  </span>
                </div>
              )}
              {apiOutput ? (
                <pre>{apiOutput}</pre>
              ) : (
                <div className="text-slate-500 italic h-full flex flex-col items-center justify-center py-16">
                  <Terminal className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-[10px]">Ready for client dispatch request. Tap compile and test above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
