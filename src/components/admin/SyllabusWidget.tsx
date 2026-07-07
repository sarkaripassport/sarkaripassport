import React, { useState } from 'react';
import { Job, SyllabusSection, LocalizedString } from '@/lib/db';
import { Plus, Trash2, BookOpen } from 'lucide-react';

interface Props {
  job: Partial<Job>;
  updateJob: (updates: Partial<Job>) => void;
}

export default function SyllabusWidget({ job, updateJob }: Props) {
  const [syllabus, setSyllabus] = useState<SyllabusSection[]>(job.syllabus || []);
  const [activeLang, setActiveLang] = useState<'en' | 'hi' | 'mr'>('en');

  const addSubject = () => {
    const newSection: SyllabusSection = {
      subject: { en: '', hi: '', mr: '' },
      topics: []
    };
    const newSyllabus = [...syllabus, newSection];
    setSyllabus(newSyllabus);
    updateJob({ syllabus: newSyllabus });
  };

  const removeSubject = (idx: number) => {
    const newSyllabus = syllabus.filter((_, i) => i !== idx);
    setSyllabus(newSyllabus);
    updateJob({ syllabus: newSyllabus });
  };

  const addTopic = (subjectIdx: number) => {
    const newSyllabus = [...syllabus];
    newSyllabus[subjectIdx].topics.push({ title: { en: '', hi: '', mr: '' } });
    setSyllabus(newSyllabus);
    updateJob({ syllabus: newSyllabus });
  };

  const removeTopic = (subjectIdx: number, topicIdx: number) => {
    const newSyllabus = [...syllabus];
    newSyllabus[subjectIdx].topics = newSyllabus[subjectIdx].topics.filter((_, i) => i !== topicIdx);
    setSyllabus(newSyllabus);
    updateJob({ syllabus: newSyllabus });
  };

  const updateSubject = (subjectIdx: number, val: string) => {
    const newSyllabus = [...syllabus];
    newSyllabus[subjectIdx].subject[activeLang] = val;
    setSyllabus(newSyllabus);
    updateJob({ syllabus: newSyllabus });
  };

  const updateTopic = (subjectIdx: number, topicIdx: number, val: string) => {
    const newSyllabus = [...syllabus];
    newSyllabus[subjectIdx].topics[topicIdx].title[activeLang] = val;
    setSyllabus(newSyllabus);
    updateJob({ syllabus: newSyllabus });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" /> Syllabus Builder
          </h2>
          <p className="text-sm text-gray-500 mt-1">Add native syllabus data to boost Answer Engine Optimization (AEO).</p>
        </div>
        
        <div className="flex rounded-lg overflow-hidden border border-gray-300">
          <button type="button" onClick={() => setActiveLang('en')} className={`px-3 py-1.5 text-xs font-bold ${activeLang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>EN</button>
          <button type="button" onClick={() => setActiveLang('hi')} className={`px-3 py-1.5 text-xs font-bold border-l border-gray-300 ${activeLang === 'hi' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>HI</button>
          <button type="button" onClick={() => setActiveLang('mr')} className={`px-3 py-1.5 text-xs font-bold border-l border-gray-300 ${activeLang === 'mr' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>MR</button>
        </div>
      </div>

      <div className="space-y-6">
        {syllabus.map((section, sIdx) => (
          <div key={sIdx} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
            <button
              type="button"
              onClick={() => removeSubject(sIdx)}
              className="absolute -right-2 -top-2 bg-white border border-red-200 text-red-500 w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-50 shadow-sm"
              title="Remove Subject"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subject Name ({activeLang})</label>
              <input
                type="text"
                value={section.subject[activeLang] || ''}
                onChange={(e) => updateSubject(sIdx, e.target.value)}
                placeholder="e.g. General Intelligence & Reasoning"
                className="w-full border-gray-300 rounded-lg text-sm px-3 py-2 border shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="pl-4 border-l-2 border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-600 uppercase">Topics ({activeLang})</label>
                <button
                  type="button"
                  onClick={() => addTopic(sIdx)}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold hover:bg-blue-200 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Topic
                </button>
              </div>

              {section.topics.map((topic, tIdx) => (
                <div key={tIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={topic.title[activeLang] || ''}
                    onChange={(e) => updateTopic(sIdx, tIdx, e.target.value)}
                    placeholder="e.g. Analogies"
                    className="flex-1 border-gray-300 rounded-lg text-sm px-3 py-1.5 border shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeTopic(sIdx, tIdx)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {section.topics.length === 0 && (
                <div className="text-xs text-gray-400 italic">No topics added. Click "Add Topic" above.</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addSubject}
        className="mt-6 w-full border-2 border-dashed border-gray-300 rounded-lg py-3 flex items-center justify-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add New Subject
      </button>
    </div>
  );
}
