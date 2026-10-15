import React, { useState } from 'react';
import { keyService } from '../services/keyService';
import { AlertTriangle, X } from 'lucide-react';

export default function RevokeKeyModal({ isOpen, onClose, apiKey, onRevoked }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !apiKey) return null;

  const handleRevoke = async () => {
    setLoading(true);
    setError('');
    try {
      await keyService.revokeKey(apiKey.id);
      if (onRevoked) {
        onRevoked();
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to revoke key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} />
            <span>Revoke API Key</span>
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="warning-callout" style={{ borderColor: 'var(--danger-border)', background: 'var(--danger-bg)', color: '#f87171' }}>
            <span>{error}</span>
          </div>
        )}

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
          Are you sure you want to revoke the API key <strong style={{ color: 'var(--text-primary)' }}>"{apiKey.name}"</strong> (<span className="code-font">{apiKey.keyPrefix}</span>)?
        </p>

        <div className="warning-callout">
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>This action is immediate and cannot be undone. All incoming requests using this key will be rejected with HTTP 403 Forbidden.</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={handleRevoke} disabled={loading}>
            {loading ? 'Revoking...' : 'Yes, Revoke Key'}
          </button>
        </div>
      </div>
    </div>
  );
}
