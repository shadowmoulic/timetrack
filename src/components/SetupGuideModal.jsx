import React from 'react';
import { X, HelpCircle, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { DEFAULT_CLIENT_ID } from '../config';

export default function SetupGuideModal({ isOpen, onClose, clientId, onToast }) {
  if (!isOpen) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    if (onToast) onToast('Copied to clipboard!', 'success');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={20} className="text-secondary" />
            Google Cloud Console Setup & OAuth Guide
          </h3>
          <button className="btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
            To sync live calendar events directly from your Google account, follow these simple setup steps in your Google Cloud Console.
          </p>

          {/* Active Credentials Summary Box */}
          <div className="step-box" style={{ background: 'rgba(99, 102, 241, 0.08)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', color: '#818cf8', fontSize: '0.9rem' }}>
                Pre-Configured Client ID:
              </span>
              <button 
                className="btn btn-secondary" 
                onClick={() => copyToClipboard(clientId || DEFAULT_CLIENT_ID)}
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              >
                <Copy size={12} /> Copy
              </button>
            </div>
            <div className="code-block" style={{ marginTop: '6px' }}>
              {clientId || DEFAULT_CLIENT_ID}
            </div>
          </div>

          {/* Step 1 */}
          <div className="step-box">
            <div>
              <span className="step-number">1</span>
              <strong style={{ color: 'var(--text-primary)' }}>Open Google Cloud Console & Create Project</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>Google Cloud Console <ExternalLink size={12} /></a> and select or create a new project named <strong>TimeTrack</strong>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="step-box">
            <div>
              <span className="step-number">2</span>
              <strong style={{ color: 'var(--text-primary)' }}>Enable Google Calendar API</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Navigate to <strong>APIs & Services → Library</strong>, search for <code>Google Calendar API</code>, and click <strong>Enable</strong>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="step-box">
            <div>
              <span className="step-number">3</span>
              <strong style={{ color: 'var(--text-primary)' }}>Configure OAuth Consent Screen & Test Users</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Go to <strong>OAuth consent screen</strong>:
            </p>
            <ul style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginLeft: '24px', marginTop: '6px' }}>
              <li>User Type: <strong>External</strong>.</li>
              <li>Scope: Add <code>https://www.googleapis.com/auth/calendar.readonly</code>.</li>
              <li>Test Users: Add your Google email address under <strong>Test users</strong>.</li>
            </ul>
          </div>

          {/* Step 4 */}
          <div className="step-box">
            <div>
              <span className="step-number">4</span>
              <strong style={{ color: 'var(--text-primary)' }}>Create Web Application OAuth 2.0 Credentials</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Go to <strong>Credentials → Create Credentials → OAuth client ID</strong>.
            </p>
            <div style={{ marginTop: '8px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Set Authorized JavaScript origins:
            </div>
            <div className="code-block" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>http://localhost:5173</span>
              <button 
                onClick={() => copyToClipboard("http://localhost:5173")}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <Copy size={14} />
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={onClose}>
              <CheckCircle size={16} /> Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
