import React, { useState } from 'react';
import { Tag, Plus, Trash2, Layers, CheckCircle2 } from 'lucide-react';

export default function RulesPage({ rules = [], categories = [], onAddRule, onDeleteRule, onAddCategory }) {
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');

  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('productive');
  const [newCatColor, setNewCatColor] = useState('#3b82f6');
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;

    onAddRule({
      id: `rule-${Date.now()}`,
      keyword: newKeyword.trim().toLowerCase(),
      categoryId: selectedCategory || categories[0]?.id
    });

    setNewKeyword('');
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const id = newCatName.trim().toLowerCase().replace(/\s+/g, '-');
    onAddCategory({
      id,
      name: newCatName.trim(),
      type: newCatType,
      color: newCatColor,
      bg: `${newCatColor}20`
    });

    setNewCatName('');
    setShowAddCategoryForm(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Keyword Categorization Rules
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Specify title keywords (e.g. "code", "gym", "meeting") to automatically categorize calendar events
          </p>
        </div>

        <button 
          onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}
          className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1.5"
        >
          <Layers className="w-4 h-4 text-slate-500" />
          <span>+ Create Custom Category</span>
        </button>
      </div>

      {/* Grid: Add Rule Form & New Category Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Create Rule & Rules Feed (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Add Rule Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Add New Keyword Rule
            </h2>

            <form onSubmit={handleCreateRule} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g. github, coding, gym, netflix, meeting"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium outline-none focus:bg-white focus:border-indigo-500 transition-all"
                required
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
              <button 
                type="submit" 
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Rule</span>
              </button>
            </form>
          </div>

          {/* New Category Form (Expandable) */}
          {showAddCategoryForm && (
            <form onSubmit={handleCreateCategory} className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Create Custom Category</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Category Name (e.g. Client Freelance)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 bg-white border border-indigo-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium outline-none focus:border-indigo-600"
                  required
                />
                <select
                  value={newCatType}
                  onChange={(e) => setNewCatType(e.target.value)}
                  className="bg-white border border-indigo-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
                >
                  <option value="productive">Productive (+1)</option>
                  <option value="neutral">Neutral (0)</option>
                  <option value="unproductive">Unproductive (-1)</option>
                </select>
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-12 h-10 rounded-xl border border-indigo-200 bg-white p-1 cursor-pointer"
                />
              </div>
              <button 
                type="submit" 
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Save Category
              </button>
            </form>
          )}

          {/* Rules Feed Grid */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Rules ({rules.length})
              </span>
              <span className="text-xs text-slate-400 font-medium">Auto-scanned on calendar fetch</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rules.map(rule => {
                const cat = categories.find(c => c.id === rule.categoryId) || categories[0];
                return (
                  <div 
                    key={rule.id}
                    className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl hover:bg-white hover:border-slate-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="font-mono text-xs font-bold text-slate-900 truncate">
                        "{rule.keyword}"
                      </span>
                      <span className="text-slate-300 text-xs">→</span>
                      <span 
                        className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider truncate"
                        style={{
                          backgroundColor: `${cat?.color || '#4f46e5'}15`,
                          color: cat?.color || '#4f46e5'
                        }}
                      >
                        {cat?.name || 'General'}
                      </span>
                    </div>

                    <button 
                      onClick={() => onDeleteRule(rule.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0"
                      title="Delete rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Category Legend (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
            Categories & Output Types
          </div>

          <div className="space-y-3">
            {categories.map(cat => (
              <div key={cat.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md ${
                  cat.type === 'productive' ? 'bg-emerald-50 text-emerald-700' : (cat.type === 'unproductive' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600')
                }`}>
                  {cat.type}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
