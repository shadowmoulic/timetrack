import React, { useState } from 'react';
import { X, Plus, Upload, Download, Clock } from 'lucide-react';

export default function ManualEntryModal({
  isOpen,
  onClose,
  categories,
  onAddManualEvent,
  onImportCSV,
  onExportCSV
}) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const startDateTime = new Date(`${date}T${startTime}:00.000Z`).toISOString();
    const endDateTime = new Date(`${date}T${endTime}:00.000Z`).toISOString();

    onAddManualEvent({
      id: `manual-${Date.now()}`,
      summary: title.trim(),
      description: description.trim(),
      start: { dateTime: startDateTime },
      end: { dateTime: endDateTime },
      categoryId,
      source: 'manual'
    });

    // Reset
    setTitle('');
    setDescription('');
    onClose();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      onImportCSV(content);
      onClose();
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} className="text-secondary" />
            Add Manual Time Block or Import Data
          </h3>
          <button className="btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Manual Entry Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Event Title / Task</label>
              <input
                type="text"
                placeholder="e.g. Coding React Dashboard, Gym Workout"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="form-select"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description / Notes (Optional)</label>
              <textarea
                placeholder="Additional notes or keywords..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
                rows={2}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Plus size={16} /> Add Entry
              </button>
            </div>
          </form>

          <hr style={{ margin: '24px 0', borderColor: 'var(--border-color)' }} />

          {/* Import / Export Utilities */}
          <div>
            <span className="form-label" style={{ marginBottom: '12px', display: 'block' }}>
              Import / Export Tools
            </span>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                <Upload size={16} />
                <span>Import CSV File</span>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>

              <button type="button" className="btn btn-secondary" onClick={onExportCSV}>
                <Download size={16} />
                <span>Export CSV Backup</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
