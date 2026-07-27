import React from 'react';
import { 
  BarChart2, 
  Clock, 
  Calendar, 
  Tag, 
  Settings, 
  HelpCircle, 
  LogOut, 
  LogIn, 
  User, 
  Layers, 
  Search,
  ChevronDown
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
  onOpenSettings
}) {
  return (
    <aside className="app-sidebar">
      {/* Workspace Header */}
      <div className="sidebar-workspace">
        <div className="workspace-avatar">S</div>
        <div className="workspace-info">
          <span className="workspace-name">Sayak's Workspace</span>
          <ChevronDown size={14} className="text-secondary" />
        </div>
      </div>

      {/* Quick Search */}
      <div className="sidebar-search">
        <Search size={14} className="search-icon" />
        <input type="text" placeholder="Search..." readOnly />
        <span className="search-shortcut">⌘K</span>
      </div>

      {/* Main Navigation Menu */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">ANALYSIS</div>
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart2 size={16} />
          <span>Reports & Dashboard</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'charts' ? 'active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          <Layers size={16} />
          <span>Analytics & Charts</span>
        </button>

        <div className="nav-section-label" style={{ marginTop: '16px' }}>EVENTS & TRACKING</div>
        <button 
          className={`nav-item ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar size={16} />
          <span>Daily Agenda</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          <Tag size={16} />
          <span>Rules & Categories</span>
        </button>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {/* Mode Switcher */}
        <div 
          className={`sidebar-mode-toggle ${mode === 'demo' ? 'demo' : 'live'}`}
          onClick={() => setMode(mode === 'demo' ? 'live' : 'demo')}
          title="Toggle Sync Mode"
        >
          <span className="mode-dot">●</span>
          <span>{mode === 'demo' ? 'Demo Mode' : 'Live Google Sync'}</span>
        </div>

        {/* Action icons */}
        <div className="sidebar-actions">
          <button className="sidebar-action-btn" onClick={onOpenGuide} title="OAuth Setup Guide">
            <HelpCircle size={16} />
          </button>
          <button className="sidebar-action-btn" onClick={onOpenSettings} title="Settings">
            <Settings size={16} />
          </button>
        </div>

        {/* User Account / Auth */}
        <div className="sidebar-user">
          {isAuthenticated ? (
            <div className="user-profile">
              <div className="user-email-text" title={userEmail}>
                <User size={14} />
                <span>{userEmail || 'Connected'}</span>
              </div>
              <button className="btn-logout" onClick={onGoogleSignOut} title="Sign Out">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button className="btn-sidebar-connect" onClick={onGoogleSignIn}>
              <LogIn size={14} />
              <span>Connect Google</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
