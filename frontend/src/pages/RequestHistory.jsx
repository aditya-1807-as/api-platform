import React, { useState, useEffect } from 'react';
import { usageService } from '../services/usageService';
import { keyService } from '../services/keyService';
import { 
  History, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  RefreshCw,
  Terminal
} from 'lucide-react';

export default function RequestHistory() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [keys, setKeys] = useState([]);
  const [selectedKeyId, setSelectedKeyId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKeys();
  }, []);

  useEffect(() => {
    loadLogs();
  }, [page, selectedKeyId]);

  const loadKeys = async () => {
    try {
      const data = await keyService.listKeys();
      setKeys(data || []);
    } catch {
      // ignore
    }
  };

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await usageService.getHistory(
        selectedKeyId ? selectedKeyId : null,
        page,
        20
      );
      setLogs(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      console.error('Failed to load request history', err);
    } finally {
      setLoading(false);
    }
  };

  // Local search filter for quick inspection
  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      log.endpoint?.toLowerCase().includes(term) ||
      log.apiKeyPrefix?.toLowerCase().includes(term) ||
      log.apiKeyName?.toLowerCase().includes(term) ||
      String(log.responseStatus).includes(term)
    );
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Request Logs & Audit Trail</h1>
          <p className="page-subtitle">
            Inspect individual API executions, response codes, and round-trip durations
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={loadLogs}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '260px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
                placeholder="Filter by endpoint, status code, or key..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            <div style={{ width: '220px' }}>
              <select
                className="form-select"
                style={{ fontSize: '0.85rem' }}
                value={selectedKeyId}
                onChange={(e) => {
                  setSelectedKeyId(e.target.value);
                  setPage(0);
                }}
              >
                <option value="">All API Keys</option>
                {keys.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name} ({k.keyPrefix})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing <strong>{filteredLogs.length}</strong> of <strong>{totalElements}</strong> entries
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Timestamp (UTC)</th>
                <th>API Key</th>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Status</th>
                <th>Latency</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    Querying request logs from MySQL...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <History size={36} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
                    <div style={{ fontWeight: 600 }}>No Request Logs Found</div>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      Execute a request using your key in the <a href="/tester" style={{ color: 'var(--primary)' }}>API Live Tester</a>.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{log.apiKeyName || 'Unknown Key'}</div>
                        <span className="code-font" style={{ fontSize: '0.75rem' }}>{log.apiKeyPrefix}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-method ${log.httpMethod === 'GET' ? 'badge-get' : 'badge-post'}`}>
                        {log.httpMethod}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.85rem' }}>
                      {log.endpoint}
                    </td>
                    <td>
                      <span className={`badge ${log.responseStatus >= 200 && log.responseStatus < 300 ? 'badge-2xx' : 'badge-4xx'}`}>
                        {log.responseStatus}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                        <Clock size={13} color="var(--text-muted)" />
                        <span>{log.responseTimeMs} ms</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="pagination">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0 || loading}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Page <strong>{page + 1}</strong> of <strong>{Math.max(totalPages, 1)}</strong>
          </span>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page + 1 >= totalPages || loading}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
