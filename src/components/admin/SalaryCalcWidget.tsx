"use client";

import { Job } from "@/lib/db";
import { DollarSign, Plus, Trash2 } from "lucide-react";

interface Props {
  job: Partial<Job>;
  onChange: (job: Partial<Job>) => void;
}

export default function SalaryCalcWidget({ job, onChange }: Props) {
  const calc = job.salary_calculator || {
    enabled: false,
    base_pay: 0,
    pay_level: "",
    da_percent: 50,
    hra_tier1_percent: 27,
    hra_tier2_percent: 18,
    hra_tier3_percent: 9,
    ta_tier1_amount: 3600,
    ta_tier2_amount: 1800,
    custom_allowances: []
  };

  // Ensure arrays exist for backwards compatibility during migration
  if (!calc.custom_allowances) calc.custom_allowances = [];

  const updateField = (field: keyof typeof calc, value: any) => {
    onChange({
      ...job,
      salary_calculator: {
        ...calc,
        [field]: value
      }
    });
  };

  const addCustomAllowance = () => {
    updateField('custom_allowances', [
      ...calc.custom_allowances,
      { name: "New Allowance", amount: 1000 }
    ]);
  };

  const updateCustomAllowance = (index: number, field: 'name' | 'amount', value: any) => {
    const updated = [...calc.custom_allowances];
    updated[index] = { ...updated[index], [field]: value };
    updateField('custom_allowances', updated);
  };

  const removeCustomAllowance = (index: number) => {
    const updated = calc.custom_allowances.filter((_, i) => i !== index);
    updateField('custom_allowances', updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-4 border-b border-green-200 pb-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-900">Advanced Salary Calculator</h3>
            <p className="text-sm text-green-700">Fully customizable gamified "In-Hand Salary" widget.</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-green-400 transition shadow-sm">
            <input 
              type="checkbox"
              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              checked={calc.enabled}
              onChange={(e) => updateField('enabled', e.target.checked)}
            />
            <span className="font-bold text-gray-800">Enable Salary Calculator for this Job</span>
          </label>

          {calc.enabled && (
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Base Pay (₹)</label>
                  <input 
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="e.g. 25500"
                    value={calc.base_pay || ''}
                    onChange={(e) => updateField('base_pay', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Pay Level / Grade</label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="e.g. Level 4 (7th CPC)"
                    value={calc.pay_level || ''}
                    onChange={(e) => updateField('pay_level', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">DA (%)</label>
                  <input 
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    value={calc.da_percent ?? 50}
                    onChange={(e) => updateField('da_percent', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">HRA Tier 1 (X) %</label>
                  <input 
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    value={calc.hra_tier1_percent ?? 27}
                    onChange={(e) => updateField('hra_tier1_percent', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">HRA Tier 2 (Y) %</label>
                  <input 
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    value={calc.hra_tier2_percent ?? 18}
                    onChange={(e) => updateField('hra_tier2_percent', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">HRA Tier 3 (Z) %</label>
                  <input 
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    value={calc.hra_tier3_percent ?? 9}
                    onChange={(e) => updateField('hra_tier3_percent', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">TA Tier 1 (Higher Cities) (₹)</label>
                  <input 
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    value={calc.ta_tier1_amount ?? 3600}
                    onChange={(e) => updateField('ta_tier1_amount', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">TA Tier 2/3 (Other Places) (₹)</label>
                  <input 
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    value={calc.ta_tier2_amount ?? 1800}
                    onChange={(e) => updateField('ta_tier2_amount', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-900">Custom Allowances</h4>
                  <button
                    type="button"
                    onClick={addCustomAllowance}
                    className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-200 transition"
                  >
                    <Plus className="w-4 h-4" /> Add Allowance
                  </button>
                </div>
                
                {calc.custom_allowances.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No custom allowances added. Candidates will see standard DA, HRA, TA.</p>
                ) : (
                  <div className="space-y-3">
                    {calc.custom_allowances.map((allowance: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Allowance Name (e.g. Nursing)"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none text-sm"
                            value={allowance.name}
                            onChange={(e) => updateCustomAllowance(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="w-32">
                          <input
                            type="number"
                            placeholder="Amount (₹)"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none text-sm"
                            value={allowance.amount || ''}
                            onChange={(e) => updateCustomAllowance(index, 'amount', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCustomAllowance(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
