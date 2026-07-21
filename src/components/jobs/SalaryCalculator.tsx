"use client";

import { useState, useEffect } from "react";
import { Calculator, IndianRupee, TrendingUp, Building2, Car, ShieldCheck } from "lucide-react";

interface SalaryData {
  base_pay: number;
  pay_level: string;
  da_percent?: number;
  hra_tier1_percent?: number;
  hra_tier2_percent?: number;
  hra_tier3_percent?: number;
  ta_tier1_amount?: number;
  ta_tier2_amount?: number;
  custom_allowances?: { name: string; amount: number }[];
}

export default function SalaryCalculator({ data }: { data: SalaryData }) {
  const { 
    base_pay, 
    pay_level, 
    da_percent = 50, 
    hra_tier1_percent = 27, 
    hra_tier2_percent = 18, 
    hra_tier3_percent = 9, 
    ta_tier1_amount = 3600, 
    ta_tier2_amount = 1800,
    custom_allowances = []
  } = data;

  const [hraCity, setHraCity] = useState<'tier1' | 'tier2' | 'tier3' | 'none'>('tier1');
  const [includeDa, setIncludeDa] = useState(true);
  const [includeTa, setIncludeTa] = useState(true);

  // Constants based on DB or defaults
  const HRA_RATES = { 'tier1': hra_tier1_percent, 'tier2': hra_tier2_percent, 'tier3': hra_tier3_percent, 'none': 0 };

  const [animatedTotal, setAnimatedTotal] = useState(base_pay);

  // Calculations
  const daAmount = includeDa ? Math.round(base_pay * (da_percent / 100)) : 0;
  const hraAmount = Math.round(base_pay * (HRA_RATES[hraCity] / 100));
  
  // Basic TA logic based on level
  let taAmount = 0;
  if (includeTa) {
    taAmount = hraCity === 'tier1' ? ta_tier1_amount : ta_tier2_amount;
    // Add DA on TA
    if (includeDa) {
      taAmount += Math.round(taAmount * (da_percent / 100));
    }
  }

  // Custom Allowances
  const customAllowancesTotal = custom_allowances.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const grossSalary = base_pay + daAmount + hraAmount + taAmount + customAllowancesTotal;
  // Approx deductions (NPS 10% of Basic+DA, CGHS, CGEGIS)
  const npsDeduction = Math.round((base_pay + daAmount) * 0.10);
  const cghsDeduction = 650; // Approx for level 4-5
  const inHandSalary = grossSalary - (npsDeduction + cghsDeduction);

  // Animate the total number
  useEffect(() => {
    let startTimestamp: number;
    const duration = 500;
    const startValue = animatedTotal;
    const endValue = inHandSalary;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedTotal(Math.floor(startValue + (endValue - startValue) * easeProgress));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setAnimatedTotal(endValue);
      }
    };
    
    window.requestAnimationFrame(step);
   
  }, [inHandSalary]);

  return (
    <div className="bg-white rounded-xl border border-[#0A58CA]/20 shadow-md overflow-hidden my-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#002D62] to-[#0A58CA] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">Interactive Salary Calculator</h3>
            <p className="text-blue-100 text-xs">Estimate your 7th Pay Commission "In-Hand" salary</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-white text-xs font-bold uppercase tracking-wider">{pay_level}</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        
        {/* Left Side: Toggles */}
        <div className="lg:col-span-3 space-y-5">
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-[#0A58CA]" />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">Base Pay</div>
                <div className="text-xs text-gray-500">Starting basic salary without allowances</div>
              </div>
            </div>
            <div className="font-black text-gray-900 text-lg">₹{base_pay.toLocaleString('en-IN')}</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-500" /> Posting City (HRA)
            </label>
            <div className="flex flex-col sm:flex-row bg-gray-100 p-1 rounded-lg border border-gray-200 gap-1">
              <button 
                onClick={() => setHraCity('tier1')}
                className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-md transition-all ${hraCity === 'tier1' ? 'bg-white text-[#0A58CA] shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
              >
                Tier 1 (X) - {hra_tier1_percent}%
              </button>
              <button 
                onClick={() => setHraCity('tier2')}
                className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-md transition-all ${hraCity === 'tier2' ? 'bg-white text-[#0A58CA] shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
              >
                Tier 2 (Y) - {hra_tier2_percent}%
              </button>
              <button 
                onClick={() => setHraCity('tier3')}
                className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-md transition-all ${hraCity === 'tier3' ? 'bg-white text-[#0A58CA] shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
              >
                Tier 3 (Z) - {hra_tier3_percent}%
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${includeDa ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <input type="checkbox" className="mt-1" checked={includeDa} onChange={(e) => setIncludeDa(e.target.checked)} />
              <div>
                <div className={`text-sm font-bold ${includeDa ? 'text-green-900' : 'text-gray-700'}`}>Include DA ({da_percent}%)</div>
                <div className="text-xs text-gray-500 leading-tight mt-1">Dearness Allowance</div>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${includeTa ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <input type="checkbox" className="mt-1" checked={includeTa} onChange={(e) => setIncludeTa(e.target.checked)} />
              <div>
                <div className={`text-sm font-bold ${includeTa ? 'text-green-900' : 'text-gray-700'}`}>Include TA</div>
                <div className="text-xs text-gray-500 leading-tight mt-1">Transport Allowance (+DA)</div>
              </div>
            </label>
          </div>
        </div>

        {/* Right Side: Total Calculation display */}
        <div className="lg:col-span-2 bg-[#F4F7FA] rounded-xl border border-gray-200 p-5 flex flex-col justify-between">
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Salary Breakdown</h4>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Basic Pay</span>
              <span className="font-bold text-gray-800">₹{base_pay.toLocaleString('en-IN')}</span>
            </div>
            {daAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">DA ({da_percent}%)</span>
                <span className="font-bold text-green-600">+ ₹{daAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            {hraAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">HRA ({HRA_RATES[hraCity]}%)</span>
                <span className="font-bold text-green-600">+ ₹{hraAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            {taAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transport Allow.</span>
                <span className="font-bold text-green-600">+ ₹{taAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            {custom_allowances.map((allowance, idx) => allowance.amount > 0 && (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-600">{allowance.name || 'Other Allow.'}</span>
                <span className="font-bold text-green-600">+ ₹{allowance.amount.toLocaleString('en-IN')}</span>
              </div>
            ))}
            
            <div className="flex justify-between text-sm border-t border-gray-300 pt-2">
              <span className="text-gray-600">Gross Salary</span>
              <span className="font-bold text-gray-800">₹{grossSalary.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm text-red-500">
              <span>Est. Deductions (NPS)</span>
              <span>- ₹{(npsDeduction + cghsDeduction).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="bg-white border-2 border-green-500 rounded-xl p-4 text-center shadow-lg transform transition-transform hover:scale-105">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated In-Hand Salary</div>
            <div className="text-3xl sm:text-4xl font-black text-green-600 tabular-nums">
              ₹{animatedTotal.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-gray-400 mt-2 flex items-center justify-center gap-1 text-center">
              <ShieldCheck className="w-3 h-3 flex-shrink-0" /> Exact amount may vary based on deductions.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
