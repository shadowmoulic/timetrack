import React, { useState } from 'react';
import { Bot, Send, Sparkles, Loader2, Zap, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { analyzeProductivityWithGroq } from '../services/groqAI';

export default function AICopilotPage({ analytics }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to your Groq AI Productivity Copilot! I have analyzed your calendar events, peak focus hours (9:30 AM - 12:30 PM & 5:30 PM - 7:00 PM), category breakdown, and distraction metrics. What would you like to optimize today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    "What are my most productive hours during the day?",
    "Analyze my top time sinks & distractions",
    "How can I reach an 80%+ Productivity Score?",
    "Generate 3 new keyword rules based on my schedule"
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const newMsg = { role: 'user', content: query.trim() };
    setMessages(prev => [...prev, newMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await analyzeProductivityWithGroq(query.trim(), analytics || {});
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message || 'Failed to connect to Groq AI.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> Groq AI Architect
            </span>
            <span className="text-xs font-semibold text-slate-400">Llama 3.3 70B Versatile</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            AI Productivity Copilot
          </h1>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Real-time Schedule Intelligence</span>
        </div>
      </div>

      {/* Main Workspace Grid: Suggestions Side Bar (4 Cols) + Chat Interface (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Quick Insight Prompts (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Recommended Prompts</span>
            </div>

            <div className="space-y-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-200 text-slate-800 border border-slate-200/60 rounded-xl text-xs font-semibold transition-all group flex items-start space-x-2"
                >
                  <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                  <span className="flex-1">{prompt}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Context & Peak Productivity
            </div>
            <div className="space-y-2 text-xs text-slate-600 font-medium">
              <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl flex items-center space-x-2">
                <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Peak Hours: 09:30 AM - 12:30 PM & 05:30 PM - 07:00 PM</span>
              </div>
              <div className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-800 rounded-xl flex items-center space-x-2">
                <Clock className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Focus Score: {analytics.productivityScore || 0}% Target 75%+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Chat Container (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col h-[580px] overflow-hidden">
          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-slate-900 text-white rounded-br-none font-medium'
                      : 'bg-slate-50 text-slate-800 rounded-bl-none border border-slate-200/70 font-normal whitespace-pre-wrap'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-slate-500 flex items-center space-x-2 border border-slate-200/60">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>Groq AI is analyzing your calendar metrics...</span>
                </div>
              </div>
            )}
          </div>

          {/* Form Input Bar */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Ask Groq AI to analyze your peak hours or optimize your schedule..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium outline-none focus:bg-white focus:border-indigo-500 transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
