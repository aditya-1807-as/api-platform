import React from 'react';

export default function StatCard({ label, value, subtext, icon: Icon, color = '#6366f1', progress = null }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        {Icon && (
          <div className="stat-icon" style={{ color: color }}>
            <Icon size={19} />
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      {subtext && <div className="stat-subtext">{subtext}</div>}

      {progress !== null && (
        <div className="progress-container">
          <div 
            className={`progress-bar ${progress > 90 ? 'danger' : progress > 70 ? 'warning' : ''}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
