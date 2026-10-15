import React, { useState, useEffect } from 'react';
import { usageService } from '../services/usageService';
import { 
  BarChart3, 
  Calendar, 
  Activity, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Filter
} from 'lucide-react';

export default function UsageAnalytics() {
  const [days, setDays] = useState(30);
  const [dailyData, setDailyData] = useState([]);
  const [endpointData, setEndpointData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const [sum, daily, endpoints] = await Promise.all([
        usageService.getSummary(),
        usageService.getDailyUsage(days),
        usageService.getEndpointUsage(days),
      ]);
      setSummary(sum);
      setDailyData(daily || []);
      setEndpointData(endpoints || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const totalEndpointRequests = endpointData.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const maxDaily = Math.max(...dailyData.map((d) => d.count), 10);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Usage & Traffic Analytics</h1>
          <p className="page-subtitle">Deep dive into API consumption trends, endpoint distribution, and status codes</p>
        </div>

        {/* Date Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <Calendar size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Time Range:</span>
          <select 
            className="form-select" 
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="warning-callout" style={{ borderColor: 'var(--danger-border)', background: 'var(--danger-bg)', color: '#f87171' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* High-level metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card">
          <div className="stat-label">Total Period Volume</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.35rem' }}>
            {endpointData.reduce((acc, curr) => acc + curr.count, 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Across all active endpoints
          </div>
        </div>

        <div className="card">
          <div className="stat-label">Daily Average</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.35rem' }}>
            {Math.round(endpointData.reduce((acc, curr) => acc + curr.count, 0) / Math.max(days, 1)).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Requests per 24 hours
          </div>
        </div>

        <div className="card">
          <div className="stat-label">Success Rate</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#34d399', marginTop: '0.35rem' }}>
            {summary?.totalRequests ? `${Math.round((summary.successfulRequests / summary.totalRequests) * 100)}%` : '100%'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            HTTP 2xx responses
          </div>
        </div>

        <div className="card">
          <div className="stat-label">Avg Latency</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.35rem' }}>
            {summary?.avgResponseTimeMs || 0} ms
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Measured database duration
          </div>
        </div>
      </div>

      {/* Daily Traffic Breakdown */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">
            <BarChart3 size={18} color="var(--primary)" />
            <span>Daily Traffic Trend (Last {days} Days)</span>
          </h3>
        </div>

        {dailyData.length === 0 ? (
          <div className="empty-state">
            <Activity className="empty-state-icon" />
            <h4>No Traffic In Selected Range</h4>
            <p>Send requests through the API Live Tester to generate analytics.</p>
          </div>
        ) : (
          <div style={{ padding: '1rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '180px', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              {dailyData.map((d, idx) => {
                const heightPct = Math.max(Math.round((d.count / maxDaily) * 100), 5);
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      {d.count}
                    </span>
                    <div 
                      style={{ 
                        width: '100%', 
                        maxWidth: '28px', 
                        height: `${heightPct}%`, 
                        background: 'linear-gradient(180deg, #6366f1 0%, #06b6d4 100%)', 
                        borderRadius: '4px 4px 0 0',
                        border: '1px solid rgba(99, 102, 241, 0.4)'
                      }} 
                    />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      {d.day.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Endpoint Breakdown */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Layers size={18} color="var(--primary)" />
            <span>Endpoint Traffic Distribution</span>
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Grouped by path and HTTP method</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint Path</th>
                <th>Requests</th>
                <th>Traffic Share</th>
                <th>Enforcement Strategy</th>
              </tr>
            </thead>
            <tbody>
              {endpointData.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No endpoint traffic recorded yet.
                  </td>
                </tr>
              ) : (
                endpointData.map((ep, idx) => {
                  const sharePct = Math.round((ep.count / totalEndpointRequests) * 100);
                  return (
                    <tr key={idx}>
                      <td>
                        <span className={`badge badge-method ${ep.httpMethod === 'GET' ? 'badge-get' : 'badge-post'}`}>
                          {ep.httpMethod}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{ep.endpoint}</td>
                      <td style={{ fontWeight: 700 }}>{ep.count.toLocaleString()}</td>
                      <td style={{ width: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="progress-container" style={{ margin: 0, height: '6px' }}>
                            <div className="progress-bar" style={{ width: `${sharePct}%` }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', minWidth: '35px' }}>
                            {sharePct}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: '#38bdf8' }}>
                          X-API-Key + Atomic Quota
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
