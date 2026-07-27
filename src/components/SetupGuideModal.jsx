import React from 'react';
import { X, HelpCircle, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { DEFAULT_CLIENT_ID } from '../config';

export default function SetupGuideModal({ isOpen, onClose, clientId, onToast }) {
  if (!isOpen) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    if (onToast) onToast('Copied to clipboard!', 'success');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Google Cloud Setup Guide</h3>
              <p className="text-xs text-slate-400 font-medium">OAuth 2.0 Client ID configuration steps</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-slate-800 text-xs">
          {/* Active Credentials Summary Box */}
          <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-900">Pre-Configured Client ID:</span>
              <button 
                onClick={() => copyToClipboard(clientId || DEFAULT_CLIENT_ID)}
                className="px-2.5 py-1 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-lg text-[11px] font-bold flex items-center space-x-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copy ID</span>
              </button>
            </div>
            <div className="bg-slate-900 text-cyan-400 p-2.5 rounded-lg font-mono text-[11px] break-all">
              {clientId || DEFAULT_CLIENT_ID}
            </div>
          </div>

          {/* Step 1 */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <div className="flex items-center space-x-2 font-bold text-slate-900">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Open Google Cloud Console & Create Project</span>
            </div>
            <p className="text-slate-500 pl-7">
              Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline inline-flex items-center gap-1">Google Cloud Console <ExternalLink className="w-3 h-3" /></a> and create a project named <strong>TimeTrack</strong>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <div className="flex items-center space-x-2 font-bold text-slate-900">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Enable Google Calendar API</span>
            </div>
            <p className="text-slate-500 pl-7">
              Go to <strong>APIs & Services → Library</strong>, search for <code>Google Calendar API</code>, and click <strong>Enable</strong>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <div className="flex items-center space-x-2 font-bold text-slate-900">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
              <span>Set Authorized JavaScript Origins</span>
            </div>
            <p className="text-slate-500 pl-7 mb-2">
              Under <strong>Credentials → OAuth 2.0 Client ID</strong>, add your web application origins:
            </p>
            <div className="pl-7 space-y-1.5">
              <div className="bg-slate-900 text-cyan-400 p-2 rounded-lg font-mono text-[11px] flex justify-between items-center">
                <span>https://timetrack-sayak.vercel.app</span>
                <button onClick={() => copyToClipboard("https://timetrack-sayak.vercel.app")} className="text-slate-400 hover:text-white"><Copy className="w-3.5 h-3.5" /></button>
              </div>
              <div className="bg-slate-900 text-cyan-400 p-2 rounded-lg font-mono text-[11px] flex justify-between items-center">
                <span>http://localhost:5173</span>
                <button onClick={() => copyToClipboard("http://localhost:5173")} className="text-slate-400 hover:text-white"><Copy className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>

          <div className="pt-2 text-right">
            <button 
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center space-x-1.5"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Understood</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
