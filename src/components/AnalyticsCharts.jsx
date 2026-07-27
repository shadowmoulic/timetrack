import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

export default function AnalyticsCharts({ analytics }) {
  const { categoryBreakdown = [], dailyTrends = [] } = analytics || {};

  const formattedCategoryData = categoryBreakdown.map(cat => ({
    name: cat.name,
    value: Math.round(cat.hours * 10) / 10,
    color: cat.color,
    type: cat.type
  }));

  const formattedTrends = dailyTrends.map(day => ({
    date: day.date.slice(5), // MM-DD format
    Productive: Math.round(day.productive * 10) / 10,
    Neutral: Math.round(day.neutral * 10) / 10,
    Unproductive: Math.round(day.unproductive * 10) / 10
  }));

  return (
    <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '24px' }}>
      {/* Category Breakdown Donut */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">
            <PieChartIcon size={20} className="text-secondary" />
            Time by Category
          </h2>
        </div>

        {formattedCategoryData.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No category data available for this range.
          </div>
        ) : (
          <div>
            <div className="chart-container" style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formattedCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {formattedCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '0.85rem' }}
                    itemStyle={{ color: '#0f172a' }}
                    formatter={(val) => [`${val} hours`, 'Duration']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
              {formattedCategoryData.map(cat => (
                <div 
                  key={cat.name} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    background: 'rgba(255,255,255,0.04)', 
                    border: '1px solid var(--border-color)', 
                    padding: '6px 12px', 
                    borderRadius: '8px', 
                    fontSize: '0.8rem' 
                  }}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: cat.color }} />
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{cat.name}:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{cat.value}h</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Daily Productivity Bar Chart */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">
            <BarChart3 size={20} className="text-secondary" />
            Daily Output Trends
          </h2>
        </div>

        {formattedTrends.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No daily trend data available for this range.
          </div>
        ) : (
          <div className="chart-container" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '0.85rem' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '0.8rem' }} />
                <Bar dataKey="Productive" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Neutral" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="Unproductive" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
