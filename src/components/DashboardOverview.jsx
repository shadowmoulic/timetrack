import React from 'react';
import { Award, Zap, AlertCircle, Clock, PieChart, TrendingUp, Sparkles } from 'lucide-react';

export default function DashboardOverview({ analytics }) {
  const {
    totalHours = 0,
    productiveHours = 0,
    unproductiveHours = 0,
    productivityScore = 0,
    categoryBreakdown = []
  } = analytics || {};

  const topCategory = categoryBreakdown.length > 0 
    ? [...categoryBreakdown].sort((a, b) => b.hours - a.hours)[0] 
    : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Row 1: Hero Banner & High Impact Productivity Gauge (12 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Left Hero Score Card (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Productivity Score</span>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Output Efficiency
            </span>
          </div>

          <div className="flex items-baseline space-x-3 sm:space-x-4">
            <span className="font-mono text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
              {productivityScore}%
            </span>
            <div className="text-xs sm:text-sm font-semibold text-slate-500">
              {productivityScore >= 70 
                ? 'High focus efficiency maintained' 
                : 'Balanced work & break distribution'}
            </div>
          </div>

          {/* Minimalist Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] sm:text-xs font-semibold text-slate-400">
              <span>0% Low</span>
              <span>Target: 75%+</span>
              <span>100% Peak</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${productivityScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Focus Ratio Card (5 Columns) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Focus vs Distraction Ratio</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1">
              <div className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Deep Work</span>
              </div>
              <div className="font-mono text-xl sm:text-2xl font-extrabold text-slate-900">{productiveHours}h</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1">
              <div className="text-xs font-bold text-rose-600 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Distractions</span>
              </div>
              <div className="font-mono text-xl sm:text-2xl font-extrabold text-slate-900">{unproductiveHours}h</div>
            </div>
          </div>

          <div className="text-[11px] sm:text-xs font-medium text-slate-400">
            {totalHours} total hours tracked across current active filter range.
          </div>
        </div>

      </div>

      {/* Row 2: 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Total Tracked</span>
            <Clock className="w-4 h-4 text-slate-600" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900">{totalHours}h</div>
          <div className="text-[11px] text-slate-400 font-medium">Logged time duration</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Productive</span>
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-indigo-600">{productiveHours}h</div>
          <div className="text-[11px] text-slate-400 font-medium">Coding, Dev & Learning</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Unproductive</span>
            <AlertCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900">{unproductiveHours}h</div>
          <div className="text-[11px] text-slate-400 font-medium">Social media & streaming</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Top Category</span>
            <PieChart className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
            {topCategory ? topCategory.name : 'N/A'}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {topCategory ? `${Math.round(topCategory.hours)} hrs total` : 'No events'}
          </div>
        </div>
      </div>
    </div>
  );
}
