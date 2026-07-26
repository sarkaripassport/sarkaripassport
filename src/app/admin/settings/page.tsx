"use client";

import { useState, useEffect } from 'react';
import { Save, AlertCircle, Shield, Key, HelpCircle, CheckCircle } from 'lucide-react';
import type { HomepageSettings } from '@/lib/db';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userRole, setUserRole] = useState<string>('co_admin');

  // Key configurations input state
  const [googleJsonInput, setGoogleJsonInput] = useState('');
  const [isKeyConfigured, setIsKeyConfigured] = useState(false);
  const [showJsonInput, setShowJsonInput] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setSettings(data);
        if (data.indexing?.google_json) {
          setIsKeyConfigured(true);
          setGoogleJsonInput('{"configured": true, "private_key": "••••••••"}');
        }
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
    if (!settings) return;
    
    // Safety check for critical IDs
    if (!window.confirm("Are you sure you want to save these settings? Modifying tracking codes or credentials incorrectly can disrupt analytics and indexing.")) {
      return;
    }

    setSaving(true);
    try {
      const updatedSettings = { ...settings };

      // Secure indexing credentials logic
      if (!updatedSettings.indexing) {
        updatedSettings.indexing = {};
      }

      if (showJsonInput && googleJsonInput.trim()) {
        try {
          // Verify input is valid JSON
          JSON.parse(googleJsonInput);
          updatedSettings.indexing.google_json = googleJsonInput.trim();
        } catch (e) {
          alert("Error: The Google Indexing Key must be a valid JSON string. Check your key formatting and try again.");
          setSaving(false);
          return;
        }
      } else if (!isKeyConfigured) {
        // If they cleared it
        updatedSettings.indexing.google_json = '';
      }

      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });

      alert('System settings saved successfully!');
      
      // Update local state
      if (updatedSettings.indexing.google_json) {
        setIsKeyConfigured(true);
        setShowJsonInput(false);
        setGoogleJsonInput('{"configured": true, "private_key": "••••••••"}');
      }
    } catch (err) {
      alert('Failed to save settings');
    }
    setSaving(false);
  };

  if (loading || !settings) {
    return <div className="p-8">Loading configurations...</div>;
  }

  const isSuperAdmin = userRole === 'super_admin';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1B3D]">System Settings</h1>
          <p className="text-sm text-gray-500">Configure global analytics, tracking IDs, and Google Indexing credentials.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2 bg-[#0A58CA] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Input Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tracking & Analytics */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#0B1B3D] border-b pb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" /> Tracking & Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Google Analytics ID (G-XXXX)</label>
                <input 
                  type="text" 
                  value={settings.analytics?.ga_id || ""}
                  onChange={(e) => setSettings({...settings, analytics: {...(settings.analytics || {}), ga_id: e.target.value}})}
                  className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                  placeholder="G-Q3D29NX6M7"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Google Tag Manager ID (GTM-XXXX)</label>
                <input 
                  type="text" 
                  value={settings.analytics?.gtm_id || ""}
                  onChange={(e) => setSettings({...settings, analytics: {...(settings.analytics || {}), gtm_id: e.target.value}})}
                  className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                  placeholder="GTM-XXXX"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Google AdSense Client ID (pub-XXXX)</label>
                <input 
                  type="text" 
                  value={settings.analytics?.adsense_id || ""}
                  onChange={(e) => setSettings({...settings, analytics: {...(settings.analytics || {}), adsense_id: e.target.value}})}
                  className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Indexing Configuration */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#0B1B3D] border-b pb-2 flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-600" /> Search Engine Instant Indexing
            </h2>

            <div className="space-y-4">
              {/* IndexNow API Key */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">IndexNow API Key (Bing, Yandex, etc.)</label>
                <input 
                  type="text" 
                  value={settings.indexing?.indexnow_key || ""}
                  onChange={(e) => setSettings({
                    ...settings, 
                    indexing: { ...(settings.indexing || {}), indexnow_key: e.target.value }
                  })}
                  className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-blue-500 outline-none text-sm font-mono"
                  placeholder="e.g. 3b2d1847e92a40b991cd68b75fcfa12b"
                />
                <p className="text-xs text-gray-400 mt-1">If blank, standard crawlers will be notified via sitemap only.</p>
              </div>

              {/* Google Indexing API Credentials JSON */}
              <div className="border-t pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Google Cloud Service Account JSON Key</span>
                  {!isSuperAdmin && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3" /> Super Admin Only
                    </span>
                  )}
                </label>

                {isKeyConfigured && !showJsonInput ? (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="text-sm font-bold text-purple-950">Google Indexing Active</div>
                        <div className="text-xs text-purple-700">JSON key credentials configured securely.</div>
                      </div>
                    </div>
                    {isSuperAdmin && (
                      <button 
                        onClick={() => {
                          setShowJsonInput(true);
                          setGoogleJsonInput('');
                        }}
                        className="text-xs bg-white border border-purple-200 text-purple-700 font-bold px-3 py-1.5 rounded-lg hover:bg-purple-100 transition"
                      >
                        Replace Key
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <textarea 
                      value={googleJsonInput}
                      onChange={(e) => setGoogleJsonInput(e.target.value)}
                      disabled={!isSuperAdmin}
                      rows={6}
                      className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-purple-500 outline-none text-xs font-mono bg-gray-50/50"
                      placeholder='{ "type": "service_account", "project_id": "...", "private_key": "-----BEGIN PRIVATE KEY----- ... }'
                    />
                    {isSuperAdmin && isKeyConfigured && (
                      <button 
                        onClick={() => {
                          setShowJsonInput(false);
                          setGoogleJsonInput('{"configured": true, "private_key": "••••••••"}');
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 mt-1 font-semibold block text-right"
                      >
                        Cancel replacement
                      </button>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Provide the complete downloaded service account key JSON. The private key will be securely processed and masked on the frontend.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Helper Callout */}
        <div className="space-y-6">
          <div className="bg-[#0B1B3D] text-white rounded-xl shadow-sm p-5 space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-blue-300">
              <HelpCircle className="w-4 h-4" /> Google Indexing Setup Guide
            </h3>
            <div className="text-xs space-y-3 leading-relaxed text-gray-300">
              <p>
                To enable **Google Search Instant Indexing** (updates appear in minutes instead of weeks):
              </p>
              <ol className="list-decimal list-inside space-y-2.5 border-t border-gray-800 pt-3">
                <li>
                  Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Cloud Console</a> and create a project.
                </li>
                <li>
                  Search library for **Google Indexing API** and click **Enable**.
                </li>
                <li>
                  Go to **IAM & Admin &gt; Service Accounts** and create a service account.
                </li>
                <li>
                  Click the account email, open **Keys** tab, click **Add Key &gt; Create New Key &gt; JSON**.
                </li>
                <li>
                  Copy the service account email, open **Google Search Console &gt; Settings &gt; Users**, click **Add User**, paste the email, and assign **Owner** permissions.
                </li>
                <li>
                  Copy the text from your downloaded key file and paste it in the JSON field on the left.
                </li>
              </ol>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
