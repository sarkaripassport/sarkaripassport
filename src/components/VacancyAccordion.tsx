"use client";

import { useState } from 'react';
import { ChevronDown, GraduationCap, Briefcase } from 'lucide-react';

interface JobVacancy {
  name: string;
  education: string;
  vac: string;
}

export default function VacancyAccordion({ vacancies }: { vacancies: JobVacancy[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-3">
      {vacancies.map((row, i) => {
        const isOpen = openIndex === i;
        
        return (
          <div 
            key={i} 
            className={`
              bg-white border rounded-xl overflow-hidden transition-all duration-300
              ${isOpen ? 'border-blue-400 shadow-md shadow-blue-100/50' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'}
            `}
          >
            {/* Header (Always Visible) */}
            <button 
              onClick={() => toggleAccordion(i)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none group"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Modern Vacancy Badge */}
                <div className={`
                  flex flex-col items-center justify-center min-w-[3.5rem] px-3 py-1.5 rounded-lg border transition-colors
                  ${isOpen ? 'bg-[#0A58CA] border-[#0A58CA] text-white' : 'bg-[#F4F7FA] border-gray-200 text-[#0B1B3D] group-hover:bg-blue-50 group-hover:border-blue-200'}
                `}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isOpen ? 'text-blue-100' : 'text-gray-500'}`}>Seats</span>
                  <span className="font-black text-lg leading-none">{row.vac}</span>
                </div>
                
                {/* Post Name */}
                <h4 className={`font-extrabold text-[15px] sm:text-base leading-snug transition-colors ${isOpen ? 'text-[#0A58CA]' : 'text-[#0B1B3D] group-hover:text-[#0A58CA]'}`}>
                  {row.name}
                </h4>
              </div>
              
              {/* Chevron */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300
                ${isOpen ? 'bg-blue-50 text-[#0A58CA] rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'}
              `}>
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>

            {/* Expandable Content (Education) */}
            <div 
              className={`
                grid transition-all duration-300 ease-in-out
                ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
              `}
            >
              <div className="overflow-hidden">
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 rounded-lg p-4 flex items-start gap-3">
                    <div className="bg-white rounded-md p-2 shadow-sm border border-blue-100 shrink-0 mt-0.5">
                      <GraduationCap className="w-5 h-5 text-[#0A58CA]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0A58CA] uppercase tracking-wider block mb-1">Educational Qualification</span>
                      <span className="text-sm font-medium text-gray-700 leading-relaxed block">{row.education}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
