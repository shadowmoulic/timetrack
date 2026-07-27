import React, { useState } from 'react';
import { 
  Clock, 
  Copy, 
  Trash2, 
  Edit3, 
  Calendar, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Code, 
  BookOpen, 
  Dumbbell, 
  Tv, 
  Briefcase 
} from 'lucide-react';

export default function RecentActivityList({ 
  processedEvents = [], 
  categories = [], 
  onOverrideCategory,
  onDuplicateEvent,
  onDeleteEvent,
  onEditEvent
}) {
  const [filterPeriod, setFilterPeriod] = useState('all'); // 'all', 'today', 'yesterday', 'week'
  const [searchQuery, setSearchQuery] = useState('');

  // Icon matcher based on category or keyword
  const getEventIcon = (evt) => {
    const text = `${evt.summary} ${evt.category?.name}`.toLowerCase();
    if (text.includes('code') || text.includes('dev') || text.includes('github')) return Code;
    if (text.includes('gym') || text.includes('workout') || text.includes('run')) return Dumbbell;
    if (text.includes('netflix') || text.includes('gaming') || text.includes('youtube')) return Tv;
    if (text.includes('meeting') || text.includes('work') || text.includes('client')) return Briefcase;
    if (text.includes('book') || text.includes('study') || text.includes('course')) return BookOpen;
    return Clock;
  };

  const filteredEvents = processedEvents.filter(evt => {
    const matchesSearch = evt.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterPeriod === 'today') {
      const todayStr = new Date().toISOString().split('T')[0];
      const evtStr = new Date(evt.start?.dateTime || evt.start?.date || evt.start).toISOString().split('T')[0];
      return todayStr === evtStr;
    }
    return true;
  }).slice(0, 10); // Compact limit for dashboard

  const formatTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
      {/* Activity Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Recent Activity Stream
          </h2>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {filteredEvents.length} items
          </span>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
            {['all', 'today', 'yesterday'].map(period => (
              <button
                key={period}
                onClick={() => setFilterPeriod(period)}
                className={`px-2.5 py-1 text-[11px] font-bold capitalize rounded-md transition-all ${
                  filterPeriod === period 
                    ? 'bg-white text-slate-900 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200/70 rounded-lg text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-slate-400 w-32 focus:w-40 transition-all"
            />
          </div>
        </div>
      </div>

      {/* GitHub-Activity Style Compact Item Feed */}
      <div className="space-y-2.5">
        {filteredEvents.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-medium">
            No activity logs found for this filter.
          </div>
        ) : (
          filteredEvents.map(evt => {
            const IconComp = getEventIcon(evt);
            const startDate = evt.start?.dateTime || evt.start?.date || evt.start;
            const endDate = evt.end?.dateTime || evt.end?.date || evt.end;
            const cat = evt.category || categories[0];

            return (
              <div 
                key={evt.id}
                className="group flex items-center justify-between p-3 bg-slate-50/70 hover:bg-white border border-slate-200/60 hover:border-slate-300 rounded-xl transition-all shadow-2xs"
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ backgroundColor: `${cat?.color || '#4f46e5'}15`, color: cat?.color || '#4f46e5' }}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900 truncate" title={evt.summary}>
                        {evt.summary}
                      </span>
                      
                      {/* Category Pill */}
                      <span 
                        className="px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider flex-shrink-0"
                        style={{ backgroundColor: `${cat?.color || '#4f46e5'}15`, color: cat?.color || '#4f46e5' }}
                      >
                        {cat?.name || 'General'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-0.5">
                      <span>{formatDate(startDate)} • {formatTime(startDate)} - {formatTime(endDate)}</span>
                      <span className="font-mono font-bold text-slate-700">{evt.durationHours}h</span>
                      {evt.matchedKeyword && (
                        <span className="font-mono text-[10px] bg-slate-200/60 px-1.5 py-0.2 rounded text-slate-600">
                          {evt.matchedKeyword}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Hover Quick Action Buttons */}
                <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onDuplicateEvent && onDuplicateEvent(evt)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Duplicate Event"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onEditEvent && onEditEvent(evt)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Edit Event"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteEvent && onDeleteEvent(evt.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
