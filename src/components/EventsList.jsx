import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  ListFilter, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Tag, 
  Trash2, 
  Copy 
} from 'lucide-react';

export default function EventsList({ processedEvents = [], categories = [], onOverrideCategory }) {
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
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatEventDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Title & Filter Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Daily Agenda & Calendar Events
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Showing {filteredEvents.length} tracked events across date range
            </p>
          </div>
        </div>

        {/* Controls: Search & Category Filter */}
        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search agenda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-indigo-500 w-44 focus:w-56 transition-all"
            />
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <ListFilter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Agenda Event Cards Stream */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-700">No matching events found</p>
            <p className="text-xs text-slate-400 font-medium">Try clearing your search query or changing the filter range.</p>
          </div>
        ) : (
          filteredEvents.map(evt => {
            const startDate = evt.start?.dateTime || evt.start?.date || evt.start;
            const endDate = evt.end?.dateTime || evt.end?.date || evt.end;
            const cat = evt.category || categories[0];

            return (
              <div 
                key={evt.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/60 hover:bg-white border border-slate-200/60 hover:border-slate-300 rounded-xl transition-all shadow-2xs gap-4"
              >
                {/* Event Left Info */}
                <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                  <div 
                    className="w-2.5 h-12 rounded-full flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: cat?.color || '#4f46e5' }}
                  />

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900 truncate" title={evt.summary}>
                        {evt.summary}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium flex-wrap gap-y-1">
                      <span className="font-semibold text-slate-700">{formatEventDate(startDate)}</span>
                      <span>•</span>
                      <span>{formatEventTime(startDate)} - {formatEventTime(endDate)}</span>
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                        {evt.durationHours} hrs
                      </span>

                      {evt.matchedKeyword && (
                        <span className="font-mono text-[10px] bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded-md">
                          keyword: "{evt.matchedKeyword}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Right Controls: Category Dropdown & Links */}
                <div className="flex items-center space-x-3 justify-end flex-shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <select
                    value={cat.id}
                    onChange={(e) => onOverrideCategory(evt.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border outline-none cursor-pointer transition-all"
                    style={{
                      backgroundColor: `${cat.color}15`,
                      color: cat.color,
                      borderColor: `${cat.color}40`
                    }}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id} style={{ background: '#ffffff', color: '#0f172a' }}>
                        {c.name} ({c.type})
                      </option>
                    ))}
                  </select>

                  {evt.htmlLink && (
                    <a
                      href={evt.htmlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Open in Google Calendar"
                    >
                      <ExternalLink className="w-4 h-4" />
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
