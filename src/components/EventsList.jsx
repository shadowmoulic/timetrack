import React, { useState } from 'react';
import { ListFilter, Search, Calendar, Edit3, ExternalLink } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../config';

export default function EventsList({ processedEvents, categories = DEFAULT_CATEGORIES, onOverrideCategory }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  const filteredEvents = (processedEvents || []).filter(evt => {
    const matchesSearch = `${evt.summary} ${evt.description || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategoryFilter === 'all' || evt.category?.id === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const formatEventTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatEventDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h2 className="section-title">
          <Calendar size={20} className="text-secondary" />
          Tracked Events ({filteredEvents.length})
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '30px', paddingRight: '12px', fontSize: '0.82rem', height: '34px', width: '180px' }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ListFilter size={14} className="text-secondary" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.82rem', height: '34px', padding: '0 8px' }}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="events-list">
        {filteredEvents.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No matching calendar events found for the current search or filters.
          </div>
        ) : (
          filteredEvents.map(evt => {
            const startDate = evt.start?.dateTime || evt.start?.date || evt.start;
            const endDate = evt.end?.dateTime || evt.end?.date || evt.end;
            const cat = evt.category || categories[0];

            return (
              <div key={evt.id} className="event-card">
                <div className="event-left">
                  <div 
                    className="event-color-dot" 
                    style={{ backgroundColor: cat.color, color: cat.color }} 
                  />
                  <div className="event-details">
                    <div className="event-title" title={evt.summary}>
                      {evt.summary}
                    </div>
                    <div className="event-meta">
                      <span>{formatEventDate(startDate)} • {formatEventTime(startDate)} - {formatEventTime(endDate)}</span>
                      <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>({evt.durationHours} hrs)</span>
                      
                      {evt.matchedKeyword && (
                        <span className="event-keyword-chip">
                          match: "{evt.matchedKeyword}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="event-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Category Pill with inline dropdown to override */}
                  <select
                    value={cat.id}
                    onChange={(e) => onOverrideCategory(evt.id, e.target.value)}
                    style={{
                      background: cat.bg,
                      color: cat.color,
                      border: `1px solid ${cat.color}40`,
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id} style={{ background: '#0f172a', color: '#fff' }}>
                        {c.name} ({c.type})
                      </option>
                    ))}
                  </select>

                  {evt.htmlLink && (
                    <a 
                      href={evt.htmlLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: 'var(--text-muted)' }} 
                      title="Open in Google Calendar"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
