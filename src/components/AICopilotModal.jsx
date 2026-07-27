import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, Loader2, Lightbulb, Zap, HelpCircle } from 'lucide-react';
import { analyzeProductivityWithGroq } from '../services/groqAI';

export default function AICopilotModal({ isOpen, onClose, analytics }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your AI Productivity Copilot powered by Groq Llama 3.3. I have analyzed your recent calendar events and time logs. How can I help optimize your schedule today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "Analyze my biggest time sinks this week",
    "How can I reach an 80%+ Productivity Score?",
    "Suggest 3 new keyword rules based on my logs",
    "What hours am I most productive during the day?"
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
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col h-[650px] max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-sm">Groq AI Productivity Architect</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100">
                  Llama 3.3 70B
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Real-time schedule analysis & smart optimization</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center space-x-2 overflow-x-auto text-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200/80 rounded-full font-semibold whitespace-nowrap transition-colors flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
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
                    : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60 font-normal whitespace-pre-wrap'
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
                <span>Groq AI is analyzing your calendar & productivity metrics...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask Groq AI to analyze or adjust your schedule..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium outline-none focus:bg-white focus:border-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
