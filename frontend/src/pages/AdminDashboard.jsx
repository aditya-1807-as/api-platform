import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import StatCard from '../components/StatCard';
import { 
  ShieldAlert, 
  Users, 
  Key, 
  Activity, 
  Clock, 
  Server,
  Layers,
  History,
  CheckCircle2
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'keys' | 'logs'
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [keys, setKeys] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadSummary();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    else if (activeTab === 'keys') loadKeys();
    else if (activeTab === 'logs') loadLogs();
  }, [activeTab, page]);

  const loadSummary = async () => {
    try {
      const data = await adminService.getGlobalSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load admin summary', err);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers(page, 20);
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const loadKeys = async () => {
    setLoading(true);
    try {
      const data = await adminService.getKeys(page, 20);
      setKeys(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load keys', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await adminService.getGlobalHistory(page, 20);
      setLogs(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load global logs', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 className="page-title">Admin Management Center</h1>
            <span className="badge badge-revoked" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              ROLE_ADMIN ONLY
            </span>
          </div>
          <p className="page-subtitle">
            System-wide telemetry, user management, and security oversight across all platform tenants
          </p>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="stat-grid">
        <StatCard
          label="Global API Requests"
          value={summary?.totalRequests?.toLocaleString() || '0'}
          subtext={`${summary?.requestsToday?.toLocaleString() || '0'} across all users today`}
          icon={Activity}
          color="#6366f1"
        />
        <StatCard
          label="Successful (2xx)"
          value={summary?.successfulRequests?.toLocaleString() || '0'}
          subtext="Platform-wide deliveries"
          icon={CheckCircle2}
          color="#10b981"
        />
        <StatCard
          label="Failed Requests"
          value={summary?.failedRequests?.toLocaleString() || '0'}
          subtext="Rejections & rate limit 429s"
          icon={ShieldAlert}
          color="#ef4444"
        />
        <StatCard
          label="Global Avg Latency"
          value={`${summary?.avgResponseTimeMs || 0} ms`}
          subtext="Database execution time"
          icon={Clock}
          color="#06b6d4"
        />
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => { setActiveTab('users'); setPage(0); }}
        >
          <Users size={15} />
          <span>Registered Users</span>
        </button>

        <button
          className={`btn ${activeTab === 'keys' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => { setActiveTab('keys'); setPage(0); }}
        >
          <Key size={15} />
          <span>All API Keys</span>
        </button>

        <button
          className={`btn ${activeTab === 'logs' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => { setActiveTab('logs'); setPage(0); }}
        >
          <History size={15} />
          <span>Global Request Audit</span>
        </button>
      </div>

      {/* Tab Content: Users */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
                      Loading users from database...
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td style={{ fontWeight: 700 }}>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-warning' : 'badge-active'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {new Date(u.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Keys */}
      {activeTab === 'keys' && (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Key Name</th>
                  <th>Owner Email</th>
                  <th>Prefix Identifier</th>
                  <th>Status</th>
                  <th>Daily Quota</th>
                  <th>Monthly Quota</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
                      Loading all keys from database...
                    </td>
                  </tr>
                ) : (
                  keys.map((k) => (
                    <tr key={k.id}>
                      <td style={{ fontWeight: 700 }}>{k.name}</td>
                      <td>{k.ownerEmail}</td>
                      <td><span className="code-font">{k.keyPrefix}</span></td>
                      <td>
                        <span className={`badge ${k.status === 'ACTIVE' ? 'badge-active' : 'badge-revoked'}`}>
                          {k.status}
                        </span>
                      </td>
                      <td>{k.dailyQuota ? `${k.dailyQuota.toLocaleString()} reqs` : 'Unlimited'}</td>
                      <td>{k.monthlyQuota ? `${k.monthlyQuota.toLocaleString()} reqs` : 'Unlimited'}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {new Date(k.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Global Logs */}
      {activeTab === 'logs' && (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Key Prefix</th>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Status</th>
                  <th>Latency</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
                      Loading global audit logs from database...
                    </td>
                  </tr>
                ) : (
                  logs.map((l) => (
                    <tr key={l.id}>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {new Date(l.timestamp).toLocaleString()}
                      </td>
                      <td><span className="code-font">{l.apiKeyPrefix}</span></td>
                      <td>
                        <span className={`badge badge-method ${l.httpMethod === 'GET' ? 'badge-get' : 'badge-post'}`}>
                          {l.httpMethod}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{l.endpoint}</td>
                      <td>
                        <span className={`badge ${l.responseStatus >= 200 && l.responseStatus < 300 ? 'badge-2xx' : 'badge-4xx'}`}>
                          {l.responseStatus}
                        </span>
                      </td>
                      <td>{l.responseTimeMs} ms</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
