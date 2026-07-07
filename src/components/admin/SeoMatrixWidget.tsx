import React from 'react';
import { Job } from '@/lib/db';
import { Network } from 'lucide-react';

interface Props {
  job: Partial<Job>;
  updateJob: (updates: Partial<Job>) => void;
}

export default function SeoMatrixWidget({ job, updateJob }: Props) {
  const matrix = job.seo_matrix || {
    states: [],
    cities: [],
    qualifications: [],
    departments: []
  };

  const handleUpdate = (field: keyof typeof matrix, value: string) => {
    // split by comma, trim, remove empty
    const array = value.split(',').map(s => s.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean);
    updateJob({
      seo_matrix: {
        ...matrix,
        [field]: array
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-lg font-bold text-[#0B1B3D] flex items-center gap-2">
          <Network className="w-5 h-5 text-purple-600" /> Programmatic SEO Matrix
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Add comma-separated slugs here (e.g. `maharashtra`, `pune`). These will be used to automatically generate thousands of optimized landing pages! Spaces will be converted to hyphens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">States</label>
          <input
            type="text"
            placeholder="e.g. maharashtra, delhi, gujarat"
            value={matrix.states.join(', ')}
            onChange={(e) => handleUpdate('states', e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 border outline-none"
          />
          <div className="text-[10px] text-gray-400 mt-1">Tags: {matrix.states.length}</div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Cities</label>
          <input
            type="text"
            placeholder="e.g. pune, mumbai, nagpur"
            value={matrix.cities.join(', ')}
            onChange={(e) => handleUpdate('cities', e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 border outline-none"
          />
          <div className="text-[10px] text-gray-400 mt-1">Tags: {matrix.cities.length}</div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Qualifications</label>
          <input
            type="text"
            placeholder="e.g. 10th-pass, 12th-pass, graduate"
            value={matrix.qualifications.join(', ')}
            onChange={(e) => handleUpdate('qualifications', e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 border outline-none"
          />
          <div className="text-[10px] text-gray-400 mt-1">Tags: {matrix.qualifications.length}</div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Departments</label>
          <input
            type="text"
            placeholder="e.g. police, railway, ssc"
            value={matrix.departments.join(', ')}
            onChange={(e) => handleUpdate('departments', e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 border outline-none"
          />
          <div className="text-[10px] text-gray-400 mt-1">Tags: {matrix.departments.length}</div>
        </div>
      </div>
    </div>
  );
}
