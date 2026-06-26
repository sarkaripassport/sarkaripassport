"use client";

import { useState, useEffect } from 'react';
import { Save, AlertCircle, Plus, Trash2 } from 'lucide-react';
import type { HomepageSettings, Category, Announcement } from '@/lib/db';

export default function HomepageManager() {
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then(r => r.json()),
      fetch('/api/categories').then(r => r.json())
    ]).then(([settingsData, categoriesData]) => {
      setSettings(settingsData);
      setCategories(categoriesData);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert('Homepage settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings');
    }
    setSaving(false);
  };

  const addAnnouncement = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      announcements: [
        ...settings.announcements,
        { id: `a${Date.now()}`, text: '', link: '', isActive: true, priority: 'normal' }
      ]
    });
  };

  const removeAnnouncement = (id: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      announcements: settings.announcements.filter(a => a.id !== id)
    });
  };

  const updateAnnouncement = (id: string, field: keyof Announcement, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      announcements: settings.announcements.map(a => 
        a.id === id ? { ...a, [field]: value } : a
      )
    });
  };

  if (loading || !settings) {
    return <div className="p-8">Loading settings...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1B3D]">Homepage Manager</h1>
          <p className="text-sm text-gray-500">Manage SEO, Hero section, and Live Announcements</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Settings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#0B1B3D] border-b pb-2">Global SEO Meta</h2>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Meta Title</label>
            <input 
              type="text" 
              value={settings.seo.title}
              onChange={(e) => setSettings({...settings, seo: {...settings.seo, title: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Meta Description</label>
            <textarea 
              value={settings.seo.description}
              onChange={(e) => setSettings({...settings, seo: {...settings.seo, description: e.target.value}})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Keywords</label>
            <input 
              type="text" 
              value={settings.seo.keywords}
              onChange={(e) => setSettings({...settings, seo: {...settings.seo, keywords: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Comma separated</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Google Search Console Verification ID</label>
            <input 
              type="text" 
              value={settings.seo.gscVerification || ""}
              onChange={(e) => setSettings({...settings, seo: {...settings.seo, gscVerification: e.target.value}})}
              placeholder="e.g. d1q8f7k... (Just the content value)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none font-mono text-sm"
            />
          </div>
        </div>

        {/* Hero Settings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#0B1B3D] border-b pb-2">Hero Section</h2>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Main Title (H1)</label>
            <input 
              type="text" 
              value={settings.hero.title}
              onChange={(e) => setSettings({...settings, hero: {...settings.hero, title: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
            <textarea 
              value={settings.hero.subtitle}
              onChange={(e) => setSettings({...settings, hero: {...settings.hero, subtitle: e.target.value}})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Live Announcements Ticker */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-bold text-[#0B1B3D]">Live Announcements (Ticker)</h2>
          <button onClick={addAnnouncement} className="flex items-center gap-1 text-sm text-[#0A58CA] font-bold hover:underline">
            <Plus className="w-4 h-4" /> Add Announcement
          </button>
        </div>
        
        <div className="space-y-3">
          {settings.announcements.map((ann, i) => (
            <div key={ann.id} className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <input 
                type="text" 
                placeholder="Announcement Text..."
                value={ann.text}
                onChange={(e) => updateAnnouncement(ann.id, 'text', e.target.value)}
                className="flex-1 min-w-[200px] px-3 py-1.5 text-sm border border-gray-300 rounded-md"
              />
              <input 
                type="text" 
                placeholder="Link (/jobs/...)"
                value={ann.link}
                onChange={(e) => updateAnnouncement(ann.id, 'link', e.target.value)}
                className="w-[200px] px-3 py-1.5 text-sm border border-gray-300 rounded-md"
              />
              <select 
                value={ann.priority}
                onChange={(e) => updateAnnouncement(ann.id, 'priority', e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white"
              >
                <option value="normal">Normal</option>
                <option value="high">High (Flashing)</option>
              </select>
              <label className="flex items-center gap-1 text-sm font-medium">
                <input 
                  type="checkbox" 
                  checked={ann.isActive}
                  onChange={(e) => updateAnnouncement(ann.id, 'isActive', e.target.checked)}
                /> Active
              </label>
              <button onClick={() => removeAnnouncement(ann.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {settings.announcements.length === 0 && (
            <p className="text-sm text-gray-500 italic">No announcements. Add one to show the breaking news ticker.</p>
          )}
        </div>
      </div>

      {/* 4 Columns Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#0B1B3D] border-b pb-2">4-Column Updates Sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(num => {
            const field = `col${num}_category` as keyof typeof settings.four_columns;
            return (
              <div key={num}>
                <label className="block text-sm font-bold text-gray-700 mb-1">Column {num}</label>
                <select 
                  value={settings.four_columns[field]}
                  onChange={(e) => setSettings({...settings, four_columns: {...settings.four_columns, [field]: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.slug} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
