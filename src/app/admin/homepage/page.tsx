"use client";

import { useState, useEffect } from 'react';
import { Save, AlertCircle, Plus, Trash2, Globe } from 'lucide-react';
import type { HomepageSettings, Category, Announcement } from '@/lib/db';
import { createClient } from '@/lib/supabase/client';

export default function HomepageManager() {
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userRole, setUserRole] = useState<string>('co_admin');

  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then(r => r.json()),
      fetch('/api/categories').then(r => r.json())
    ]).then(([settingsData, categoriesData]) => {
      setSettings(settingsData);
      setCategories(categoriesData);
      setLoading(false);
    });

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserRole(user.user_metadata?.role || 'co_admin');
      }
    });
  }, []);

  const handleSave = async () => {
    if (!window.confirm("Are you sure you want to save these settings? Warning: Modifying tracking IDs by mistake can impact your analytics and ad revenue.")) {
      return;
    }
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
        { id: `a${Date.now()}`, text: { en: '', hi: '', mr: '' } as any, link: '', isActive: true, priority: 'normal' }
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
              value={typeof settings.seo.title === 'string' ? settings.seo.title : settings.seo.title?.en || ''}
              onChange={(e) => setSettings({...settings, seo: {...settings.seo, title: typeof settings.seo.title === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(settings.seo.title as any), en: e.target.value}}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Meta Description</label>
            <textarea 
              value={typeof settings.seo.description === 'string' ? settings.seo.description : settings.seo.description?.en || ''}
              onChange={(e) => setSettings({...settings, seo: {...settings.seo, description: typeof settings.seo.description === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(settings.seo.description as any), en: e.target.value}}})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Keywords</label>
            <input 
              type="text" 
              value={typeof settings.seo.keywords === 'string' ? settings.seo.keywords : settings.seo.keywords?.en || ''}
              onChange={(e) => setSettings({...settings, seo: {...settings.seo, keywords: typeof settings.seo.keywords === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(settings.seo.keywords as any), en: e.target.value}}})}
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

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp Channel Link</label>
            <input 
              type="text" 
              value={settings.whatsapp_link || ""}
              onChange={(e) => setSettings({...settings, whatsapp_link: e.target.value})}
              placeholder="e.g. https://whatsapp.com/channel/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25D366] outline-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Updates the global floating WhatsApp button.</p>
          </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#0B1B3D] border-b pb-2">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Facebook</label>
              <input 
                type="text" 
                value={settings.social_links?.facebook || ""}
                onChange={(e) => setSettings({...settings, social_links: {...(settings.social_links || {}), facebook: e.target.value}})}
                placeholder="e.g. https://facebook.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1877F2] outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Twitter / X</label>
              <input 
                type="text" 
                value={settings.social_links?.twitter || ""}
                onChange={(e) => setSettings({...settings, social_links: {...(settings.social_links || {}), twitter: e.target.value}})}
                placeholder="e.g. https://twitter.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">YouTube</label>
              <input 
                type="text" 
                value={settings.social_links?.youtube || ""}
                onChange={(e) => setSettings({...settings, social_links: {...(settings.social_links || {}), youtube: e.target.value}})}
                placeholder="e.g. https://youtube.com/@..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0000] outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Telegram</label>
              <input 
                type="text" 
                value={settings.social_links?.telegram || ""}
                onChange={(e) => setSettings({...settings, social_links: {...(settings.social_links || {}), telegram: e.target.value}})}
                placeholder="e.g. https://t.me/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26A5E4] outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Instagram</label>
              <input 
                type="text" 
                value={settings.social_links?.instagram || ""}
                onChange={(e) => setSettings({...settings, social_links: {...(settings.social_links || {}), instagram: e.target.value}})}
                placeholder="e.g. https://instagram.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E4405F] outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Tracking & Analytics */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 relative">
          {userRole === 'co_admin' && (
            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
              <div className="bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200 flex items-center gap-2 font-bold text-gray-700">
                <AlertCircle className="w-4 h-4 text-orange-500" /> Only Super Admins can edit tracking settings.
              </div>
            </div>
          )}
          <h2 className="text-lg font-bold text-[#0B1B3D] border-b pb-2 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" /> Tracking & Analytics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Google Analytics ID</label>
              <input 
                type="text" 
                value={settings.analytics?.ga_id || ""}
                onChange={(e) => setSettings({...settings, analytics: {...(settings.analytics || {}), ga_id: e.target.value}})}
                onClick={() => userRole === 'super_admin' && window.alert("WARNING: Editing Google Analytics IDs can severely impact SEO tracking and data collection. Proceed carefully.")}
                disabled={userRole === 'co_admin'}
                placeholder="e.g. G-XXXXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Google Tag Manager ID</label>
              <input 
                type="text" 
                value={settings.analytics?.gtm_id || ""}
                onChange={(e) => setSettings({...settings, analytics: {...(settings.analytics || {}), gtm_id: e.target.value}})}
                onClick={() => userRole === 'super_admin' && window.alert("WARNING: Editing Google Tag Manager IDs can severely impact SEO tracking and data collection. Proceed carefully.")}
                disabled={userRole === 'co_admin'}
                placeholder="e.g. GTM-XXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm disabled:opacity-50"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Google AdSense Publisher ID</label>
            <input 
              type="text" 
              value={settings.analytics?.adsense_id || ""}
              onChange={(e) => setSettings({...settings, analytics: {...(settings.analytics || {}), adsense_id: e.target.value}})}
              onClick={() => userRole === 'super_admin' && window.alert("WARNING: Editing Google AdSense IDs can impact ad revenue. Proceed carefully.")}
              disabled={userRole === 'co_admin'}
              placeholder="e.g. ca-pub-XXXXXXXXXXXXXXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">This will automatically load the AdSense script globally.</p>
          </div>
        </div>

        {/* Hero Settings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#0B1B3D] border-b pb-2">Hero Section</h2>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Main Title (H1)</label>
            <input 
              type="text" 
              value={typeof settings.hero.title === 'string' ? settings.hero.title : settings.hero.title?.en || ''}
              onChange={(e) => setSettings({...settings, hero: {...settings.hero, title: typeof settings.hero.title === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(settings.hero.title as any), en: e.target.value}}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
            <textarea 
              value={typeof settings.hero.subtitle === 'string' ? settings.hero.subtitle : settings.hero.subtitle?.en || ''}
              onChange={(e) => setSettings({...settings, hero: {...settings.hero, subtitle: typeof settings.hero.subtitle === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(settings.hero.subtitle as any), en: e.target.value}}})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none"
            />
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
                value={typeof ann.text === 'string' ? ann.text : (ann.text as any)?.en || ''}
                onChange={(e) => updateAnnouncement(ann.id, 'text', typeof ann.text === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(ann.text as any), en: e.target.value})}
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
                    <option key={c.slug} value={c.name.en}>{c.name.en}</option>
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
