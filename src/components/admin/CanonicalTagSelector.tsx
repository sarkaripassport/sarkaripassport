"use client";

import { useState, useRef, useEffect } from 'react';
import { CANONICAL_WORD_BANK, CanonicalTag } from '@/lib/canonicalTaxonomy';
import { Plus, X, Tag, Sparkles, Check } from 'lucide-react';

interface CanonicalTagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  editLang?: 'en' | 'hi' | 'mr';
}

export default function CanonicalTagSelector({
  selectedTags = [],
  onChange,
  editLang = 'en'
}: CanonicalTagSelectorProps) {
  const [inputQuery, setInputQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = ['All', 'Qualification', 'Exam / Board', 'State', 'Category'];

  const filteredSuggestions = CANONICAL_WORD_BANK.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const query = inputQuery.toLowerCase().trim();
    if (!query) return matchesCategory;
    return (
      matchesCategory && (
        item.name.en.toLowerCase().includes(query) ||
        item.name.hi.includes(query) ||
        item.name.mr.includes(query) ||
        item.slug.includes(query)
      )
    );
  });

  const handleAddTag = (tagName: string) => {
    const trimmed = tagName.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      onChange([...selectedTags, trimmed]);
    }
    setInputQuery('');
  };

  const handleRemoveTag = (indexToRemove: number) => {
    onChange(selectedTags.filter((_, idx) => idx !== indexToRemove));
  };

  const popularQuickPills = [
    '10th Pass',
    '12th Pass',
    'Graduate',
    'SSC',
    'UPSC',
    'Railway',
    'Police',
    'Maharashtra',
    'Bank',
    'All India'
  ];

  return (
    <div className="space-y-3" ref={dropdownRef}>
      {/* Search & Autocomplete Input */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Search or type canonical tag (e.g. 10th Pass, SSC, Maharashtra)..."
              value={inputQuery}
              onChange={e => {
                setInputQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={e => {
                if (e.key === 'Enter' && inputQuery.trim()) {
                  e.preventDefault();
                  // Check if matches an existing canonical tag
                  const matched = CANONICAL_WORD_BANK.find(
                    t => t.name.en.toLowerCase() === inputQuery.trim().toLowerCase()
                  );
                  handleAddTag(matched ? matched.name.en : inputQuery.trim());
                  setIsOpen(false);
                }
              }}
            />
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            onClick={() => {
              if (inputQuery.trim()) {
                const matched = CANONICAL_WORD_BANK.find(
                  t => t.name.en.toLowerCase() === inputQuery.trim().toLowerCase()
                );
                handleAddTag(matched ? matched.name.en : inputQuery.trim());
                setIsOpen(false);
              }
            }}
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 bg-gray-50 p-1.5 border-b border-gray-200 overflow-x-auto text-xs font-semibold">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Suggestions List */}
            <div className="max-h-60 overflow-y-auto p-2 divide-y divide-gray-50">
              {filteredSuggestions.length === 0 ? (
                <div className="p-3 text-center text-xs text-gray-500">
                  No canonical tags matched. Press &quot;Add&quot; to insert custom tag.
                </div>
              ) : (
                filteredSuggestions.map((item, idx) => {
                  const isSelected = selectedTags.includes(item.name.en);
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isSelected}
                      onClick={() => {
                        handleAddTag(item.name.en);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-sm transition-colors ${
                        isSelected
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'hover:bg-blue-50 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-900">{item.name.en}</span>
                        <span className="text-xs text-gray-500">({item.name.hi} / {item.name.mr})</span>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                          {item.category}
                        </span>
                      </div>
                      {isSelected ? (
                        <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Added
                        </span>
                      ) : (
                        <span className="text-xs text-blue-600 font-semibold">+ Click to Add</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Popular Quick Pills */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Quick Add Canonical Tags:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {popularQuickPills.map(tag => {
            const isAdded = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                disabled={isAdded}
                onClick={() => handleAddTag(tag)}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold border transition-all ${
                  isAdded
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-default'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                {isAdded ? `✓ ${tag}` : `+ ${tag}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Tags Chips Display */}
      <div className="pt-1">
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          Active Tags for this Job ({selectedTags.length}):
        </label>
        <div className="flex flex-wrap gap-2 min-h-[36px] p-2 bg-gray-50 border border-gray-200 rounded-lg">
          {selectedTags.map((tag, idx) => {
            const canonicalObj = CANONICAL_WORD_BANK.find(t => t.name.en === tag);
            return (
              <span
                key={idx}
                className="bg-blue-100 border border-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <span>{tag}</span>
                {canonicalObj && (
                  <span className="text-[10px] text-blue-600 font-normal">
                    ({editLang === 'hi' ? canonicalObj.name.hi : editLang === 'mr' ? canonicalObj.name.mr : canonicalObj.slug})
                  </span>
                )}
                <button
                  type="button"
                  className="text-blue-600 hover:text-red-600 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center transition-colors ml-0.5"
                  onClick={() => handleRemoveTag(idx)}
                  title="Remove tag"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
          {selectedTags.length === 0 && (
            <span className="text-xs text-gray-400 italic py-0.5">
              No tags selected. Click from suggestions above or type custom tags.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
