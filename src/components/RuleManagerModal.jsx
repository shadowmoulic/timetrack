import React, { useState } from 'react';
import { X, Plus, Trash2, Tag, Layers } from 'lucide-react';

export default function RuleManagerModal({
  isOpen,
  onClose,
  rules = [],
  categories = [],
  onAddRule,
  onDeleteRule,
  onAddCategory
}) {
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');

  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('productive');
  const [newCatColor, setNewCatColor] = useState('#3b82f6');
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Keyword Categorization Rules</h3>
              <p className="text-xs text-slate-400 font-medium">Auto-tag calendar events based on title keywords</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add Rule Form */}
          <form onSubmit={handleCreateRule} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Add New Keyword Rule
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="e.g. github, coding, gym, netflix"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium placeholder-slate-400 outline-none focus:border-indigo-500 transition-all"
                required
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition-all"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
              <button 
                type="submit" 
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </form>

          {/* Rules Header & New Category Toggle */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Active Rules ({rules.length})
            </span>
            <button 
              type="button"
              onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>+ New Category</span>
            </button>
          </div>

          {/* New Category Form */}
          {showAddCategoryForm && (
            <form onSubmit={handleCreateCategory} className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-3">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">Create Custom Category</span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Category Name (e.g. Side Hustle)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:border-indigo-600 transition-all"
                  required
                />
                <select
                  value={newCatType}
                  onChange={(e) => setNewCatType(e.target.value)}
                  className="bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600 transition-all"
                >
                  <option value="productive">Productive (+1)</option>
                  <option value="neutral">Neutral (0)</option>
                  <option value="unproductive">Unproductive (-1)</option>
                </select>
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-10 h-9 rounded-xl border border-indigo-200 bg-white p-1 cursor-pointer"
                />
              </div>
              <button 
                type="submit" 
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Save Category
              </button>
            </form>
          )}

          {/* Active Rules List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {rules.map(rule => {
              const cat = categories.find(c => c.id === rule.categoryId) || categories[0];
              return (
                <div 
                  key={rule.id}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-xl hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      "{rule.keyword}"
                    </span>
                    <span className="text-slate-300 text-xs">→</span>
                    <span 
                      className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider"
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
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
    </div>
  );
}
