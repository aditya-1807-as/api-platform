import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { modelService } from '../services/modelService';
import { keyService } from '../services/keyService';
import { 
  Send, 
  Sparkles, 
  Sliders, 
  Trash2, 
  Code2, 
  Copy, 
  Check, 
  Cpu, 
  Bot, 
  User, 
  Clock, 
  Coins,
  ChevronDown,
  AlertCircle
} from 'lucide-react';

export default function Playground() {
  const [searchParams] = useSearchParams();
  const initialModel = searchParams.get('model') || 'anthropic/claude-3.5-sonnet';

  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [keys, setKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState('');
  
  // Parameters
  const [systemPrompt, setSystemPrompt] = useState('You are an expert AI software architect and senior developer.');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [showSettings, setShowSettings] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Chat conversation state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am connected via the **KeyShield OpenRouter Gateway**. Ask me to write code, design an architecture, analyze an algorithm, or test API quota limits.',
      timestamp: new Date().toLocaleTimeString(),
      model: initialModel,
      duration: 15,
      tokens: 45
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const chatEndRef = useRef(null);

  useEffect(() => {
    loadModelsAndKeys();
  }, []);

  const loadModelsAndKeys = async () => {
    try {
      const [modelsData, keysData] = await Promise.all([
        modelService.getModels(),
        keyService.listKeys()
      ]);
      setModels(modelsData || []);
      setKeys(keysData || []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    if (!selectedKey.trim()) {
      setError('Please select or paste an API Key in the top bar to send requests.');
      return;
    }

    setError('');
    const userText = inputMessage.trim();
    setInputMessage('');

    const newMessages = [
      ...messages,
      {
        role: 'user',
        content: userText,
        timestamp: new Date().toLocaleTimeString()
      }
    ];

    setMessages(newMessages);
    setLoading(true);

    // Prepare API messages including system prompt if set
    const apiPayloadMessages = [];
    if (systemPrompt.trim()) {
      apiPayloadMessages.push({ role: 'system', content: systemPrompt.trim() });
    }
    newMessages.forEach((m) => {
      apiPayloadMessages.push({ role: m.role, content: m.content });
    });

    const res = await modelService.sendChatCompletion(
      selectedKey.trim(),
      selectedModel,
      apiPayloadMessages,
      temperature,
      maxTokens
    );

    setLoading(false);

    if (res.success && res.data?.choices?.length > 0) {
      const choice = res.data.choices[0];
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: choice.message?.content || 'No response generated.',
          timestamp: new Date().toLocaleTimeString(),
          model: res.data.model,
          duration: res.duration,
          tokens: res.data.usage?.total_tokens || 100
        }
      ]);
    } else {
      setError(res.error || 'Failed to complete message');
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError('');
  };

  const getCodeSnippet = (lang) => {
    if (lang === 'curl') {
      return `curl -X POST https://api.keyshield.io/api/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${selectedKey || 'ak_live_YOUR_KEY'}" \\
  -d '{
    "model": "${selectedModel}",
    "messages": [
      {"role": "user", "content": "${messages[messages.length - 1]?.content || 'Hello!'}"}
    ],
    "temperature": ${temperature}
  }'`;
    }
    if (lang === 'python') {
      return `from openai import OpenAI

# Compatible with the official OpenAI Python SDK
client = OpenAI(
    base_url="http://localhost:8080/api/v1",
    api_key="${selectedKey || 'ak_live_YOUR_KEY'}"
)

response = client.chat.completions.create(
    model="${selectedModel}",
    messages=[
        {"role": "user", "content": "Hello world!"}
    ],
    temperature=${temperature}
)

print(response.choices[0].message.content)`;
    }
    return `import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "http://localhost:8080/api/v1",
  apiKey: "${selectedKey || 'ak_live_YOUR_KEY'}",
});

const completion = await openai.chat.completions.create({
  model: "${selectedModel}",
  messages: [{ role: "user", content: "Hello world!" }],
});

console.log(completion.choices[0].message.content);`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Top Toolbar */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Model Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Model:</span>
            <select
              className="form-select"
              style={{ width: '260px', padding: '0.4rem 0.75rem', fontSize: '0.875rem', fontWeight: 600 }}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.provider})
                </option>
              ))}
            </select>
          </div>

          {/* Key Input / Quick Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>API Key:</span>
            <input
              type="text"
              className="form-input"
              style={{ width: '220px', padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
              placeholder="Paste ak_live_... key"
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
            />
            {keys.length > 0 && !selectedKey && (
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
                Tip: Copy from <Link to="/keys" style={{ color: 'var(--primary)' }}>API Keys</Link>
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => setShowCodeModal(true)}
            title="View SDK code snippet"
          >
            <Code2 size={15} />
            <span>API Code</span>
          </button>

          <button 
            className={`btn ${showSettings ? 'btn-primary' : 'btn-secondary'} btn-sm`} 
            onClick={() => setShowSettings(!showSettings)}
            title="Model parameters"
          >
            <Sliders size={15} />
            <span>Parameters</span>
          </button>

          <button 
            className="btn btn-secondary btn-icon btn-sm" 
            onClick={handleClearChat}
            title="Clear Chat Thread"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Main Workspace (Thread + Optional Settings Panel) */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Chat Feed */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--bg-main)' }}>
          {error && (
            <div style={{ margin: '1rem 1.5rem 0', padding: '0.75rem 1rem', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Messages Container */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {messages.map((m, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  maxWidth: '850px',
                  width: '100%',
                  margin: '0 auto',
                  alignSelf: 'center'
                }}
              >
                {/* Avatar */}
                <div 
                  style={{ 
                    width: '34px', 
                    height: '34px', 
                    borderRadius: 'var(--radius-md)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0,
                    background: m.role === 'assistant' ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : 'var(--bg-surface-elevated)',
                    color: 'white',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {m.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                </div>

                {/* Message Body */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {m.role === 'assistant' ? 'Assistant' : 'You'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {m.timestamp}
                    </span>
                  </div>

                  <div 
                    style={{ 
                      background: m.role === 'assistant' ? 'var(--bg-card)' : 'var(--bg-surface)', 
                      border: '1px solid var(--border-subtle)', 
                      borderRadius: 'var(--radius-lg)', 
                      padding: '1.15rem', 
                      fontSize: '0.925rem', 
                      lineHeight: 1.6,
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {m.content}
                  </div>

                  {/* Telemetry Footer for Assistant Responses */}
                  {m.role === 'assistant' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={12} />
                        <span>{m.duration} ms</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Coins size={12} />
                        <span>{m.tokens} tokens</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Cpu size={12} />
                        <span className="code-font" style={{ fontSize: '0.7rem' }}>{m.model}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '1rem', maxWidth: '850px', width: '100%', margin: '0 auto', alignSelf: 'center' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Sparkles size={18} className="animate-spin" />
                </div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Streaming response through {selectedModel}...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
            <form 
              onSubmit={handleSend}
              style={{ 
                maxWidth: '850px', 
                margin: '0 auto', 
                display: 'flex', 
                gap: '0.75rem', 
                alignItems: 'center',
                background: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.4rem 0.6rem 0.4rem 1rem'
              }}
            >
              <textarea
                style={{ 
                  flex: 1, 
                  background: 'transparent', 
                  border: 'none', 
                  outline: 'none', 
                  color: 'var(--text-primary)', 
                  fontFamily: 'var(--font-main)',
                  fontSize: '0.9rem',
                  resize: 'none',
                  maxHeight: '120px',
                  minHeight: '24px'
                }}
                rows={1}
                placeholder={`Ask ${selectedModel.split('/')[1] || 'AI'} anything... (Press Enter to send)`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button 
                type="submit" 
                className="btn btn-primary btn-sm"
                style={{ padding: '0.5rem 0.9rem', borderRadius: 'var(--radius-md)' }}
                disabled={loading || !inputMessage.trim()}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>

        {/* Parameters Sidebar Drawer */}
        {showSettings && (
          <div style={{ width: '320px', background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-subtle)', padding: '1.5rem', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Inference Parameters</h3>
              <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setShowSettings(false)}>
                &times;
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">System Instructions</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Instruct the model on its persona, guidelines, or formatting rules..."
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label">Temperature</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Lower values are more deterministic; higher values are more creative.
              </span>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label">Max Completion Tokens</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{maxTokens}</span>
              </div>
              <input
                type="range"
                min="128"
                max="4096"
                step="128"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Code Export Modal */}
      {showCodeModal && (
        <div className="modal-overlay" onClick={() => setShowCodeModal(false)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code2 color="var(--primary)" />
                <span>Integration Snippet</span>
              </h3>
              <button className="modal-close" onClick={() => setShowCodeModal(false)}>&times;</button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Call this model directly using standard OpenAI SDKs or cURL by passing your KeyShield API key:
            </p>

            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <div className="console-box" style={{ maxHeight: '240px' }}>
                <pre>{getCodeSnippet('python')}</pre>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}
                onClick={() => {
                  navigator.clipboard.writeText(getCodeSnippet('python'));
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
              >
                {copiedCode ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copiedCode ? 'Copied' : 'Copy Python'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary btn-sm" onClick={() => setShowCodeModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
