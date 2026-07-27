import React, { useState, useEffect } from 'react';
import { StickyNote, Plus, Trash2, CheckSquare, Square } from 'lucide-react';

export default function ScratchpadWidget() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('timetrack_scratch_notes');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Prepare weekly client status report', done: false },
      { id: '2', text: 'Refactor React dashboard state management', done: true },
      { id: '3', text: 'Schedule 2 hours deep work block tomorrow', done: false }
    ];
  });

  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    localStorage.setItem('timetrack_scratch_notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes(prev => [{ id: `note-${Date.now()}`, text: newNote.trim(), done: false }, ...prev]);
    setNewNote('');
  };

  const toggleNote = (id) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, done: !n.done } : n));
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-amber-200/60 pb-2.5">
        <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
          <StickyNote className="w-4 h-4 text-amber-600" />
          <span>Quick Sticky Notes & Tasks</span>
        </div>
        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
          {notes.filter(n => !n.done).length} Pending
        </span>
      </div>

      {/* Add Input */}
      <form onSubmit={handleAddNote} className="flex space-x-2">
        <input
          type="text"
          placeholder="Add a quick scratchpad task..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="flex-1 bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium placeholder-amber-400 outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Notes List */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {notes.map(note => (
          <div 
            key={note.id} 
            className="flex items-center justify-between p-2 bg-white/80 border border-amber-200/50 rounded-xl text-xs font-semibold group transition-all"
          >
            <div 
              onClick={() => toggleNote(note.id)}
              className="flex items-center space-x-2 cursor-pointer min-w-0 flex-1"
            >
              {note.done ? (
                <CheckSquare className="w-4 h-4 text-amber-600 flex-shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-amber-400 flex-shrink-0" />
              )}
              <span className={`truncate ${note.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                {note.text}
              </span>
            </div>

            <button
              onClick={() => deleteNote(note.id)}
              className="opacity-0 group-hover:opacity-100 text-amber-400 hover:text-rose-600 transition-opacity p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
