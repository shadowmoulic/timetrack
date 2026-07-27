import React, { useState } from 'react';
import { X, Settings, Key, RotateCcw, Save } from 'lucide-react';
import { DEFAULT_CLIENT_ID } from '../config';

export default function SettingsModal({
  isOpen,
  onClose,
  clientId,
  onSaveClientId,
  onResetDefaults,
  onToast
}) {
  const [inputClientId, setInputClientId] = useState(clientId || DEFAULT_CLIENT_ID);
  const [groqKeyInput, setGroqKeyInput] = useState(() => localStorage.getItem('timetrack_groq_key') || '');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (inputClientId.trim()) {
      onSaveClientId(inputClientId.trim());
    }
    if (groqKeyInput.trim()) {
      localStorage.setItem('timetrack_groq_key', groqKeyInput.trim());
    }
    if (onToast) onToast('Settings saved successfully!', 'success');
    onClose();
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all rules and restore default settings?")) {
      onResetDefaults();
      setInputClientId(DEFAULT_CLIENT_ID);
      if (onToast) onToast('Reset to default configuration.', 'info');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Application Settings</h3>
              <p className="text-xs text-slate-400 font-medium">Manage API credentials & configuration</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                <span>Google OAuth Client ID</span>
              </label>
              <input
                type="text"
                value={inputClientId}
                onChange={(e) => setInputClientId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-indigo-500 transition-all"
                placeholder="xxxxxx.apps.googleusercontent.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                <span>Groq AI API Key</span>
              </label>
              <input
                type="password"
                value={groqKeyInput}
                onChange={(e) => setGroqKeyInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-indigo-500 transition-all font-mono"
                placeholder="gsk_..."
              />
              <span className="text-[11px] text-slate-400 font-medium block">
                Used to power the AI Productivity Copilot.
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={handleReset}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <div className="flex items-center space-x-2">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
