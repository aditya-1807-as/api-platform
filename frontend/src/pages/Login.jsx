import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  AlertTriangle, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Zap,
  Check
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autofilled, setAutofilled] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const mockPersonas = [
    { email: 'admin@example.com', label: '👑 Admin (admin@example.com)', role: 'Admin' },
    { email: 'aditya.asthana@enterprise.ai', label: '🚀 Aditya (aditya.asthana@enterprise.ai)', role: 'Lead Architect' },
    { email: 'sarah.chen@anthropic-partner.io', label: '🤖 Sarah (sarah.chen@anthropic-partner.io)', role: 'MLOps' },
    { email: 'alex.kumar@fintechscale.com', label: '⚡ Alex (alex.kumar@fintechscale.com)', role: 'Fintech Lead' },
  ];

  const handleSelectPersona = (selectedEmail) => {
    setEmail(selectedEmail);
    setPassword('Password123!');
    setAutofilled(true);
    setError('');
    setTimeout(() => setAutofilled(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-auth-wrapper">
      <div className="auth-ambient-sphere-1" />
      <div className="auth-ambient-sphere-2" />
      <div className="auth-ambient-sphere-3" />

      <div className="modern-auth-card">
        {/* Top Navigation Back to Home */}
        <Link to="/" className="auth-back-link">
          <ArrowLeft size={16} />
          <span>Back to Landing Page</span>
        </Link>

        {/* Brand Icon & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="auth-brand-badge">
            <Sparkles size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
            Sign in to access your API keys, quotas & AI gateway
          </p>
        </div>

        {/* Mock Users Quick-Fill Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⚡ 1-Click Mock User Autofill
            </span>
            {autofilled && (
              <span style={{ fontSize: '0.725rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Check size={12} />
                <span>Credentials Loaded!</span>
              </span>
            )}
          </div>
          <div className="demo-user-chips-row">
            {mockPersonas.map((p) => (
              <button
                key={p.email}
                type="button"
                onClick={() => handleSelectPersona(p.email)}
                className={`demo-user-chip ${email === p.email ? 'selected' : ''}`}
              >
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div 
            className="warning-callout" 
            style={{ 
              borderColor: 'var(--danger-border)', 
              background: 'var(--danger-bg)', 
              color: '#f87171',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem' }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <Mail 
                size={16} 
                style={{ 
                  position: 'absolute', 
                  left: '0.85rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Password
              </label>
            </div>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock 
                size={16} 
                style={{ 
                  position: 'absolute', 
                  left: '0.85rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-btn"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-glow-primary" 
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              padding: '0.85rem', 
              marginTop: '0.25rem' 
            }} 
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Gateway'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
