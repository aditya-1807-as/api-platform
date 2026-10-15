import React, { useState } from 'react';
import { keyService } from '../services/keyService';
import { X, Copy, Check, AlertTriangle, Key, ShieldCheck } from 'lucide-react';

export default function CreateKeyModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [dailyQuota, setDailyQuota] = useState('');
  const [monthlyQuota, setMonthlyQuota] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Result state (shown once key is created)
  const [createdKey, setCreatedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Key name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: name.trim(),
        dailyQuota: dailyQuota ? parseInt(dailyQuota, 10) : null,
        monthlyQuota: monthlyQuota ? parseInt(monthlyQuota, 10) : null,
        expiresInDays: expiresInDays ? parseInt(expiresInDays, 10) : null,
      };

      const result = await keyService.createKey(payload);
      setCreatedKey(result);
      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      setError(err.message || 'Failed to generate API Key');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (createdKey?.rawSecretKey) {
      navigator.clipboard.writeText(createdKey.rawSecretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleClose = () => {
    setName('');
    setDailyQuota('');
    setMonthlyQuota('');
    setExpiresInDays('');
    setError('');
    setCreatedKey(null);
    setCopied(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {createdKey ? <ShieldCheck color="#10b981" /> : <Key color="#6366f1" />}
            <span>{createdKey ? 'API Key Generated' : 'Create New API Key'}</span>
          </h3>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="warning-callout" style={{ borderColor: 'var(--danger-border)', background: 'var(--danger-bg)', color: '#f87171' }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {!createdKey ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Key Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Production Billing Service"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Daily Request Quota</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 5000 (optional)"
                  value={dailyQuota}
                  min="1"
                  onChange={(e) => setDailyQuota(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Request Quota</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 100000 (optional)"
                  value={monthlyQuota}
                  min="1"
                  onChange={(e) => setMonthlyQuota(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Expiration (Days from now)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 30, 90, 365 (blank for never)"
                value={expiresInDays}
                min="1"
                onChange={(e) => setExpiresInDays(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Generating...' : 'Create API Key'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="warning-callout">
              <AlertTriangle size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>Important:</strong> Please copy your secret key right now.
                For security reasons, this full key will <strong>never</strong> be displayed again.
              </div>
            </div>

            <div className="secret-key-box">
              <span className="secret-key-text">{createdKey.rawSecretKey}</span>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={handleCopy}
                style={{ flexShrink: 0 }}
              >
                {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Prefix Identifier:</span>
                <span className="code-font">{createdKey.keyPrefix}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Daily Quota:</span>
                <span>{createdKey.dailyQuota ? `${createdKey.dailyQuota.toLocaleString()} reqs` : 'Unlimited'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Monthly Quota:</span>
                <span>{createdKey.monthlyQuota ? `${createdKey.monthlyQuota.toLocaleString()} reqs` : 'Unlimited'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-primary" onClick={handleClose}>
                I Have Saved My Key
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
