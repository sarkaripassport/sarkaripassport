const fs = require('fs/promises');
const path = require('path');

async function main() {
  // 1. Create Server Actions
  const actionsPath = path.join(process.cwd(), 'src', 'app', 'admin', 'announcements', 'actions.ts');
  const actionsCode = `'use server';

import { updateJob, getSettings, saveSettings } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function toggleJobTrending(jobId: string, isTrending: boolean) {
  await updateJob(jobId, { isTrending });
  revalidatePath('/', 'layout');
}

export async function updateAnnouncements(announcements: any[]) {
  const settings = await getSettings();
  settings.announcements = announcements;
  await saveSettings(settings);
  revalidatePath('/', 'layout');
}
`;
  await fs.writeFile(actionsPath, actionsCode, 'utf-8');

  // 2. Create AnnouncementsClient.tsx
  const clientPath = path.join(process.cwd(), 'src', 'app', 'admin', 'announcements', 'AnnouncementsClient.tsx');
  const clientCode = `"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Megaphone, Zap, ExternalLink, Link as LinkIcon, AlertTriangle } from "lucide-react";
import { toggleJobTrending, updateAnnouncements } from "./actions";

export default function AnnouncementsClient({ initialJobs, initialAnnouncements }: { initialJobs: any[], initialAnnouncements: any[] }) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'custom'>('jobs');
  
  const [jobs, setJobs] = useState(initialJobs);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [isPending, startTransition] = useTransition();

  const handleToggleTrending = (id: string, currentStatus: boolean) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, isTrending: !currentStatus } : j));
    startTransition(() => {
      toggleJobTrending(id, !currentStatus);
    });
  };

  const saveAnns = (newAnns: any[]) => {
    setAnnouncements(newAnns);
    startTransition(() => {
      updateAnnouncements(newAnns);
    });
  };

  const handleToggleAnnouncement = (id: string) => {
    saveAnns(announcements.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const deleteAnnouncement = (id: string) => {
    saveAnns(announcements.filter(a => a.id !== id));
  };

  const [newText, setNewText] = useState('');
  const [newLink, setNewLink] = useState('');
  const [highPriority, setHighPriority] = useState(false);

  const handleAdd = () => {
    if(!newText.trim()) return;
    const newAnn = {
      id: \`a\${Date.now()}\`,
      text: { en: newText, hi: '', mr: '' },
      link: newLink,
      priority: highPriority ? 'high' : 'normal',
      isActive: true
    };
    saveAnns([newAnn, ...announcements]);
    setNewText('');
    setNewLink('');
    setHighPriority(false);
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-100 text-red-600 rounded-lg">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0B1B3D]">Breaking News Manager</h1>
          <p className="text-gray-500">Manage what scrolls in the red ticker at the top of the website.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('jobs')}
          className={\`pb-3 px-2 font-bold uppercase text-sm border-b-2 transition-colors \${activeTab === 'jobs' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}
        >
          Auto-Link Posted Jobs
        </button>
        <button 
          onClick={() => setActiveTab('custom')}
          className={\`pb-3 px-2 font-bold uppercase text-sm border-b-2 transition-colors \${activeTab === 'custom' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}
        >
          Custom Announcements
        </button>
      </div>

      {activeTab === 'jobs' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-gray-800">Recent Jobs</h2>
              <p className="text-sm text-gray-500">Toggle jobs on to automatically generate a link and push them to the live breaking news ticker.</p>
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-medium">Job Title (EN)</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium text-right">Show in Ticker?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-800">{typeof job.title === 'string' ? job.title : job.title?.en}</td>
                  <td className="p-4">
                    <span className={\`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700\`}>
                      {job.category || 'Latest Jobs'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleToggleTrending(job.id, job.isTrending)}
                      className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors \${job.isTrending ? 'bg-red-600' : 'bg-gray-300'}\`}
                    >
                      <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${job.isTrending ? 'translate-x-6' : 'translate-x-1'}\`} />
                    </button>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-gray-500">No jobs found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add New Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-10">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add New Alert
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Text</label>
                  <textarea 
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm h-24"
                    placeholder="E.g., Server maintenance scheduled for 2 AM tonight..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (Optional)</label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      className="w-full p-2 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                  <input type="checkbox" id="highPriority" checked={highPriority} onChange={e=>setHighPriority(e.target.checked)} className="mt-1" />
                  <label htmlFor="highPriority" className="text-sm">
                    <span className="font-bold text-yellow-800 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> High Priority</span>
                    <span className="text-yellow-700 text-xs block mt-0.5">Highlights this text in bright yellow in the ticker to grab attention.</span>
                  </label>
                </div>

                <button onClick={handleAdd} className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold uppercase transition-colors">
                  Publish Announcement
                </button>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2 space-y-4">
            {announcements.map(announcement => {
              const textVal = typeof announcement.text === 'string' ? announcement.text : announcement.text?.en || '';
              return (
                <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-start gap-4">
                  <div className="pt-1">
                    <button 
                      onClick={() => handleToggleAnnouncement(announcement.id)}
                      className={\`relative inline-flex h-5 w-9 items-center rounded-full transition-colors \${announcement.isActive ? 'bg-green-500' : 'bg-gray-300'}\`}
                    >
                      <span className={\`inline-block h-3 w-3 transform rounded-full bg-white transition-transform \${announcement.isActive ? 'translate-x-5' : 'translate-x-1'}\`} />
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={\`font-medium \${announcement.priority === 'high' ? 'text-yellow-600 font-bold' : 'text-gray-800'}\`}>
                        {textVal}
                      </span>
                      {announcement.priority === 'high' && (
                        <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                          <Zap className="w-3 h-3" /> High
                        </span>
                      )}
                    </div>
                    {announcement.link && (
                      <a href={announcement.link} target="_blank" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> {announcement.link}
                      </a>
                    )}
                    {!announcement.isActive && (
                      <span className="text-xs text-red-500 font-medium block mt-1">Currently Hidden</span>
                    )}
                  </div>
                  <button 
                    onClick={() => deleteAnnouncement(announcement.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
            {announcements.length === 0 && <p className="text-gray-500 text-center italic mt-10">No custom announcements.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
`;
  await fs.writeFile(clientPath, clientCode, 'utf-8');

  // 3. Update page.tsx to be a Server Component
  const pagePath = path.join(process.cwd(), 'src', 'app', 'admin', 'announcements', 'page.tsx');
  const pageCode = `import { getJobs, getSettings } from '@/lib/db';
import AnnouncementsClient from './AnnouncementsClient';

export default async function AnnouncementsAdminPage() {
  const jobs = await getJobs();
  const settings = await getSettings();
  
  return <AnnouncementsClient initialJobs={jobs} initialAnnouncements={settings.announcements || []} />;
}
`;
  await fs.writeFile(pagePath, pageCode, 'utf-8');

  // 4. Update AdminClientShell.tsx to add the button
  const shellPath = path.join(process.cwd(), 'src', 'app', 'admin', 'AdminClientShell.tsx');
  let shellContent = await fs.readFile(shellPath, 'utf-8');
  
  // Add Megaphone to lucide-react import
  shellContent = shellContent.replace(/LogOut, Bell, ChevronDown, Monitor, Search, Plus, User,/, "LogOut, Bell, ChevronDown, Monitor, Search, Plus, User, Megaphone,");
  
  // Inject the Breaking News link right before Job Postings Menu
  const breakingNewsLink = `
            {/* Breaking News Dedicated Link */}
            <Link href="/admin/announcements" className="flex items-center gap-2 px-3 py-2 hover:text-white hover:bg-red-600 transition-colors group">
              <Megaphone className="w-5 h-5 text-red-400 group-hover:text-white" /> 
              <span className="font-bold text-red-300 group-hover:text-white">Breaking News</span>
            </Link>

            <div className="my-2 border-t border-white/10"></div>
`;
  
  shellContent = shellContent.replace(/{[\s\n]*\/\* Jobs Menu \(Expandable\) \*\//, breakingNewsLink + '\n            {/* Jobs Menu (Expandable) */');

  await fs.writeFile(shellPath, shellContent, 'utf-8');
}
main();
