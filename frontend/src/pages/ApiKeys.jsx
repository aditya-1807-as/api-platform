import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { keyService } from '../services/keyService';
import CreateKeyModal from '../components/CreateKeyModal';
import RevokeKeyModal from '../components/RevokeKeyModal';
import { Key, Plus, Trash2, Eye, ShieldCheck, Clock, Calendar } from 'lucide-react';

export default function ApiKeys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [revokingKey, setRevokingKey] = useState(null);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    setLoading(true);
    try {
      const data = await keyService.listKeys();
      setKeys(data || []);
    } catch (err) {
      console.error('Failed to load keys', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">API Keys Management</h1>
          <p className="page-subtitle">Generate, inspect metadata, configure quotas, and revoke API credentials</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} />
          <span>Generate New Key</span>
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Key Name</th>
                <th>Prefix Identifier</th>
                <th>Daily Quota</th>
                <th>Monthly Quota</th>
                <th>Status</th>
                <th>Created</th>
                <th>Expires</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
                    Loading API keys from MySQL...
                  </td>
                </tr>
              ) : keys.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <Key size={36} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
                    <div style={{ fontWeight: 600 }}>No API Keys Created Yet</div>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      Click <strong>Generate New Key</strong> above to create your first secure API key.
                    </p>
                  </td>
                </tr>
              ) : (
                keys.map((k) => (
                  <tr key={k.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{k.name}</div>
                    </td>
                    <td>
                      <span className="code-font">{k.keyPrefix}</span>
                    </td>
                    <td>
                      {k.dailyQuota ? `${k.dailyQuota.toLocaleString()} reqs` : <span style={{ color: 'var(--text-muted)' }}>Unlimited</span>}
                    </td>
                    <td>
                      {k.monthlyQuota ? `${k.monthlyQuota.toLocaleString()} reqs` : <span style={{ color: 'var(--text-muted)' }}>Unlimited</span>}
                    </td>
                    <td>
                      <span className={`badge ${k.status === 'ACTIVE' ? 'badge-active' : 'badge-revoked'}`}>
                        {k.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {new Date(k.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {k.expiresAt ? new Date(k.expiresAt).toLocaleDateString() : 'Never'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Link 
                          to={`/keys/${k.id}`} 
                          className="btn btn-secondary btn-icon btn-sm"
                          title="View Details & Quota Telemetry"
                        >
                          <Eye size={15} />
                        </Link>
                        {k.status === 'ACTIVE' && (
                          <button
                            className="btn btn-danger btn-icon btn-sm"
                            title="Revoke Key Immediately"
                            onClick={() => setRevokingKey(k)}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateKeyModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={loadKeys}
      />

      <RevokeKeyModal
        isOpen={!!revokingKey}
        apiKey={revokingKey}
        onClose={() => setRevokingKey(null)}
        onRevoked={loadKeys}
      />
    </div>
  );
}
