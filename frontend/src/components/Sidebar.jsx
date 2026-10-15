import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles,
  MessageSquare,
  LayoutDashboard, 
  Key, 
  BarChart3, 
  History, 
  Terminal, 
  ShieldAlert, 
  LogOut,
  Cpu,
  Globe,
  Zap,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <Link to="/dashboard" className="brand-header-link" title="Go to Dashboard">
        <div className="brand-icon-modern">
          <Sparkles size={20} />
        </div>
        <div style={{ overflow: 'hidden' }}>
          <span className="brand-title-modern">KeyShield</span>
          <div className="brand-subtitle-modern">
            <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
            <span>AI Gateway Active</span>
          </div>
        </div>
      </Link>

      <div className="nav-links">
        {/* AI Gateway Section */}
        <div className="nav-section-label">
          <span>AI Gateway</span>
          <span style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 700 }}>LLM ROUTER</span>
        </div>

        <NavLink to="/models" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-item-content">
            <Cpu size={18} />
            <span>Models Catalog</span>
          </div>
          <span className="nav-item-badge">6</span>
        </NavLink>

        <NavLink to="/chat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-item-content">
            <MessageSquare size={18} />
            <span>Chat Playground</span>
          </div>
          <span className="nav-item-badge" style={{ color: '#38bdf8' }}>AI</span>
        </NavLink>

        {/* Platform Section */}
        <div className="nav-section-label">
          <span>API Management</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>CORE</span>
        </div>

        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-item-content">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
        </NavLink>

        <NavLink to="/keys" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-item-content">
            <Key size={18} />
            <span>API Keys</span>
          </div>
        </NavLink>

        <NavLink to="/usage" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-item-content">
            <BarChart3 size={18} />
            <span>Usage & Activity</span>
          </div>
        </NavLink>

        <NavLink to="/logs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-item-content">
            <History size={18} />
            <span>Request Logs</span>
          </div>
        </NavLink>

        <NavLink to="/tester" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-item-content">
            <Terminal size={18} />
            <span>Demo APIs</span>
          </div>
        </NavLink>

        <NavLink to="/" className="nav-item">
          <div className="nav-item-content">
            <Globe size={18} />
            <span>Public Landing</span>
          </div>
          <span className="nav-item-badge">Web</span>
        </NavLink>

        {/* Administration Section */}
        {isAdmin && (
          <>
            <div className="nav-section-label">
              <span>Administration</span>
              <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 700 }}>SECURE</span>
            </div>
            <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <div className="nav-item-content">
                <ShieldAlert size={18} color="#f59e0b" />
                <span>Admin Center</span>
              </div>
              <span className="nav-item-badge" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)' }}>
                Admin
              </span>
            </NavLink>
          </>
        )}
      </div>

      {/* Mini Gateway Quota Status Widget */}
      <div className="sidebar-quota-widget">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Zap size={13} color="#f59e0b" />
            <span>SHA-256 Gateway</span>
          </span>
          <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 600 }}>Active</span>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Atomic MySQL quota locks & OpenAI SDK base URL routing.
        </div>
      </div>

      {/* User Profile Card */}
      <div className="sidebar-user-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
          <div className="user-avatar" style={{ width: '34px', height: '34px', fontSize: '0.825rem', flexShrink: 0, position: 'relative' }}>
            {user?.fullName?.charAt(0) || 'U'}
            <span style={{ position: 'absolute', bottom: '1px', right: '1px', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', border: '1.5px solid #0b0f19' }} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.825rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>
              {user?.fullName}
            </div>
            <div style={{ fontSize: '0.68rem', color: user?.role === 'ROLE_ADMIN' ? '#fbbf24' : '#38bdf8', fontWeight: 600 }}>
              {user?.role === 'ROLE_ADMIN' ? 'Platform Admin' : 'Developer'}
            </div>
          </div>
        </div>
        <button 
          onClick={logout}
          className="btn btn-secondary btn-icon btn-sm"
          title="Sign Out"
          style={{ width: '30px', height: '30px', padding: 0 }}
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
}
