import React from 'react';
import { Clock, Calendar, ShieldAlert, Settings, Plus, Tag, HelpCircle, LogIn, LogOut, RefreshCw } from 'lucide-react';

export default function Header({
  dateRange,
  setDateRange,
  mode,
  setMode,
  isAuthenticated,
  userEmail,
  onGoogleSignIn,
  onGoogleSignOut,
  onOpenRules,
  onOpenManualEntry,
  onOpenGuide,
  onOpenSettings,
  onRefresh,
  isLoading
}) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon">
          <Clock size={24} />
        </div>
        <div>
          <h1 className="brand-title">TimeTrack</h1>
          <p className="brand-subtitle">Google Calendar Productivity Intelligence</p>
        </div>
      </div>

      <div className="header-controls">
        {/* Date Range Selector */}
        <div className="date-select-pill">
          <Calendar size={16} className="text-secondary" />
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="today">Today</option>
            <option value="7days">Past 7 Days</option>
            <option value="14days">Past 14 Days</option>
            <option value="30days">Past 30 Days</option>
          </select>
        </div>

        {/* Mode Indicator Badge */}
        <div 
          className={`mode-badge ${mode === 'demo' ? 'demo' : 'live'}`}
          onClick={() => setMode(mode === 'demo' ? 'live' : 'demo')}
          title="Click to toggle between Live Google Calendar Sync and Demo Mode"
        >
          <span className="dot">●</span>
          {mode === 'demo' ? 'Demo Mode (Simulated Data)' : 'Live Google Sync'}
        </div>

        {/* Refresh Button */}
        <button className="btn-icon-only" onClick={onRefresh} title="Refresh Calendar Data" disabled={isLoading}>
          <RefreshCw size={18} className={isLoading ? 'spin' : ''} />
        </button>

        {/* Add Manual Time / Import */}
        <button className="btn btn-secondary" onClick={onOpenManualEntry}>
          <Plus size={16} />
          <span>Add Time / Import</span>
        </button>

        {/* Manage Rules Button */}
        <button className="btn btn-secondary" onClick={onOpenRules}>
          <Tag size={16} />
          <span>Rules</span>
        </button>

        {/* Setup Guide */}
        <button className="btn-icon-only" onClick={onOpenGuide} title="Google Cloud Setup Guide">
          <HelpCircle size={18} />
        </button>

        {/* Settings */}
        <button className="btn-icon-only" onClick={onOpenSettings} title="Settings">
          <Settings size={18} />
        </button>

        {/* Google Authentication */}
        {isAuthenticated ? (
          <div className="auth-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{userEmail || 'Signed In'}</span>
            <button className="btn btn-secondary" onClick={onGoogleSignOut}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <button className="btn btn-google" onClick={onGoogleSignIn}>
            <LogIn size={16} />
            <span>Connect Google</span>
          </button>
        )}
      </div>
    </header>
  );
}
