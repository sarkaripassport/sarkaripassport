import React, { useState } from 'react';
import { Job } from '@/lib/db';
import { Network, X } from 'lucide-react';

interface Props {
  job: Partial<Job>;
  updateJob: (updates: Partial<Job>) => void;
}

function TagInput({ label, tags, onChange, placeholder }: { label: string, tags: string[], onChange: (tags: string[]) => void, placeholder: string }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const newTag = inputValue.trim().toLowerCase().replace(/\s+/g, '-');
    if (newTag && !tags.includes(newTag)) {
      onChange([...tags, newTag]);
    }
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="flex flex-col h-full">
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          className="flex-1 border-gray-300 rounded-lg shadow-sm py-2 px-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 border outline-none"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg font-bold hover:bg-purple-100 transition-colors text-xs"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-gray-50 border border-gray-200 rounded-lg flex-1 content-start">
        {tags.map((tag, idx) => (
          <span key={idx} className="bg-white border border-gray-200 px-2 py-1 rounded-md text-xs font-bold text-gray-700 flex items-center gap-1 shadow-sm">
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(idx)}
              className="text-gray-400 hover:text-red-500 ml-1 bg-gray-50 hover:bg-red-50 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {tags.length === 0 && <span className="text-gray-400 text-xs italic self-center ml-2">No tags added yet.</span>}
      </div>
      <div className="text-[10px] text-gray-400 mt-2 text-right">Total Tags: {tags.length}</div>
    </div>
  );
}

export default function SeoMatrixWidget({ job, updateJob }: Props) {
  const matrix = job.seo_matrix || {
    states: [],
    cities: [],
    qualifications: [],
    departments: []
  };

  const handleUpdate = (field: keyof typeof matrix, newTags: string[]) => {
    updateJob({
      seo_matrix: {
        ...matrix,
        [field]: newTags
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
          Type a tag and press <strong>Enter</strong> or <strong>Comma</strong>. These tags will be used to automatically generate optimized landing pages! Spaces are automatically converted to hyphens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        <TagInput 
          label="States" 
          tags={matrix.states} 
          onChange={(tags) => handleUpdate('states', tags)} 
          placeholder="e.g. maharashtra, delhi..." 
        />
        <TagInput 
          label="Cities" 
          tags={matrix.cities} 
          onChange={(tags) => handleUpdate('cities', tags)} 
          placeholder="e.g. pune, mumbai..." 
        />
        <TagInput 
          label="Qualifications" 
          tags={matrix.qualifications} 
          onChange={(tags) => handleUpdate('qualifications', tags)} 
          placeholder="e.g. 10th-pass, graduate..." 
        />
        <TagInput 
          label="Departments" 
          tags={matrix.departments} 
          onChange={(tags) => handleUpdate('departments', tags)} 
          placeholder="e.g. police, railway..." 
        />
      </div>
    </div>
  );
}
