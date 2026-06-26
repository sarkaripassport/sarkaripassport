'use client';

import { useState } from 'react';
import { Link as LinkIcon, Plus, Trash2, Settings } from 'lucide-react';

export default function ImportantLinksWidget({ initialData }: { initialData?: any }) {
  const [links, setLinks] = useState<{ id: number; label: string; url: string }[]>(
    initialData?.links || [
      { id: 1, label: 'Apply Online', url: '' },
      { id: 2, label: 'Download Notification', url: '' },
      { id: 3, label: 'Official Website', url: '' }
    ]
  );

  const addLink = () => {
    setLinks([...links, { id: Date.now(), label: '', url: '' }]);
  };

  const removeLink = (id: number) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const updateLink = (id: number, field: 'label' | 'url', value: string) => {
    setLinks(
      links.map((l) => {
        if (l.id === id) {
          return { ...l, [field]: value };
        }
        return l;
      })
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6 w-full">
      <div className="bg-purple-50 border-b border-purple-100 py-2.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-purple-900">
          <LinkIcon className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-bold uppercase tracking-wider">Important Links</span>
        </div>
        <button
          onClick={addLink}
          className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-purple-700 flex items-center gap-1 shadow-sm transition-colors"
        >
          <Plus className="w-3 h-3" /> Add Link
        </button>
      </div>

      <div className="p-4 space-y-3 bg-gray-50/50">
        {links.map((link, idx) => (
          <div key={link.id} className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
            <div className="w-full sm:w-1/3">
              <input
                type="text"
                placeholder="Link Label (e.g. Apply Online)"
                value={link.label}
                onChange={(e) => updateLink(link.id, 'label', e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-purple-500 outline-none font-bold text-gray-700 placeholder:font-normal"
              />
            </div>
            <div className="w-full sm:flex-1">
              <input
                type="url"
                placeholder="https://..."
                value={link.url}
                onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-purple-500 outline-none text-blue-600"
              />
            </div>
            <button
              onClick={() => removeLink(link.id)}
              disabled={links.length === 1}
              className="text-red-400 hover:text-red-600 disabled:opacity-30 p-2 hover:bg-red-50 rounded transition-colors self-end sm:self-auto"
              title="Remove Link"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 text-green-400 p-3 text-[10px] font-mono border-t border-gray-200 max-h-32 overflow-y-auto">
        <div className="text-gray-400 mb-1 flex items-center gap-1">
          <Settings className="w-3 h-3" /> Live JSON Output (SEO Ready):
        </div>
        {JSON.stringify(links.map(({ label, url }) => ({ label, url })), null, 2)}
      </div>
    </div>
  );
}
