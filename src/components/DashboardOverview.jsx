import React from 'react';
import { Award, Zap, AlertCircle, Clock, PieChart, TrendingUp } from 'lucide-react';

export default function DashboardOverview({ analytics }) {
  const {
    totalHours = 0,
    productiveHours = 0,
    unproductiveHours = 0,
    neutralHours = 0,
    productivityScore = 0,
    categoryBreakdown = []
  } = analytics || {};

  const topCategory = categoryBreakdown.length > 0 
    ? [...categoryBreakdown].sort((a, b) => b.hours - a.hours)[0] 
    : null;

  // Score color gradient
  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="overview-grid">
      {/* Productivity Score */}
      <div className="metric-card score-card">
        <div className="metric-header">
          <span className="metric-title">Productivity Score</span>
          <div className="metric-icon-wrap" style={{ color: getScoreColor(productivityScore) }}>
            <Award size={20} />
          </div>
        </div>
        <div className="metric-body">
          <span className="metric-value" style={{ color: getScoreColor(productivityScore) }}>
            {productivityScore}%
          </span>
          <span className="metric-unit">Score</span>
        </div>
        <div className="metric-footer">
          <TrendingUp size={14} color={getScoreColor(productivityScore)} />
          <span>
            {productivityScore >= 70 
              ? 'High focus efficiency' 
              : (productivityScore >= 50 ? 'Moderate output balance' : 'Needs focus optimization')}
          </span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${productivityScore}%`, 
              backgroundColor: getScoreColor(productivityScore) 
            }} 
          />
        </div>
      </div>

      {/* Productive Time */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-title">Productive Hours</span>
          <div className="metric-icon-wrap" style={{ color: '#10b981' }}>
            <Zap size={20} />
          </div>
        </div>
        <div className="metric-body">
          <span className="metric-value" style={{ color: '#10b981' }}>
            {productiveHours}
          </span>
          <span className="metric-unit">hrs</span>
        </div>
        <div className="metric-footer">
          <span>Deep Work, Coding, Meetings & Learning</span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${totalHours > 0 ? (productiveHours / totalHours) * 100 : 0}%`, 
              backgroundColor: '#10b981' 
            }} 
          />
        </div>
      </div>

      {/* Unproductive Time */}
      <div className="metric-card unproductive-card">
        <div className="metric-header">
          <span className="metric-title">Unproductive / Distraction</span>
          <div className="metric-icon-wrap" style={{ color: '#ef4444' }}>
            <AlertCircle size={20} />
          </div>
        </div>
        <div className="metric-body">
          <span className="metric-value" style={{ color: '#ef4444' }}>
            {unproductiveHours}
          </span>
          <span className="metric-unit">hrs</span>
        </div>
        <div className="metric-footer">
          <span>Social Media, Gaming, Streaming</span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${totalHours > 0 ? (unproductiveHours / totalHours) * 100 : 0}%`, 
              backgroundColor: '#ef4444' 
            }} 
          />
        </div>
      </div>

      {/* Total Tracked & Top Category */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-title">Total Tracked</span>
          <div className="metric-icon-wrap" style={{ color: '#6366f1' }}>
            <Clock size={20} />
          </div>
        </div>
        <div className="metric-body">
          <span className="metric-value">{totalHours}</span>
          <span className="metric-unit">hrs</span>
        </div>
        <div className="metric-footer" style={{ justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PieChart size={14} /> Top: {topCategory ? topCategory.name : 'N/A'}
          </span>
          {topCategory && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: topCategory.color }}>
              {Math.round(topCategory.hours)} hrs
            </span>
          )}
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: '100%', backgroundColor: '#6366f1' }} 
          />
        </div>
      </div>
    </div>
  );
}
