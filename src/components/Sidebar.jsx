import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Target, 
  BarChart3, 
  Calendar, 
  Tag, 
  Settings, 
  HelpCircle, 
  Search, 
  LogOut, 
  LogIn, 
  User, 
  Sparkles,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  mode,
  setMode,
  isAuthenticated,
  userEmail,
  onGoogleSignIn,
  onGoogleSignOut,
  onOpenGuide,
  onOpenSettings,
  onOpenCommandPalette
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header (Only visible on screens smaller than md / 768px) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-40 w-full">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
            T
          </div>
          <span className="font-bold text-slate-900 text-sm">TimeTrack</span>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={onOpenCommandPalette}
            className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
            title="Command Palette (⌘K)"
          >
            <Search className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Backdrop overlay for Mobile Drawer */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-45"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Content (Desktop Sticky + Mobile Off-Canvas Drawer) */}
      <aside className={`
        fixed md:sticky top-0 left-0 bottom-0 z-50
        w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 flex-shrink-0 h-screen
        transition-transform duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Workspace Brand Header */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100/70 transition-colors cursor-pointer group">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shadow-indigo-200">
                T
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 tracking-tight">TimeTrack</div>
                <div className="text-xs text-slate-400 font-medium">Personal Workspace</div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>

          {/* Command Palette Trigger */}
          <button 
            onClick={() => { onOpenCommandPalette(); setMobileOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200/70 rounded-xl text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-100/60 transition-all group"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
              <span className="text-xs font-semibold">Search or command...</span>
            </div>
            <kbd className="font-mono text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-2 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Workspace
            </div>

            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center space-x-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              {activeTab !== 'dashboard' && <span className="text-[10px] font-mono text-slate-400">⌘1</span>}
            </button>

            <button
              onClick={() => handleNavClick('focus')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'focus'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Target className="w-4 h-4 text-indigo-500" />
                <span>Focus Workspace</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-600 rounded-md">NEW</span>
            </button>

            <button
              onClick={() => handleNavClick('analytics')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics & Deep Dive</span>
              </div>
              {activeTab !== 'analytics' && <span className="text-[10px] font-mono text-slate-400">⌘3</span>}
            </button>

            <button
              onClick={() => handleNavClick('events')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'events'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4" />
                <span>Daily Agenda</span>
              </div>
              {activeTab !== 'events' && <span className="text-[10px] font-mono text-slate-400">⌘4</span>}
            </button>
          </nav>
        </div>

        {/* Footer Settings & Account */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          {/* Sync Mode Toggle */}
          <button
            onClick={() => setMode(mode === 'demo' ? 'live' : 'demo')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              mode === 'demo'
                ? 'bg-amber-50/60 border-amber-200/80 text-amber-700 hover:bg-amber-100/70'
                : 'bg-emerald-50/60 border-emerald-200/80 text-emerald-700 hover:bg-emerald-100/70'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{mode === 'demo' ? 'Demo Mode' : 'Live Google Sync'}</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
          </button>

          {/* Utility Buttons */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => { onOpenGuide(); setMobileOpen(false); }}
              className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/70 rounded-lg text-xs font-semibold transition-colors"
              title="OAuth Setup Guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Guide</span>
            </button>
            <button 
              onClick={() => { onOpenSettings(); setMobileOpen(false); }}
              className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/70 rounded-lg text-xs font-semibold transition-colors"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>

          {/* Account Profile */}
          <div>
            {isAuthenticated ? (
              <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200/70 rounded-xl">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 truncate max-w-[110px]" title={userEmail}>
                    {userEmail || 'Connected'}
                  </span>
                </div>
                <button 
                  onClick={onGoogleSignOut}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onGoogleSignIn}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Connect Google</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
