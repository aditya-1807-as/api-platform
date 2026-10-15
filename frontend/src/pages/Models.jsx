import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { modelService } from '../services/modelService';
import { 
  Sparkles, 
  Search, 
  Cpu, 
  Zap, 
  MessageSquare, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Coins
} from 'lucide-react';

export default function Models() {
  const [models, setModels] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('All');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setLoading(true);
    try {
      const data = await modelService.getModels();
      setModels(data || []);
    } catch (err) {
      console.error('Failed to load models', err);
    } finally {
      setLoading(false);
    }
  };

  const providers = ['All', 'Anthropic', 'OpenAI', 'DeepSeek', 'Google', 'Meta', 'Mistral AI'];

  const filteredModels = models.filter((m) => {
    const matchesProvider = selectedProvider === 'All' || m.provider.toLowerCase() === selectedProvider.toLowerCase();
    const matchesSearch = 
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()) ||
      m.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesProvider && matchesSearch;
  });

  const handleStartChat = (modelId) => {
    navigate(`/chat?model=${encodeURIComponent(modelId)}`);
  };

  return (
    <div className="page-container">
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(99, 102, 241, 0.25)', color: '#818cf8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <Sparkles size={15} />
          <span>OpenRouter Model Router & Gateway</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '0.75rem' }}>
          Explore Top Frontier AI Models
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Access Claude 3.5, GPT-4o, DeepSeek, Gemini, and Llama through a unified, concurrency-safe API key with zero-knowledge encryption.
        </p>
      </div>

      {/* Search and Provider Filters */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ position: 'relative', maxWidth: '640px', margin: '0 auto 1.5rem' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.75rem', height: '48px', fontSize: '0.95rem', borderRadius: 'var(--radius-full)' }}
            placeholder="Search by model name, provider, or tags (e.g. Claude, Coding, 1M)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          {providers.map((p) => (
            <button
              key={p}
              className={`btn btn-sm ${selectedProvider === p ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem' }}
              onClick={() => setSelectedProvider(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Model Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          Loading models catalog...
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="empty-state">
          <Cpu className="empty-state-icon" />
          <h4>No matching models found</h4>
          <p>Try searching for a different keyword or provider filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredModels.map((m) => (
            <div 
              key={m.id} 
              className="card"
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div>
                {/* Top Row: Provider & Context Length */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.badgeColor || '#6366f1' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {m.provider}
                    </span>
                  </div>

                  <span className="badge" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                    {(m.contextLength / 1000).toLocaleString()}k context
                  </span>
                </div>

                {/* Model Title & ID */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                  {m.name}
                </h3>
                <div className="code-font" style={{ fontSize: '0.75rem', color: '#38bdf8', marginBottom: '0.85rem', display: 'inline-block' }}>
                  {m.id}
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem', minHeight: '42px' }}>
                  {m.description}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  {m.tags?.map((t) => (
                    <span 
                      key={t}
                      style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 600, 
                        background: 'rgba(255, 255, 255, 0.04)', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Footer: Pricing & Chat Button */}
              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Pricing / 1M Tokens
                  </div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                    {m.pricingPrompt} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>prompt</span>
                  </div>
                </div>

                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => handleStartChat(m.id)}
                  style={{ gap: '0.4rem' }}
                >
                  <MessageSquare size={14} />
                  <span>Open Chat</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
