import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { keyService } from '../services/keyService';
import { usageService } from '../services/usageService';
import RevokeKeyModal from '../components/RevokeKeyModal';
import { 
  ArrowLeft, 
  Key, 
  Trash2, 
  Terminal, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Activity,
  AlertCircle
} from 'lucide-react';

export default function KeyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [key, setKey] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);

  useEffect(() => {
    loadKeyData();
  }, [id]);

  const loadKeyData = async () => {
    setLoading(true);
    setError('');
    try {
      const [keyData, logsData] = await Promise.all([
        keyService.getKey(id),
        usageService.getHistory(id, 0, 10),
      ]);
      setKey(keyData);
      setLogs(logsData?.content || []);
    } catch (err) {
      setError(err.message || 'Failed to load API key details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading API key metadata...</div>
      </div>
    );
  }

  if (error || !key) {
    return (
      <div className="page-container">
        <div className="warning-callout" style={{ borderColor: 'var(--danger-border)', background: 'var(--danger-bg)', color: '#f87171' }}>
          <AlertCircle size={20} />
          <span>{error || 'API Key not found'}</span>
        </div>
        <Link to="/keys" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to API Keys</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/keys" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>
          <ArrowLeft size={15} />
          <span>Back to API Keys</span>
        </Link>
      </div>

      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className="page-title">{key.name}</h1>
            <span className={`badge ${key.status === 'ACTIVE' ? 'badge-active' : 'badge-revoked'}`}>
              {key.status}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Non-Secret Prefix:</span>
            <span className="code-font">{key.keyPrefix}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/tester" className="btn btn-secondary">
            <Terminal size={16} />
            <span>Test In Live Console</span>
          </Link>
          {key.status === 'ACTIVE' && (
            <button className="btn btn-danger" onClick={() => setIsRevokeOpen(true)}>
              <Trash2 size={16} />
              <span>Revoke Key</span>
            </button>
          )}
        </div>
      </div>

      {/* Metadata Overview Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card">
          <div className="stat-label">Daily Limit</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.35rem' }}>
            {key.dailyQuota ? `${key.dailyQuota.toLocaleString()} reqs` : 'Unlimited'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Enforced via MySQL atomic counter
          </div>
        </div>

        <div className="card">
          <div className="stat-label">Monthly Limit</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.35rem' }}>
            {key.monthlyQuota ? `${key.monthlyQuota.toLocaleString()} reqs` : 'Unlimited'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Enforced via monthly calendar window
          </div>
        </div>

        <div className="card">
          <div className="stat-label">Created At</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.35rem' }}>
            {new Date(key.createdAt).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Stored securely with SHA-256 hash
          </div>
        </div>

        <div className="card">
          <div className="stat-label">Expiration Date</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.35rem' }}>
            {key.expiresAt ? new Date(key.expiresAt).toLocaleDateString() : 'Never Expires'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {key.expiresAt ? 'Automatic expiration check' : 'Permanent token'}
          </div>
        </div>
      </div>

      {/* Recent Request Logs for this Key */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Activity size={18} color="var(--primary)" />
            <span>Recent Requests for this Key</span>
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest 10 executions</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Status</th>
                <th>Latency</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No request traffic recorded yet for this key.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span className={`badge badge-method ${log.httpMethod === 'GET' ? 'badge-get' : 'badge-post'}`}>
                        {log.httpMethod}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{log.endpoint}</td>
                    <td>
                      <span className={`badge ${log.responseStatus >= 200 && log.responseStatus < 300 ? 'badge-2xx' : 'badge-4xx'}`}>
                        {log.responseStatus}
                      </span>
                    </td>
                    <td>{log.responseTimeMs} ms</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RevokeKeyModal
        isOpen={isRevokeOpen}
        apiKey={key}
        onClose={() => setIsRevokeOpen(false)}
        onRevoked={() => {
          loadKeyData();
          setIsRevokeOpen(false);
        }}
      />
    </div>
  );
}
