import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Database, Shield, LogOut, Coins, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      {/* Left: Active Badges & Credits */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginRight: 'auto' }}>
        {/* OpenRouter Credit Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
          <Coins size={14} />
          <span>$10.00 Credits</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <Database size={13} />
          <span>MySQL 8 Active</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
          <Shield size={13} />
          <span>JWT Secure</span>
        </div>
      </div>

      {/* Right: User Information */}
      <div className="user-badge">
        <div className="user-avatar">
          {user?.fullName?.charAt(0) || 'U'}
        </div>
        <div className="user-info">
          <span className="user-name">{user?.fullName}</span>
          <span className="user-role">{user?.email}</span>
        </div>
        <button 
          onClick={logout} 
          className="btn btn-secondary btn-sm"
          style={{ marginLeft: '0.5rem' }}
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
