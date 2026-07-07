"use client";

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, Shield, FileText, Award, CheckCircle2, GraduationCap, Building2, MapPin, Landmark, Train, ShieldCheck, Briefcase } from 'lucide-react';
import type { Category } from '@/lib/db';

const ICON_MAP: Record<string, any> = {
  Briefcase, FileText, Award, CheckCircle2, GraduationCap, Building2, MapPin, Landmark, Train, ShieldCheck, Shield
};

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categories)
      });
      alert('Categories saved successfully!');
    } catch (err) {
      alert('Failed to save categories');
    }
    setSaving(false);
  };

  const addCategory = () => {
    setCategories([
      ...categories,
      { id: `c${Date.now()}`, name: { en: '', hi: '', mr: '' }, slug: '', icon: 'Briefcase', isTrending: false, isQuickLink: false }
    ]);
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const updateCategory = (id: string, field: keyof Category, value: any) => {
    setCategories(categories.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: value };
        // Auto-generate slug from name if name is updated
        if (field === 'name') {
          const enName = typeof value === 'string' ? value : (value?.en || '');
          updated.slug = enName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
        return updated;
      }
      return c;
    }));
  };

  if (loading) {
    return <div className="p-8">Loading categories...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1B3D]">Category Manager</h1>
          <p className="text-sm text-gray-500">Manage all job categories, icons, and visibility on the homepage.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2 bg-[#0A58CA] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-bold text-[#0B1B3D]">All Categories</h2>
          <button onClick={addCategory} className="flex items-center gap-1 text-sm bg-blue-50 text-[#0A58CA] px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
        
        <div className="space-y-3">
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Briefcase;
            return (
              <div key={cat.id} className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-300 transition">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Category Name</label>
                    <input 
                      type="text" 
                      value={typeof cat.name === 'string' ? cat.name : (cat.name?.en || '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        const newName = typeof cat.name === 'string' 
                          ? { en: val, hi: '', mr: '' } 
                          : { ...(cat.name as any), en: val };
                        updateCategory(cat.id, 'name', newName);
                      }}
                      className="w-full px-2 py-1 text-sm border-b border-gray-300 bg-transparent focus:border-[#0A58CA] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">URL Slug</label>
                    <input 
                      type="text" 
                      value={cat.slug}
                      onChange={(e) => updateCategory(cat.id, 'slug', e.target.value)}
                      className="w-full px-2 py-1 text-sm border-b border-gray-300 bg-transparent focus:border-[#0A58CA] outline-none font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Icon</label>
                    <select 
                      value={cat.icon}
                      onChange={(e) => updateCategory(cat.id, 'icon', e.target.value)}
                      className="w-full px-2 py-1 text-sm border-b border-gray-300 bg-transparent focus:border-[#0A58CA] outline-none"
                    >
                      {Object.keys(ICON_MAP).map(key => (
                        <option key={key} value={key}>{key}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-l border-gray-300 pl-4 shrink-0">
                  <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cat.isQuickLink}
                      onChange={(e) => updateCategory(cat.id, 'isQuickLink', e.target.checked)}
                      className="w-4 h-4 text-[#0A58CA] rounded"
                    /> 
                    <span className={cat.isQuickLink ? 'font-bold text-[#0A58CA]' : 'text-gray-600'}>Quick Link</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cat.isTrending}
                      onChange={(e) => updateCategory(cat.id, 'isTrending', e.target.checked)}
                      className="w-4 h-4 text-[#0A58CA] rounded"
                    /> 
                    <span className={cat.isTrending ? 'font-bold text-[#0A58CA]' : 'text-gray-600'}>Trending</span>
                  </label>
                  <button onClick={() => removeCategory(cat.id)} className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
