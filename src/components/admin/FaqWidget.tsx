'use client';

import { HelpCircle } from 'lucide-react';

export default function FaqWidget() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full">
      <div className="bg-amber-50 border-b border-amber-100 py-2.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">FAQ Schema Generator (SEO)</span>
        </div>
        <span className="text-[10px] font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded uppercase">Auto JSON-LD</span>
      </div>
      <div className="p-4 space-y-4">
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
          <input type="text" placeholder="Question 1 (e.g. What is the last date to apply?)" className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-sm mb-2 font-semibold" />
          <textarea placeholder="Answer 1" rows={2} className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-sm resize-none"></textarea>
        </div>
        <button className="text-sm font-bold text-[#0A58CA] hover:underline">+ Add another FAQ</button>
      </div>
    </div>
  );
}
