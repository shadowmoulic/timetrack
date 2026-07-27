import React, { useState, useEffect } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  BarChart3, 
  Target, 
  Calendar, 
  Plus, 
  RefreshCw, 
  Settings, 
  HelpCircle, 
  Tag, 
  Sparkles,
  X
} from 'lucide-react';

export default function CommandPaletteModal({
  isOpen,
  onClose,
  onNavigate,
  onOpenManual,
  onSyncGoogle,
  onToggleMode,
  mode,
  onOpenRules,
  onOpenSettings
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'nav-dashboard',
      title: 'Go to Dashboard Overview',
      category: 'Navigation',
      icon: LayoutDashboard,
      shortcut: 'G D',
      action: () => { onNavigate('dashboard'); onClose(); }
    },
    {
      id: 'nav-focus',
      title: 'Go to Focus Workspace & Pomodoro',
      category: 'Navigation',
      icon: Target,
      shortcut: 'G F',
      action: () => { onNavigate('focus'); onClose(); }
    },
    {
      id: 'nav-analytics',
      title: 'Go to Analytics & Trends',
      category: 'Navigation',
      icon: BarChart3,
      shortcut: 'G A',
      action: () => { onNavigate('analytics'); onClose(); }
    },
    {
      id: 'nav-events',
      title: 'Go to Daily Agenda',
      category: 'Navigation',
      icon: Calendar,
      shortcut: 'G E',
      action: () => { onNavigate('events'); onClose(); }
    },
    {
      id: 'action-add',
      title: 'Log New Time Entry',
      category: 'Actions',
      icon: Plus,
      shortcut: 'N',
      action: () => { onOpenManual(); onClose(); }
    },
    {
      id: 'action-sync',
      title: 'Sync Google Calendar',
      category: 'Actions',
      icon: RefreshCw,
      action: () => { onSyncGoogle(); onClose(); }
    },
    {
      id: 'action-mode',
      title: `Switch to ${mode === 'demo' ? 'Live Google Sync' : 'Demo Mode'}`,
      category: 'Preferences',
      icon: Sparkles,
      action: () => { onToggleMode(); onClose(); }
    },
    {
      id: 'action-rules',
      title: 'Manage Keyword Rules & Categories',
      category: 'Preferences',
      icon: Tag,
      action: () => { onOpenRules(); onClose(); }
    },
    {
      id: 'action-settings',
      title: 'Open Application Settings',
      category: 'Preferences',
      icon: Settings,
      action: () => { onOpenSettings(); onClose(); }
    }
  ];

  const filteredCommands = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[2000] flex items-start justify-center pt-24 px-4">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm outline-none font-medium"
            autoFocus
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map(cmd => {
              const IconComp = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-slate-100/80 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 text-slate-600 flex items-center justify-center transition-colors">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                        {cmd.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {cmd.category}
                      </div>
                    </div>
                  </div>

                  {cmd.shortcut && (
                    <span className="text-[11px] font-mono font-medium text-slate-400 bg-slate-100 group-hover:bg-slate-200/80 px-2 py-0.5 rounded-md">
                      {cmd.shortcut}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center space-x-3">
            <span><kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">↵</kbd> select</span>
          </div>
          <span><kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
