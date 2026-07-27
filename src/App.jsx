import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import AnalyticsCharts from './components/AnalyticsCharts';
import EventsList from './components/EventsList';
import RuleManagerModal from './components/RuleManagerModal';
import ManualEntryModal from './components/ManualEntryModal';
import SetupGuideModal from './components/SetupGuideModal';
import SettingsModal from './components/SettingsModal';

import { DEFAULT_CLIENT_ID, DEFAULT_CATEGORIES, DEFAULT_RULES } from './config';
import { generateMockEvents } from './services/mockData';
import { calculateAnalytics } from './services/categorizer';
import { requestGoogleAccessToken, fetchGoogleCalendarEvents } from './services/googleCalendar';

export default function App() {
  // Mode: 'demo' or 'live'
  const [mode, setMode] = useState('demo');
  
  // Date Range Filter: 'today', '7days', '14days', '30days'
  const [dateRange, setDateRange] = useState('14days');

  // Client ID
  const [clientId, setClientId] = useState(() => {
    return localStorage.getItem('timetrack_client_id') || DEFAULT_CLIENT_ID;
  });

  // Auth & Token State
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('timetrack_access_token') || null;
  });
  const [userEmail, setUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Custom Categories & Rules State
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('timetrack_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem('timetrack_rules');
    return saved ? JSON.parse(saved) : DEFAULT_RULES;
  });

  // Category Manual Overrides ({ [eventId]: categoryId })
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

  // Compute Start & End Date depending on selection
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

  // Handle Google Calendar Fetch
  const handleFetchGoogleCalendar = async (token = accessToken) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const fetchedEvents = await fetchGoogleCalendarEvents(token, startDate, endDate);
      setGoogleEvents(fetchedEvents);
      setMode('live');
      showToast(`Successfully synced ${fetchedEvents.length} events from Google Calendar!`, 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to fetch Google Calendar events.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth Sign In
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

  // Combine Active Events according to Mode
  const activeRawEvents = useMemo(() => {
    if (mode === 'demo') {
      const mockEvents = generateMockEvents();
      // Filter mock events by date range
      return [...mockEvents, ...manualEvents].filter(evt => {
        const evtDate = new Date(evt.start?.dateTime || evt.start?.date || evt.start);
        return evtDate >= startDate && evtDate <= endDate;
      });
    } else {
      // Live mode combines Google Events + Manual Entries
      const combined = [...googleEvents, ...manualEvents];
      return combined.filter(evt => {
        const evtDate = new Date(evt.start?.dateTime || evt.start?.date || evt.start);
        return evtDate >= startDate && evtDate <= endDate;
      });
    }
  }, [mode, startDate, endDate, manualEvents, googleEvents]);

  // Compute Full Analytics using current rules and categories
  const analytics = useMemo(() => {
    return calculateAnalytics(activeRawEvents, rules, categories, categoryOverrides);
  }, [activeRawEvents, rules, categories, categoryOverrides]);

  // Handlers for Rule & Category Editing
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
    showToast('Event category updated manually.', 'success');
  };

  const handleAddManualEvent = (eventData) => {
    setManualEvents(prev => [eventData, ...prev]);
    showToast('Manual time entry added!', 'success');
  };

  // CSV Data Importer
  const handleImportCSV = (csvContent) => {
    try {
      const lines = csvContent.split('\n').filter(line => line.trim());
      if (lines.length < 2) return;

      const newEvents = [];
      // CSV Headers expected: Title, Date, StartTime, EndTime, Description
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
      showToast('Error parsing CSV file. Please format as: Title, Date, StartTime, EndTime', 'error');
    }
  };

  // CSV Data Exporter
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
    <div className="app-container">
      {/* Navbar Header */}
      <Header
        dateRange={dateRange}
        setDateRange={setDateRange}
        mode={mode}
        setMode={setMode}
        isAuthenticated={!!accessToken}
        userEmail={userEmail}
        onGoogleSignIn={handleGoogleSignIn}
        onGoogleSignOut={handleGoogleSignOut}
        onOpenRules={() => setShowRulesModal(true)}
        onOpenManualEntry={() => setShowManualModal(true)}
        onOpenGuide={() => setShowGuideModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onRefresh={() => handleFetchGoogleCalendar()}
        isLoading={isLoading}
      />

      {/* Overview Metric Cards */}
      <DashboardOverview analytics={analytics} />

      {/* Analytics Charts */}
      <AnalyticsCharts analytics={analytics} />

      {/* Interactive Events List */}
      <EventsList
        processedEvents={analytics.processedEvents}
        categories={categories}
        onOverrideCategory={handleOverrideCategory}
      />

      {/* Rule Manager Modal */}
      <RuleManagerModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        rules={rules}
        categories={categories}
        onAddRule={handleAddRule}
        onDeleteRule={handleDeleteRule}
        onAddCategory={handleAddCategory}
      />

      {/* Manual Time Logging & CSV Modal */}
      <ManualEntryModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        categories={categories}
        onAddManualEvent={handleAddManualEvent}
        onImportCSV={handleImportCSV}
        onExportCSV={handleExportCSV}
      />

      {/* Google Cloud Setup Guide */}
      <SetupGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        clientId={clientId}
        onToast={showToast}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        clientId={clientId}
        onSaveClientId={(newId) => setClientId(newId)}
        onResetDefaults={handleResetDefaults}
        onToast={showToast}
      />

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
