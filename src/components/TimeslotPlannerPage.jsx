import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Sparkles, CheckCircle2, ChevronLeft, ChevronRight, Tag } from 'lucide-react';

export default function TimeslotPlannerPage({ onAddTimeslot, categories = [], processedEvents = [] }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskName, setTaskName] = useState('');
  const [durationHours, setDurationHours] = useState(1);
  const [startTime, setStartTime] = useState('10:00');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'deep-work');

  // Mini calendar generator for current month
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const changeMonth = (offset) => {
    setCurrentMonth(new Date(year, month + offset, 1));
  };

  const handleSelectDay = (dayNum) => {
    const monthStr = (month + 1).toString().padStart(2, '0');
    const dayStr = dayNum.toString().padStart(2, '0');
    setSelectedDate(`${year}-${monthStr}-${dayStr}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const startDT = new Date(`${selectedDate}T${startTime}:00.000Z`);
    const endDT = new Date(startDT.getTime() + durationHours * 60 * 60 * 1000);

    onAddTimeslot({
      id: `timeslot-${Date.now()}`,
      summary: taskName.trim(),
      start: { dateTime: startDT.toISOString() },
      end: { dateTime: endDT.toISOString() },
      categoryId,
      durationHours,
      source: 'manual'
    });

    setTaskName('');
  };

  // Events for selected date
  const dayEvents = processedEvents.filter(evt => {
    const evtDate = new Date(evt.start?.dateTime || evt.start?.date || evt.start).toISOString().split('T')[0];
    return evtDate === selectedDate;
  });

  const formatTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Calendar & Timeslot Allocator
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Pick a date on the calendar and schedule 1h / 2h focus time blocks directly to Google Calendar
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-xl text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Selected Date: {selectedDate}</span>
        </div>
      </div>

      {/* Main Grid: Visual Calendar Grid (7 Cols) + Allocator Form (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visual Month Calendar Grid (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Calendar Header Navigation */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => changeMonth(-1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => changeMonth(1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-xl bg-slate-50/50" />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const monthStr = (month + 1).toString().padStart(2, '0');
              const dayStr = dayNum.toString().padStart(2, '0');
              const dateKey = `${year}-${monthStr}-${dayStr}`;
              
              const isSelected = selectedDate === dateKey;
              const isTodayStr = today.toISOString().split('T')[0] === dateKey;

              // Check if date has events
              const countForDay = processedEvents.filter(e => {
                const d = new Date(e.start?.dateTime || e.start?.date || e.start).toISOString().split('T')[0];
                return d === dateKey;
              }).length;

              return (
                <button
                  key={dayNum}
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-10 sm:h-12 rounded-xl font-bold text-xs flex flex-col items-center justify-center relative transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-md'
                      : (isTodayStr 
                          ? 'border-2 border-indigo-600 text-indigo-600 bg-indigo-50/40' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/60')
                  }`}
                >
                  <span>{dayNum}</span>
                  {countForDay > 0 && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-indigo-400' : 'bg-indigo-600'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Day Agenda Preview */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Scheduled for {selectedDate} ({dayEvents.length})
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {dayEvents.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400 font-medium">
                  No time blocks scheduled for this day yet. Use the form to allocate time!
                </div>
              ) : (
                dayEvents.map(evt => (
                  <div key={evt.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs">
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: evt.category?.color || '#4f46e5' }} />
                      <span className="font-bold text-slate-900 truncate">{evt.summary}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500 font-medium flex-shrink-0">
                      <span>{formatTime(evt.start?.dateTime || evt.start)}</span>
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                        {evt.durationHours}h
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: 1h / 2h Timeslot Allocator Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Timeslot Allocator</h2>
              <p className="text-xs text-slate-400 font-medium">Schedule 1h/2h blocks directly</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Selected Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Task Title
              </label>
              <input
                type="text"
                placeholder="e.g. Deep Work: System Architecture (2h)"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Time Block
                </label>
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(parseFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                >
                  <option value={0.5}>30 Minutes</option>
                  <option value={1}>1 Hour Block</option>
                  <option value={1.5}>1.5 Hours Block</option>
                  <option value={2}>2 Hours Block</option>
                  <option value={3}>3 Hours Block</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 mt-4"
            >
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Schedule {durationHours}h Block to Google Calendar</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
