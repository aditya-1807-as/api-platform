import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Terminal,
  Zap,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Lock,
  Database,
  BarChart3,
  Layers,
  CheckCircle2,
  Code2,
  MessageSquare,
  Key,
  Shield,
  Activity,
  ChevronRight
} from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeCodeTab, setActiveCodeTab] = useState('curl');
  const [copied, setCopied] = useState(false);
  const [activeModelFilter, setActiveModelFilter] = useState('all');

  const codeSnippets = {
    curl: `curl http://localhost:8080/api/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ksh_live_9b2d8e74a1f503c847e2" \\
  -d '{
    "model": "anthropic/claude-3.5-sonnet",
    "messages": [
      {
        "role": "user",
        "content": "Explain zero-knowledge key hashing in two sentences."
      }
    ]
  }'`,
    python: `from openai import OpenAI

# Drop-in compatibility: point client to KeyShield Gateway
client = OpenAI(
    base_url="http://localhost:8080/api/v1",
    api_key="ksh_live_9b2d8e74a1f503c847e2"
)

response = client.chat.completions.create(
    model="anthropic/claude-3.5-sonnet",
    messages=[
        {"role": "user", "content": "Explain zero-knowledge key hashing."}
    ]
)

print(response.choices[0].message.content)`,
    javascript: `import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "http://localhost:8080/api/v1",
  apiKey: "ksh_live_9b2d8e74a1f503c847e2",
});

const completion = await openai.chat.completions.create({
  model: "openai/gpt-4o",
  messages: [{ role: "user", content: "Optimize this SQL query for MySQL 8." }],
});

console.log(completion.choices[0].message.content);`,
    java: `// Java 21 HttpClient - Native drop-in
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("http://localhost:8080/api/v1/chat/completions"))
    .header("Authorization", "Bearer ksh_live_9b2d8e74a1f503c847e2")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString("""
      {
        "model": "deepseek/deepseek-chat",
        "messages": [{"role": "user", "content": "Hello DeepSeek!"}]
      }
    """))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modelsList = [
    {
      id: 'anthropic/claude-3.5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      category: 'reasoning',
      badgeColor: '#ec4899',
      contextWindow: '200,000 tokens',
      inputCost: '$3.00 / 1M',
      outputCost: '$15.00 / 1M',
      description: 'Frontier reasoning, superior coding architecture, and complex instruction following.',
      latency: '~280ms',
      tag: 'Most Popular'
    },
    {
      id: 'openai/gpt-4o',
      name: 'GPT-4o Omnimodal',
      provider: 'OpenAI',
      category: 'multimodal',
      badgeColor: '#10b981',
      contextWindow: '128,000 tokens',
      inputCost: '$2.50 / 1M',
      outputCost: '$10.00 / 1M',
      description: 'High-speed flagship omni model for advanced multimodal text, vision, and logic analysis.',
      latency: '~240ms',
      tag: 'Flagship'
    },
    {
      id: 'deepseek/deepseek-chat',
      name: 'DeepSeek V3',
      provider: 'DeepSeek',
      category: 'budget',
      badgeColor: '#06b6d4',
      contextWindow: '64,000 tokens',
      inputCost: '$0.14 / 1M',
      outputCost: '$0.28 / 1M',
      description: 'State-of-the-art open-weights architecture with breakthrough ultra-low per-token costs.',
      latency: '~310ms',
      tag: 'Ultra Low Cost'
    },
    {
      id: 'google/gemini-2.0-flash',
      name: 'Gemini 2.0 Flash',
      provider: 'Google',
      category: 'multimodal',
      badgeColor: '#3b82f6',
      contextWindow: '1,048,576 tokens',
      inputCost: '$0.10 / 1M',
      outputCost: '$0.40 / 1M',
      description: 'Ultra-fast inference latency with an immense 1-Million token context window for massive documents.',
      latency: '~120ms',
      tag: '1M Context'
    },
    {
      id: 'meta-llama/llama-3.3-70b-instruct',
      name: 'Llama 3.3 70B Instruct',
      provider: 'Meta',
      category: 'reasoning',
      badgeColor: '#a855f7',
      contextWindow: '128,000 tokens',
      inputCost: '$0.40 / 1M',
      outputCost: '$0.40 / 1M',
      description: 'The open benchmark leader. Industry-grade reasoning without proprietary vendor lock-in.',
      latency: '~290ms',
      tag: 'Open Weights'
    },
    {
      id: 'mistralai/mistral-large-2407',
      name: 'Mistral Large 2',
      provider: 'Mistral AI',
      category: 'reasoning',
      badgeColor: '#f97316',
      contextWindow: '128,000 tokens',
      inputCost: '$2.00 / 1M',
      outputCost: '$6.00 / 1M',
      description: 'European frontier model with exceptional multi-language fluency and technical precision.',
      latency: '~320ms',
      tag: 'Multilingual'
    }
  ];

  const filteredModels = modelsList.filter((m) => {
    if (activeModelFilter === 'all') return true;
    return m.category === activeModelFilter;
  });

  return (
    <div className="landing-page">
      {/* Top Ambient Glow */}
      <div className="landing-ambient-glow" />

      {/* Sticky Modern Top Navigation */}
      <header className="landing-navbar">
        <div className="landing-nav-inner">
          {/* Logo & Brand */}
          <Link to="/" className="landing-brand">
            <div className="landing-brand-logo">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="landing-brand-title">KeyShield</div>
              <div className="landing-brand-tag">OpenRouter Gateway</div>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="landing-nav-links">
            <a href="#models" className="landing-nav-link">Models</a>
            <a href="#code" className="landing-nav-link">API Integration</a>
            <a href="#architecture" className="landing-nav-link">Architecture</a>
            <a href="#security" className="landing-nav-link">Security</a>
            <a href="#comparison" className="landing-nav-link">Comparison</a>
            <a 
              href="http://localhost:8080/swagger-ui/index.html" 
              target="_blank" 
              rel="noreferrer" 
              className="landing-nav-link"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <span>API Docs</span>
              <ExternalLink size={12} />
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="landing-nav-actions">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Hi, <strong style={{ color: 'var(--text-primary)' }}>{user.fullName || user.email}</strong>
                </span>
                <Link to="/dashboard" className="btn-glow-primary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}>
                  <span>Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-landing-secondary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn-glow-primary" style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}>
                  <span>Get API Key</span>
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-pill-badge">
          <Sparkles size={14} color="#818cf8" />
          <span>Next-Generation OpenRouter AI Gateway & Key Governance</span>
        </div>

        <h1 className="hero-heading">
          One Unified Gateway for{' '}
          <span className="hero-gradient-text">Frontier AI Models</span> & Enterprise Keys
        </h1>

        <p className="hero-subheading">
          Connect your applications to <strong>Claude 3.5 Sonnet</strong>, <strong>GPT-4o</strong>, <strong>DeepSeek V3</strong>, and <strong>Gemini 2.0</strong> with a single OpenAI-compatible base URL. Powered by zero-knowledge SHA-256 key hashing, sub-millisecond atomic quotas, and real-time observability.
        </p>

        <div className="hero-cta-bar">
          <Link to="/register" className="btn-glow-primary">
            <Key size={18} />
            <span>Generate Free API Key</span>
          </Link>

          <Link to="/chat" className="btn-landing-secondary">
            <MessageSquare size={18} color="#38bdf8" />
            <span>Interactive Chat Playground</span>
          </Link>

          <a href="#models" className="btn-landing-secondary">
            <Cpu size={18} color="#a855f7" />
            <span>Explore 6+ Models</span>
          </a>
        </div>

        {/* Hero Trust / Metric Strip */}
        <div className="hero-metrics-strip">
          <div className="hero-metric-item">
            <div className="hero-metric-val">&lt; 12ms</div>
            <div className="hero-metric-desc">Gateway Routing Overhead</div>
          </div>
          <div className="hero-metric-item">
            <div className="hero-metric-val">SHA-256</div>
            <div className="hero-metric-desc">Zero-Knowledge Key Storage</div>
          </div>
          <div className="hero-metric-item">
            <div className="hero-metric-val">100%</div>
            <div className="hero-metric-desc">OpenAI SDK Drop-in Compatible</div>
          </div>
          <div className="hero-metric-item">
            <div className="hero-metric-val">Atomic</div>
            <div className="hero-metric-desc">MySQL Concurrency-Safe Quotas</div>
          </div>
        </div>
      </section>

      {/* Interactive Code Integration Showcase */}
      <section id="code" className="landing-section">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="section-tagline">Drop-in Integration</div>
          <h2 className="section-heading">Change One Line of Code. Unlock Every LLM.</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Fully compatible with the standard OpenAI SDK and REST clients. Simply swap the base URL to KeyShield and pass your zero-knowledge hashed token.
          </p>
        </div>

        <div className="code-showcase-box">
          <div className="code-showcase-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div className="code-window-dots">
                <span className="code-dot" style={{ background: '#ef4444' }} />
                <span className="code-dot" style={{ background: '#f59e0b' }} />
                <span className="code-dot" style={{ background: '#10b981' }} />
              </div>
              <div className="code-tab-list">
                <button
                  onClick={() => setActiveCodeTab('curl')}
                  className={`code-tab-button ${activeCodeTab === 'curl' ? 'active' : ''}`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setActiveCodeTab('python')}
                  className={`code-tab-button ${activeCodeTab === 'python' ? 'active' : ''}`}
                >
                  Python (OpenAI)
                </button>
                <button
                  onClick={() => setActiveCodeTab('javascript')}
                  className={`code-tab-button ${activeCodeTab === 'javascript' ? 'active' : ''}`}
                >
                  Node.js / TypeScript
                </button>
                <button
                  onClick={() => setActiveCodeTab('java')}
                  className={`code-tab-button ${activeCodeTab === 'java' ? 'active' : ''}`}
                >
                  Java 21 HttpClient
                </button>
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}
            >
              {copied ? (
                <>
                  <Check size={14} color="#34d399" />
                  <span style={{ color: '#34d399' }}>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="code-showcase-grid">
            {/* Request Pane */}
            <div className="code-request-pane">
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                // Client Request
              </div>
              <pre style={{ margin: 0, fontFamily: 'inherit' }}>
                <code>{codeSnippets[activeCodeTab]}</code>
              </pre>
            </div>

            {/* Simulated Live Response Pane */}
            <div className="code-response-pane">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  // 200 OK • KeyShield Gateway Telemetry
                </span>
                <span style={{ fontSize: '0.7rem', color: '#34d399', background: 'rgba(52, 211, 153, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                  Latency: 18ms
                </span>
              </div>
              <pre style={{ margin: 0, fontFamily: 'inherit', color: '#a5f3fc' }}>
                <code>{`{
  "id": "chatcmpl-ksh-8f92a10c",
  "object": "chat.completion",
  "created": 1729002480,
  "model": "anthropic/claude-3.5-sonnet",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Zero-knowledge key hashing generates keys on the client or gateway, stores only a one-way cryptographic SHA-256 digest in the database, and verifies tokens in constant time without ever storing the plaintext secret."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 42,
    "completion_tokens": 58,
    "total_tokens": 100,
    "cost_usd": 0.000996
  },
  "gateway_meta": {
    "key_prefix": "ksh_live_9b2d",
    "rate_limit_remaining": 59,
    "quota_status": "ATOMIC_DEDUCTED_OK"
  }
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Frontier Models Catalog Section */}
      <section id="models" className="landing-section">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div className="section-tagline">Frontier AI Catalog</div>
            <h2 className="section-heading">Multi-Provider Model Ecosystem</h2>
            <p className="section-desc">
              Select any frontier model by changing the <code style={{ color: '#38bdf8' }}>model</code> parameter. No provider-specific SDK installations needed.
            </p>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface)', padding: '0.3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setActiveModelFilter('all')}
              className={`btn btn-sm ${activeModelFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              All Models
            </button>
            <button
              onClick={() => setActiveModelFilter('reasoning')}
              className={`btn btn-sm ${activeModelFilter === 'reasoning' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              Reasoning & Code
            </button>
            <button
              onClick={() => setActiveModelFilter('multimodal')}
              className={`btn btn-sm ${activeModelFilter === 'multimodal' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              Multimodal
            </button>
            <button
              onClick={() => setActiveModelFilter('budget')}
              className={`btn btn-sm ${activeModelFilter === 'budget' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              Budget Frontier
            </button>
          </div>
        </div>

        <div className="landing-models-grid">
          {filteredModels.map((model) => (
            <div key={model.id} className="landing-model-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-full)',
                      background: `${model.badgeColor}22`,
                      color: model.badgeColor,
                      border: `1px solid ${model.badgeColor}44`,
                      display: 'inline-block',
                      marginBottom: '0.4rem'
                    }}
                  >
                    {model.provider}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{model.name}</h3>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#a5b4fc',
                    background: 'rgba(99, 102, 241, 0.12)',
                    padding: '0.25rem 0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                  }}
                >
                  {model.tag}
                </span>
              </div>

              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5, flex: 1 }}>
                {model.description}
              </p>

              <div style={{ background: 'rgba(10, 13, 20, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Context Window:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{model.contextWindow}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Input / Output:</span>
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>{model.inputCost} • {model.outputCost}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Gateway Latency:</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>{model.latency}</span>
                </div>
              </div>

              <Link
                to="/chat"
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'center', gap: '0.4rem', fontSize: '0.825rem' }}
              >
                <span>Launch in Playground</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture & Security Pillars */}
      <section id="architecture" className="landing-section">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="section-tagline">Enterprise Engineering</div>
          <h2 className="section-heading">Architectural Pillars of KeyShield</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Engineered with Java 21, Spring Boot 3, and MySQL 8 for uncompromising cryptographic security and high-concurrency token metering.
          </p>
        </div>

        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <Lock size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700 }}>Zero-Knowledge SHA-256 Storage</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              API keys are generated with 256-bit cryptographically secure entropy (<code style={{ color: '#38bdf8' }}>ksh_live_...</code>). The plaintext is shown once to the developer, while only the salted SHA-256 hash is persisted in MySQL. Plaintext keys can never be leaked from the database.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700 }}>Atomic Quota Enforcement</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Usage counters and credit limits are enforced atomically via MySQL transaction locks. Under concurrent microservice spikes, requests are rejected immediately when limits are exhausted, guaranteeing zero race-condition overages.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <Code2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700 }}>OpenAI SDK Drop-in Standard</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Our chat completions controller perfectly conforms to the OpenAI specification. Drop KeyShield into existing LangChain, LlamaIndex, or autonomous agent workflows without changing a single line of application logic.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <BarChart3 size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700 }}>Real-Time Audit Telemetry</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Every transaction logs HTTP status code, prompt tokens, completion tokens, client IP, user agent, and execution latency in milliseconds. Complete audit trail compliance for engineering teams.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section id="comparison" className="landing-section">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="section-tagline">Why KeyShield?</div>
          <h2 className="section-heading">Direct Provider APIs vs. KeyShield Gateway</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            See why centralized AI governance and zero-knowledge key hashing outperforms scattered API management.
          </p>
        </div>

        <div className="comparison-container">
          <table className="comparison-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Capability</th>
                <th style={{ width: '35%' }}>Direct Provider API Keys (OpenAI, Anthropic)</th>
                <th style={{ width: '35%', color: '#38bdf8' }}>KeyShield OpenRouter Platform</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>API Key Storage</strong></td>
                <td style={{ color: 'var(--text-muted)' }}>Raw plaintext keys exposed across developer .env files</td>
                <td style={{ color: '#34d399', fontWeight: 600 }}>Zero-knowledge salted SHA-256 hash in MySQL</td>
              </tr>
              <tr>
                <td><strong>Multi-Model Routing</strong></td>
                <td style={{ color: 'var(--text-muted)' }}>Requires separate SDKs, separate accounts & billing for each</td>
                <td style={{ color: '#34d399', fontWeight: 600 }}>Single OpenAI-compatible endpoint for Claude, GPT, DeepSeek</td>
              </tr>
              <tr>
                <td><strong>Quota Protection</strong></td>
                <td style={{ color: 'var(--text-muted)' }}>Delayed billing alerts, credit card shock at month-end</td>
                <td style={{ color: '#34d399', fontWeight: 600 }}>Strict atomic rate limits & monthly credit ceilings</td>
              </tr>
              <tr>
                <td><strong>Developer Key Revocation</strong></td>
                <td style={{ color: 'var(--text-muted)' }}>Manual login to multiple provider consoles</td>
                <td style={{ color: '#34d399', fontWeight: 600 }}>1-Click instant revocation across all models</td>
              </tr>
              <tr>
                <td><strong>Audit & Telemetry Logs</strong></td>
                <td style={{ color: 'var(--text-muted)' }}>Fragmented dashboards across vendors</td>
                <td style={{ color: '#34d399', fontWeight: 600 }}>Unified real-time telemetry, token counts & millisecond latency</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="landing-section" style={{ paddingTop: '1rem', paddingBottom: '5rem' }}>
        <div className="landing-cta-banner">
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1.25rem', boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)' }}>
            <Sparkles size={30} />
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '1rem' }}>
            Ready to route frontier AI models securely?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Create your developer account in under 60 seconds. Generate your first API key, explore top LLMs in the playground, and integrate with standard OpenAI SDKs.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-glow-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              <span>Create Free Account</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-landing-secondary" style={{ padding: '0.9rem 1.75rem', fontSize: '1rem' }}>
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div className="landing-brand-logo" style={{ width: '30px', height: '30px' }}>
                <Sparkles size={16} />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>KeyShield AI Gateway</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '320px', marginBottom: '1.25rem' }}>
              OpenRouter-inspired unified AI Gateway & Enterprise API Key Governance Platform built with Java 21, Spring Boot 3, MySQL 8, and React 18.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Java 21</span>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Spring Boot 3</span>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>MySQL 8</span>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>React 18</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <div className="footer-col-title">Platform</div>
            <ul className="footer-links-list">
              <li className="footer-link-item"><Link to="/models">Models Directory</Link></li>
              <li className="footer-link-item"><Link to="/chat">Chat Playground</Link></li>
              <li className="footer-link-item"><Link to="/keys">API Key Governance</Link></li>
              <li className="footer-link-item"><Link to="/tester">Interactive API Tester</Link></li>
              <li className="footer-link-item"><Link to="/usage">Telemetry & Usage</Link></li>
            </ul>
          </div>

          {/* Developer Resources */}
          <div>
            <div className="footer-col-title">Developers</div>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <a href="http://localhost:8080/swagger-ui/index.html" target="_blank" rel="noreferrer">
                  OpenAPI / Swagger UI
                </a>
              </li>
              <li className="footer-link-item">
                <a href="http://localhost:8080/actuator/health" target="_blank" rel="noreferrer">
                  Actuator Health API
                </a>
              </li>
              <li className="footer-link-item">
                <a href="#code">cURL / Python Integration</a>
              </li>
              <li className="footer-link-item">
                <a href="#architecture">Architecture Specs</a>
              </li>
            </ul>
          </div>

          {/* Author / Engineering */}
          <div>
            <div className="footer-col-title">Engineering</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Designed and implemented as a production-grade portfolio project by:
            </p>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.35rem' }}>
              Aditya Asthana
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              B.Tech CSE • Backend / Java / Full-Stack Engineer
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div>
            © {new Date().getFullYear()} KeyShield Platform. All rights reserved.
          </div>
          <div>
            Zero-Knowledge Hashed • Concurrency Safe • OpenAI Protocol Compatible
          </div>
        </div>
      </footer>
    </div>
  );
}
