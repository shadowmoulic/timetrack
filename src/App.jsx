import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import AnalyticsCharts from './components/AnalyticsCharts';
import RecentActivityList from './components/RecentActivityList';
import EventsList from './components/EventsList';
import FocusPage from './components/FocusPage';
import AnalyticsPage from './components/AnalyticsPage';
import CommandPaletteModal from './components/CommandPaletteModal';
import RuleManagerModal from './components/RuleManagerModal';
import ManualEntryModal from './components/ManualEntryModal';
import SetupGuideModal from './components/SetupGuideModal';
import SettingsModal from './components/SettingsModal';

import { Calendar, Plus, RefreshCw, Sparkles, Command } from 'lucide-react';
import { DEFAULT_CLIENT_ID, DEFAULT_CATEGORIES, DEFAULT_RULES } from './config';
import { generateMockEvents } from './services/mockData';
import { calculateAnalytics } from './services/categorizer';
import { requestGoogleAccessToken, fetchGoogleCalendarEvents } from './services/googleCalendar';

export default function App() {
  // Navigation Pages: 'dashboard', 'focus', 'analytics', 'events'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mode: 'demo' or 'live'
  const [mode, setMode] = useState('demo');
  
  // Date Range Filter: 'today', '7days', '14days', '30days'
  const [dateRange, setDateRange] = useState('14days');

  // Client ID
  const [clientId, setClientId] = useState(() => {
    return localStorage.getItem('timetrack_client_id') || DEFAULT_CLIENT_ID;
  });

  // Auth State
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('timetrack_access_token') || null;
  });
  const [userEmail, setUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Custom Categories & Rules
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('timetrack_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem('timetrack_rules');
    return saved ? JSON.parse(saved) : DEFAULT_RULES;
  });

  // Category Manual Overrides
  const [categoryOverrides, setCategoryOverrides] = useState(() => {
    const saved = localStorage.getItem('timetrack_overrides');
    return saved ? JSON.parse(saved) : {};
  });

  // Manual & Google Events Data
  const [manualEvents, setManualEvents] = useState(() => {
    const saved = localStorage.getItem('timetrack_manual_events');
    return saved ? JSON.parse(saved) : [];
  });

  const [googleEvents, setGoogleEvents] = useState(() => {
    const saved = localStorage.getItem('timetrack_google_events');
    return saved ? JSON.parse(saved) : [];
  });

  // Modals Visibility
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleGlobalShortcuts = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, []);

  // Sync State with LocalStorage
  useEffect(() => {
    localStorage.setItem('timetrack_client_id', clientId);
  }, [clientId]);

  useEffect(() => {
    localStorage.setItem('timetrack_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('timetrack_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('timetrack_overrides', JSON.stringify(categoryOverrides));
  }, [categoryOverrides]);

  useEffect(() => {
    localStorage.setItem('timetrack_manual_events', JSON.stringify(manualEvents));
  }, [manualEvents]);

  useEffect(() => {
    localStorage.setItem('timetrack_google_events', JSON.stringify(googleEvents));
  }, [googleEvents]);

  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date();

    if (dateRange === 'today') {
      start.setHours(0, 0, 0, 0);
    } else if (dateRange === '7days') {
      start.setDate(start.getDate() - 7);
    } else if (dateRange === '14days') {
      start.setDate(start.getDate() - 14);
    } else if (dateRange === '30days') {
      start.setDate(start.getDate() - 30);
    }
    return { startDate: start, endDate: end };
  }, [dateRange]);

  const handleFetchGoogleCalendar = async (token = accessToken) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const fetchedEvents = await fetchGoogleCalendarEvents(token, startDate, endDate);
      setGoogleEvents(fetchedEvents);
      setMode('live');
      showToast(`Synced ${fetchedEvents.length} Google Calendar events!`, 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to fetch Google Calendar events.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    requestGoogleAccessToken(
      clientId,
      (newToken) => {
        setAccessToken(newToken);
        localStorage.setItem('timetrack_access_token', newToken);
        handleFetchGoogleCalendar(newToken);
      },
      (err) => {
        showToast(`Google Sign-In Error: ${err}`, 'error');
      }
    );
  };

  const handleGoogleSignOut = () => {
    setAccessToken(null);
    localStorage.removeItem('timetrack_access_token');
    setGoogleEvents([]);
    setMode('demo');
    showToast('Signed out of Google account.', 'info');
  };

  const activeRawEvents = useMemo(() => {
    if (mode === 'demo') {
      const mockEvents = generateMockEvents();
      return [...mockEvents, ...manualEvents].filter(evt => {
        const evtDate = new Date(evt.start?.dateTime || evt.start?.date || evt.start);
        return evtDate >= startDate && evtDate <= endDate;
      });
    } else {
      const combined = [...googleEvents, ...manualEvents];
      return combined.filter(evt => {
        const evtDate = new Date(evt.start?.dateTime || evt.start?.date || evt.start);
        return evtDate >= startDate && evtDate <= endDate;
      });
    }
  }, [mode, startDate, endDate, manualEvents, googleEvents]);

  const analytics = useMemo(() => {
    return calculateAnalytics(activeRawEvents, rules, categories, categoryOverrides);
  }, [activeRawEvents, rules, categories, categoryOverrides]);

  // Event Quick Actions
  const handleDuplicateEvent = (evt) => {
    const duplicated = {
      ...evt,
      id: `manual-dup-${Date.now()}`,
      summary: `${evt.summary} (Copy)`,
      source: 'manual'
    };
    setManualEvents(prev => [duplicated, ...prev]);
    showToast(`Duplicated "${evt.summary}"`, 'success');
  };

  const handleDeleteEvent = (evtId) => {
    setManualEvents(prev => prev.filter(e => e.id !== evtId));
    setGoogleEvents(prev => prev.filter(e => e.id !== evtId));
    showToast('Event removed.', 'info');
  };

  const handleAddRule = (newRule) => {
    setRules(prev => [newRule, ...prev]);
    showToast(`Added keyword rule "${newRule.keyword}"`, 'success');
  };

  const handleDeleteRule = (ruleId) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
    showToast('Rule removed.', 'info');
  };

  const handleAddCategory = (newCat) => {
    setCategories(prev => [...prev, newCat]);
    showToast(`Created category "${newCat.name}"`, 'success');
  };

  const handleOverrideCategory = (eventId, categoryId) => {
    setCategoryOverrides(prev => ({
      ...prev,
      [eventId]: categoryId
    }));
    showToast('Event category updated.', 'success');
  };

  const handleAddManualEvent = (eventData) => {
    setManualEvents(prev => [eventData, ...prev]);
    showToast('Manual time entry added!', 'success');
  };

  const handleImportCSV = (csvContent) => {
    try {
      const lines = csvContent.split('\n').filter(line => line.trim());
      if (lines.length < 2) return;

      const newEvents = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
        if (cols.length >= 2) {
          const title = cols[0] || 'Imported Task';
          const dateStr = cols[1] || new Date().toISOString().split('T')[0];
          const startTime = cols[2] || '09:00';
          const endTime = cols[3] || '10:00';

          const startDT = new Date(`${dateStr}T${startTime}:00.000Z`).toISOString();
          const endDT = new Date(`${dateStr}T${endTime}:00.000Z`).toISOString();

          newEvents.push({
            id: `imported-${Date.now()}-${i}`,
            summary: title,
            description: cols[4] || '',
            start: { dateTime: startDT },
            end: { dateTime: endDT },
            source: 'imported'
          });
        }
      }

      setManualEvents(prev => [...newEvents, ...prev]);
      showToast(`Imported ${newEvents.length} events from CSV!`, 'success');
    } catch (err) {
      showToast('Error parsing CSV file.', 'error');
    }
  };

  const handleExportCSV = () => {
    const events = analytics.processedEvents || [];
    let csv = "Title,Date,DurationHours,Category,ProductivityType,MatchedKeyword\n";
    events.forEach(evt => {
      const dateStr = new Date(evt.start?.dateTime || evt.start?.date || evt.start).toISOString().split('T')[0];
      const title = `"${(evt.summary || '').replace(/"/g, '""')}"`;
      csv += `${title},${dateStr},${evt.durationHours},"${evt.category.name}",${evt.category.type},"${evt.matchedKeyword || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetrack_analytics_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Exported CSV report!', 'success');
  };

  const handleResetDefaults = () => {
    setRules(DEFAULT_RULES);
    setCategories(DEFAULT_CATEGORIES);
    setCategoryOverrides({});
    setClientId(DEFAULT_CLIENT_ID);
    setManualEvents([]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'rules') {
            setShowRulesModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
        mode={mode}
        setMode={setMode}
        isAuthenticated={!!accessToken}
        userEmail={userEmail}
        onGoogleSignIn={handleGoogleSignIn}
        onGoogleSignOut={handleGoogleSignOut}
        onOpenGuide={() => setShowGuideModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Top Control Bar */}
        <header className="h-16 px-8 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-bold text-slate-900 capitalize">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'focus' && 'Focus Workspace & Pomodoro'}
              {activeTab === 'analytics' && 'Analytics & Deep Dive'}
              {activeTab === 'events' && 'Daily Agenda Timeline'}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {/* Command Palette Trigger Pill */}
            <button 
              onClick={() => setShowCommandPalette(true)}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/70 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
            >
              <Command className="w-3.5 h-3.5 text-slate-400" />
              <span>Command Palette</span>
              <kbd className="font-mono text-[10px] bg-white border border-slate-200 px-1 py-0.5 rounded text-slate-400">⌘K</kbd>
            </button>

            {/* Date Range Selector */}
            <div className="flex items-center space-x-2 border border-slate-200/80 bg-white px-3 py-1.5 rounded-xl text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent border-none outline-none font-semibold text-slate-800 cursor-pointer"
              >
                <option value="today">Today</option>
                <option value="7days">Past 7 Days</option>
                <option value="14days">Past 14 Days</option>
                <option value="30days">Past 30 Days</option>
              </select>
            </div>

            {/* Google Sync Button */}
            <button 
              onClick={() => handleFetchGoogleCalendar()} 
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200/80 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {/* Add Log Button */}
            <button 
              onClick={() => setShowManualModal(true)}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Entry</span>
            </button>
          </div>
        </header>

        {/* View Content Area */}
        <div className="p-8 max-w-7xl w-full mx-auto flex-1">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <DashboardOverview analytics={analytics} />
              <AnalyticsCharts analytics={analytics} />
              
              {/* GitHub-style Compact Activity Feed */}
              <RecentActivityList 
                processedEvents={analytics.processedEvents}
                categories={categories}
                onOverrideCategory={handleOverrideCategory}
                onDuplicateEvent={handleDuplicateEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            </div>
          )}

          {activeTab === 'focus' && (
            <FocusPage onToast={showToast} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage analytics={analytics} />
          )}

          {activeTab === 'events' && (
            <EventsList
              processedEvents={analytics.processedEvents}
              categories={categories}
              onOverrideCategory={handleOverrideCategory}
            />
          )}
        </div>
      </main>

      {/* Modals & Command Palette */}
      <CommandPaletteModal
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenManual={() => setShowManualModal(true)}
        onSyncGoogle={() => handleFetchGoogleCalendar()}
        onToggleMode={() => setMode(mode === 'demo' ? 'live' : 'demo')}
        mode={mode}
        onOpenRules={() => setShowRulesModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      <RuleManagerModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        rules={rules}
        categories={categories}
        onAddRule={handleAddRule}
        onDeleteRule={handleDeleteRule}
        onAddCategory={handleAddCategory}
      />

      <ManualEntryModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        categories={categories}
        onAddManualEvent={handleAddManualEvent}
        onImportCSV={handleImportCSV}
        onExportCSV={handleExportCSV}
      />

      <SetupGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        clientId={clientId}
        onToast={showToast}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        clientId={clientId}
        onSaveClientId={(newId) => setClientId(newId)}
        onResetDefaults={handleResetDefaults}
        onToast={showToast}
      />

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-[3000] flex flex-col space-y-2">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className={`px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-semibold flex items-center space-x-2 animate-in slide-in-from-bottom-2 duration-200 border border-slate-800 ${
              t.type === 'success' ? 'border-l-4 border-l-emerald-500' : (t.type === 'error' ? 'border-l-4 border-l-rose-500' : 'border-l-4 border-l-indigo-500')
            }`}
          >
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
