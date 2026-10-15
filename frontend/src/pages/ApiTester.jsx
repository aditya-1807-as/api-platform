import React, { useState, useEffect } from 'react';
import { keyService } from '../services/keyService';
import { demoService } from '../services/demoService';
import { Terminal, Play, CheckCircle2, AlertCircle, Clock, Send } from 'lucide-react';

export default function ApiTester() {
  const [keys, setKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState('');
  const [endpoint, setEndpoint] = useState('/api/v1/demo/profile');
  const [method, setMethod] = useState('GET');
  const [requestBody, setRequestBody] = useState('{\n  "client": "web-dashboard",\n  "message": "Hello from KeyShield demo!"\n}');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      const data = await keyService.listKeys();
      setKeys(data || []);
    } catch {
      // ignore
    }
  };

  const handleEndpointChange = (ep) => {
    setEndpoint(ep);
    if (ep === '/api/v1/demo/echo') {
      setMethod('POST');
    } else {
      setMethod('GET');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedKey.trim()) {
      alert('Please enter or paste a valid API Key to test (e.g. ak_live_...)');
      return;
    }

    setLoading(true);
    setResponse(null);

    let res;
    if (endpoint === '/api/v1/demo/profile') {
      res = await demoService.callProfile(selectedKey.trim());
    } else if (endpoint === '/api/v1/demo/data') {
      res = await demoService.callData(selectedKey.trim());
    } else if (endpoint === '/api/v1/demo/echo') {
      let parsed = {};
      try {
        parsed = JSON.parse(requestBody);
      } catch {
        alert('Invalid JSON in request body');
        setLoading(false);
        return;
      }
      res = await demoService.callEcho(selectedKey.trim(), parsed);
    }

    setResponse(res);
    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">API Live Tester</h1>
          <p className="page-subtitle">
            Execute real-time requests against protected demo endpoints using the <span className="code-font">X-API-Key</span> header
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Request Panel */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Terminal size={18} color="var(--primary)" />
              <span>Request Builder</span>
            </h3>
          </div>

          <form onSubmit={handleSend}>
            <div className="form-group">
              <label className="form-label">API Key (Raw Secret)</label>
              <input
                type="text"
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)' }}
                placeholder="ak_live_..."
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Paste your generated key here or use an invalid/revoked key to test error handling
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Endpoint</label>
              <select
                className="form-select"
                value={endpoint}
                onChange={(e) => handleEndpointChange(e.target.value)}
              >
                <option value="/api/v1/demo/profile">GET /api/v1/demo/profile (Key details & echo)</option>
                <option value="/api/v1/demo/data">GET /api/v1/demo/data (Sample dataset)</option>
                <option value="/api/v1/demo/echo">POST /api/v1/demo/echo (Echo JSON payload)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Method:</span>
                <span className={`badge badge-method ${method === 'GET' ? 'badge-get' : 'badge-post'}`}>
                  {method}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Auth Header:</span>
                <span className="code-font">X-API-Key</span>
              </div>
            </div>

            {method === 'POST' && (
              <div className="form-group">
                <label className="form-label">JSON Request Body</label>
                <textarea
                  className="form-textarea"
                  style={{ fontFamily: 'var(--font-mono)', minHeight: '120px' }}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              <Send size={16} />
              <span>{loading ? 'Sending Request...' : 'Send Request'}</span>
            </button>
          </form>
        </div>

        {/* Response Panel */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <span>Response Console</span>
            </h3>
            {response && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <Clock size={14} />
                  <span>{response.duration} ms</span>
                </div>
                <span className={`badge ${response.status >= 200 && response.status < 300 ? 'badge-2xx' : 'badge-4xx'}`}>
                  HTTP {response.status}
                </span>
              </div>
            )}
          </div>

          {!response && !loading && (
            <div className="empty-state">
              <Terminal className="empty-state-icon" />
              <h4>No Request Sent Yet</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Choose an endpoint and click <strong>Send Request</strong> to execute a live API call.
              </p>
            </div>
          )}

          {loading && (
            <div className="empty-state">
              <div style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Authenticating key & validating quota...</div>
            </div>
          )}

          {response && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                {response.success ? (
                  <>
                    <CheckCircle2 size={16} color="#10b981" />
                    <span style={{ color: '#34d399', fontWeight: 600 }}>Request Authenticated & Logged</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} color="#ef4444" />
                    <span style={{ color: '#f87171', fontWeight: 600 }}>
                      {response.status === 429 ? 'Quota Exceeded (HTTP 429)' : response.status === 403 ? 'Forbidden (HTTP 403)' : 'Unauthorized (HTTP 401)'}
                    </span>
                  </>
                )}
              </div>

              <div className="console-box">
                <pre>{JSON.stringify(response.data, null, 2)}</pre>
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Tip: Head over to <a href="/logs" style={{ color: 'var(--primary)' }}>Request Logs</a> or <a href="/usage" style={{ color: 'var(--primary)' }}>Usage Analytics</a> to see this request reflected in real-time database queries!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
