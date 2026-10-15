import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Check,
  Shield
} from 'lucide-react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const isLengthValid = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLengthValid) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, fullName);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1600);
    } catch (err) {
      setError(err.message || 'Registration failed. A user with this email may already exist.');
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
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="auth-brand-badge">
            <Sparkles size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Create Account
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
            Get your zero-knowledge API key and route frontier LLMs
          </p>
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

        {/* Success Alert */}
        {success && (
          <div 
            className="warning-callout" 
            style={{ 
              borderColor: 'var(--success-border)', 
              background: 'var(--success-bg)', 
              color: '#34d399',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem' }}>Account created! Redirecting to sign in...</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Aditya Asthana"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoFocus
              />
              <User 
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

          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="developer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
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

            {/* Password Validation Hints */}
            <div className="password-hints-row">
              <span className={`password-hint ${isLengthValid ? 'valid' : ''}`}>
                <Check size={12} color={isLengthValid ? '#34d399' : '#64748b'} />
                <span>8+ Characters</span>
              </span>
              <span className={`password-hint ${hasLetter ? 'valid' : ''}`}>
                <Check size={12} color={hasLetter ? '#34d399' : '#64748b'} />
                <span>Letters</span>
              </span>
              <span className={`password-hint ${hasNumberOrSpecial ? 'valid' : ''}`}>
                <Check size={12} color={hasNumberOrSpecial ? '#34d399' : '#64748b'} />
                <span>Numbers / Symbols</span>
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-glow-primary" 
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              padding: '0.85rem', 
              marginTop: '0.5rem' 
            }} 
            disabled={loading || success}
          >
            <span>{loading ? 'Creating Developer Account...' : 'Create Developer Account'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
