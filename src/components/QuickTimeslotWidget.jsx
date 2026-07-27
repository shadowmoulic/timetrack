import React, { useState } from 'react';
import { Calendar, Clock, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

export default function QuickTimeslotWidget({ onAddTimeslot, categories = [] }) {
  const [taskName, setTaskName] = useState('');
  const [durationHours, setDurationHours] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'deep-work');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const startDT = new Date(`${date}T${startTime}:00.000Z`);
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

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Quick Timeslot Planner</span>
        </div>
        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full">
          1h / 2h Calendar Allocator
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
            Task Name
          </label>
          <input
            type="text"
            placeholder="e.g. Deep Work: System Architecture (2h)"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium outline-none focus:border-indigo-500 transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Time Block Duration
            </label>
            <select
              value={durationHours}
              onChange={(e) => setDurationHours(parseFloat(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 outline-none focus:border-indigo-500"
            >
              <option value={0.5}>30 Minutes</option>
              <option value={1}>1 Hour Block</option>
              <option value={1.5}>1.5 Hours Block</option>
              <option value={2}>2 Hours Block</option>
              <option value={3}>3 Hours Block</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule {durationHours}h Block to Calendar</span>
        </button>
      </form>
    </div>
  );
}
