'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';

export default function ImportantDatesWidget({ initialData }: { initialData?: any }) {
  const [dates, setDates] = useState({
    start: initialData?.start || '',
    last: initialData?.last || '',
    payFee: initialData?.payFee || '',
    correction: initialData?.correction || '',
    exam: initialData?.exam || ''
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden w-full">
      <div className="bg-blue-50 border-b border-blue-100 py-2.5 px-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[#0A58CA]" />
        <span className="text-xs font-bold text-[#0B1B3D] uppercase tracking-wider">Important Dates</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-500 w-32">Application Start</label>
          <input type="date" value={dates.start} onChange={(e) => setDates({ ...dates, start: e.target.value })} className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:border-[#0A58CA] outline-none" />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-500 w-32">Last Date Apply</label>
          <input type="date" value={dates.last} onChange={(e) => setDates({ ...dates, last: e.target.value })} className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:border-[#0A58CA] outline-none" />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-500 w-32">Pay Fee Last Date</label>
          <input type="date" value={dates.payFee} onChange={(e) => setDates({ ...dates, payFee: e.target.value })} className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:border-[#0A58CA] outline-none" />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-500 w-32">Correction Date</label>
          <input type="text" placeholder="e.g. 10-12 Oct 2026" value={dates.correction} onChange={(e) => setDates({ ...dates, correction: e.target.value })} className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:border-[#0A58CA] outline-none" />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-500 w-32">Exam Date</label>
          <input type="text" placeholder="e.g. As per schedule" value={dates.exam} onChange={(e) => setDates({ ...dates, exam: e.target.value })} className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:border-[#0A58CA] outline-none" />
        </div>
      </div>
    </div>
  );
}
