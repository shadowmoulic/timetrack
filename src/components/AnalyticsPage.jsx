import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Activity, 
  BarChart3, 
  Clock, 
  ShieldAlert, 
  PieChart as PieChartIcon, 
  Zap, 
  Laptop, 
  Globe 
} from 'lucide-react';

export default function AnalyticsPage({ analytics }) {
  const {
    totalHours = 0,
    productiveHours = 0,
    unproductiveHours = 0,
    productivityScore = 0,
    categoryBreakdown = [],
    dailyTrends = []
  } = analytics || {};

  // Mock 24-Hour Intensity Heatmap Data
  const hourlyHeatmapData = [
    { hour: '6am', hours: 0.5 }, { hour: '7am', hours: 1.2 }, { hour: '8am', hours: 1.5 },
    { hour: '9am', hours: 2.5 }, { hour: '10am', hours: 3.0 }, { hour: '11am', hours: 2.8 },
    { hour: '12pm', hours: 1.0 }, { hour: '1pm', hours: 1.8 }, { hour: '2pm', hours: 2.6 },
    { hour: '3pm', hours: 3.2 }, { hour: '4pm', hours: 2.4 }, { hour: '5pm', hours: 1.5 },
    { hour: '6pm', hours: 1.0 }, { hour: '7pm', hours: 0.8 }, { hour: '8pm', hours: 1.4 },
    { hour: '9pm', hours: 2.0 }, { hour: '10pm', hours: 1.1 }
  ];

  // Top Distractions & App Usage Data
  const appUsage = [
    { name: 'VS Code', category: 'Dev / Productive', hours: 18.5, icon: Laptop, color: '#4f46e5' },
    { name: 'GitHub & Vercel', category: 'Dev / Productive', hours: 8.2, icon: Globe, color: '#059669' },
    { name: 'YouTube / Streaming', category: 'Distraction', hours: 5.4, icon: ShieldAlert, color: '#dc2626' },
    { name: 'Slack & Client Calls', category: 'Work', hours: 6.0, icon: Clock, color: '#2563eb' },
    { name: 'Social Media / X', category: 'Distraction', hours: 3.2, icon: ShieldAlert, color: '#dc2626' }
  ];

  const formattedCategories = categoryBreakdown.map(c => ({
    name: c.name,
    value: Math.round(c.hours * 10) / 10,
    color: c.color
  }));

  const formattedDaily = dailyTrends.map(d => ({
    date: d.date.slice(5),
    Productive: Math.round(d.productive * 10) / 10,
    Unproductive: Math.round(d.unproductive * 10) / 10
  }));

  // Calendar Utilization Calculation (Tracked Hours vs 8h/day capacity)
  const utilizationPercent = Math.min(100, Math.round((totalHours / (14 * 8)) * 100));

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Page Title Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Analytics & Output Intelligence
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Deep dive metrics, hourly heatmaps, and category focus distribution
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-white border border-slate-200/80 px-4 py-2 rounded-2xl text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Calendar Utilization</div>
            <div className="text-sm font-extrabold text-slate-900">{utilizationPercent}% Capacity</div>
          </div>
        </div>
      </div>

      {/* Top 3 High Level KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Productivity Score</span>
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {productivityScore}%
          </div>
          <div className="text-xs font-medium text-slate-500 mt-2">
            {productiveHours} hrs productive vs {unproductiveHours} hrs distraction
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Output</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {totalHours} <span className="text-base font-normal text-slate-400">hrs</span>
          </div>
          <div className="text-xs font-medium text-slate-500 mt-2">
            Tracked across current selected date window
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Top Distraction Rate</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 font-mono tracking-tight">
            {unproductiveHours} <span className="text-base font-normal text-slate-400">hrs</span>
          </div>
          <div className="text-xs font-medium text-slate-500 mt-2">
            Social media, gaming & streaming logs
          </div>
        </div>
      </div>

      {/* Hourly Intensity Heatmap Chart */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Peak Focus Intensity Heatmap (By Hour)
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">Peak hours: 10am & 3pm</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyHeatmapData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '0.85rem' }}
                itemStyle={{ color: '#0f172a' }}
              />
              <Bar dataKey="hours" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Category Breakdown Donut & App / Website Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category Breakdown Donut (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <PieChartIcon className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Deep Work Distribution
            </h2>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {formattedCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '0.85rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {formattedCategories.map(cat => (
              <div key={cat.name} className="flex items-center space-x-2 text-xs font-semibold p-2 bg-slate-50 rounded-lg">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-700 truncate">{cat.name}:</span>
                <span className="font-mono text-slate-900">{cat.value}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Application & Website Usage Breakdown (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Laptop className="w-4 h-4 text-slate-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                App & Distraction Breakdown
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">Tracked Usage</span>
          </div>

          <div className="space-y-3">
            {appUsage.map(app => {
              const IconComponent = app.icon;
              return (
                <div key={app.name} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{app.name}</div>
                      <div className="text-[10px] font-medium text-slate-400">{app.category}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-slate-900">{app.hours} hrs</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
