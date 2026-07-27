import React, { useState } from 'react';
import { X, Plus, Trash2, Tag, Layers } from 'lucide-react';

export default function RuleManagerModal({
  isOpen,
  onClose,
  rules,
  categories,
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag size={20} className="text-secondary" />
            Keyword Categorization Rules
          </h3>
          <button className="btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Add Rule Form */}
          <form onSubmit={handleCreateRule} className="form-group" style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span className="form-label">Add New Keyword Rule</span>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="e.g. github, coding, gym, netflix"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="form-input"
                style={{ flex: 1, minWidth: '160px' }}
                required
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select"
                style={{ width: '180px' }}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary">
                <Plus size={16} /> Add
              </button>
            </div>
          </form>

          {/* Categories Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 10px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
              Active Rules ({rules.length})
            </span>
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              <Layers size={14} /> + New Category
            </button>
          </div>

          {/* New Category Form */}
          {showAddCategoryForm && (
            <form onSubmit={handleCreateCategory} className="form-group" style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: '16px' }}>
              <span className="form-label">Create Custom Category</span>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Category Name (e.g. Side Hustle)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                  required
                />
                <select
                  value={newCatType}
                  onChange={(e) => setNewCatType(e.target.value)}
                  className="form-select"
                  style={{ width: '140px' }}
                >
                  <option value="productive">Productive (+1)</option>
                  <option value="neutral">Neutral (0)</option>
                  <option value="unproductive">Unproductive (-1)</option>
                </select>
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  style={{ width: '44px', height: '38px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'transparent' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                Save Category
              </button>
            </form>
          )}

          {/* Rules List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
            {rules.map(rule => {
              const cat = categories.find(c => c.id === rule.categoryId) || categories[0];
              return (
                <div 
                  key={rule.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(13, 18, 30, 0.7)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '8px 14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                      "{rule.keyword}"
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>→</span>
                    <span 
                      style={{
                        background: cat?.bg || 'rgba(255,255,255,0.1)',
                        color: cat?.color || '#fff',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: '700'
                      }}
                    >
                      {cat?.name || 'General'}
                    </span>
                  </div>

                  <button 
                    className="btn-icon-only" 
                    onClick={() => onDeleteRule(rule.id)}
                    style={{ color: '#ef4444', padding: '6px' }}
                    title="Delete rule"
                  >
                    <Trash2 size={14} />
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
