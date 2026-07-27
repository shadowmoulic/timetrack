import React, { useState } from 'react';
import { X, Settings, Key, RotateCcw, Save } from 'lucide-react';
import { DEFAULT_CLIENT_ID } from '../config';

export default function SettingsModal({
  isOpen,
  onClose,
  clientId,
  onSaveClientId,
  onResetDefaults,
  onToast
}) {
  const [inputClientId, setInputClientId] = useState(clientId || DEFAULT_CLIENT_ID);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!inputClientId.trim()) return;

    onSaveClientId(inputClientId.trim());
    if (onToast) onToast('Google Client ID updated!', 'success');
    onClose();
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all rules and restore default settings?")) {
      onResetDefaults();
      setInputClientId(DEFAULT_CLIENT_ID);
      if (onToast) onToast('Reset to default rules & configuration.', 'info');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} className="text-secondary" />
            Application Settings
          </h3>
          <button className="btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={14} className="text-secondary" /> Google OAuth 2.0 Client ID
              </label>
              <input
                type="text"
                value={inputClientId}
                onChange={(e) => setInputClientId(e.target.value)}
                className="form-input"
                placeholder="xxxxxx.apps.googleusercontent.com"
                required
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
                Default pre-configured Client ID provided for instant OAuth testing.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleReset}
                style={{ color: '#ef4444' }}
              >
                <RotateCcw size={16} /> Reset All Defaults
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
