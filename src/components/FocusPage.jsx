import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Target, 
  Flame, 
  ShieldAlert, 
  Laptop, 
  Globe, 
  CheckCircle2, 
  Sparkles,
  Plus,
  Minus
} from 'lucide-react';

export default function FocusPage({ onToast }) {
  // Session Goal State
  const [goal, setGoal] = useState(() => {
    return localStorage.getItem('timetrack_focus_goal') || 'Building React Components & Refactoring UI Architecture';
  });

  // Pomodoro Timer State
  const [mode, setMode] = useState('focus'); // 'focus' (25m) or 'break' (5m)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Distraction Counter State
  const [distractionCount, setDistractionCount] = useState(() => {
    const saved = localStorage.getItem('timetrack_distraction_count');
    return saved ? parseInt(saved, 10) : 1;
  });

  // Streak State
  const [streakDays] = useState(5);

  // Sync Goal to localStorage
  useEffect(() => {
    localStorage.setItem('timetrack_focus_goal', goal);
  }, [goal]);

  useEffect(() => {
    localStorage.setItem('timetrack_distraction_count', distractionCount.toString());
  }, [distractionCount]);

  // Timer Ticker Loop
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'focus') {
        if (onToast) onToast('Focus Session complete! Time for a 5-minute break.', 'success');
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        if (onToast) onToast('Break finished! Ready to lock back in?', 'info');
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, onToast]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchTimerMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progressPercent = Math.round(((totalTime - timeLeft) / totalTime) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Focus Mode
            </span>
            <span className="text-xs font-semibold text-slate-400">Deep Work Chamber</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Current Focus Session
          </h1>
        </div>

        {/* Deep Work Streak Counter Badge */}
        <div className="flex items-center space-x-3 bg-white border border-slate-200/80 px-4 py-2 rounded-2xl shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-600 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Streak</div>
            <div className="text-sm font-extrabold text-slate-900">{streakDays} Days Active</div>
          </div>
        </div>
      </div>

      {/* Main Focus Grid (12 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Pomodoro Clock (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs flex flex-col items-center justify-between text-center space-y-8 relative overflow-hidden">
          {/* Mode Tabs */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => switchTimerMode('focus')}
              className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'focus'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Focus (25m)
            </button>
            <button
              onClick={() => switchTimerMode('break')}
              className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'break'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rest (5m)
            </button>
          </div>

          {/* Large Minimalist Timer Ring Display */}
          <div className="relative flex items-center justify-center my-4">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="#f1f5f9"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke={mode === 'focus' ? '#4f46e5' : '#10b981'}
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 110}
                strokeDashoffset={2 * Math.PI * 110 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className={`font-mono text-5xl font-extrabold tracking-tighter ${isRunning ? 'text-slate-900' : 'text-slate-700'}`}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                {isRunning ? (mode === 'focus' ? 'Deep Work In Progress' : 'Short Rest') : 'Paused'}
              </span>
            </div>
          </div>

          {/* Timer Control Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTimer}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
                isRunning 
                  ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Session</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Focus</span>
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Goal, Live Apps, & Distraction Counter (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Today's Goal Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Session Objective</span>
            </div>

            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all resize-none"
              rows={3}
              placeholder="What are you focusing on during this session?"
            />
          </div>

          {/* Live Tracked App & Website Badges */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Environment
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Laptop className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold text-slate-800">Visual Studio Code</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold text-slate-800">github.com / local-dev</span>
                </div>
                <span className="text-[10px] font-mono font-semibold text-slate-400">Active</span>
              </div>
            </div>
          </div>

          {/* Distraction Counter Widget */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/70 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Distractions</div>
                <div className="text-lg font-extrabold text-slate-900">{distractionCount} Interruptions</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setDistractionCount(Math.max(0, distractionCount - 1))}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setDistractionCount(distractionCount + 1)}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
