import React from 'react';
import { Job, ApplicationFee, LocalizedString } from '@/lib/db';
import { Plus, Trash2, IndianRupee } from 'lucide-react';

interface Props {
  job: Partial<Job>;
  editLang: 'en' | 'hi' | 'mr';
  onChange: (updates: Partial<Job>) => void;
}

export default function ApplicationFeeWidget({ job, editLang, onChange }: Props) {
  const fees = job.application_fee || [];

  const addFee = () => {
    onChange({
      application_fee: [...fees, { category: { en: '', hi: '', mr: '' }, amount: { en: '', hi: '', mr: '' } }]
    });
  };

  const removeFee = (index: number) => {
    const newFees = [...fees];
    newFees.splice(index, 1);
    onChange({ application_fee: newFees });
  };

  const updateFee = (index: number, field: keyof ApplicationFee, value: string) => {
    const newFees = [...fees];
    newFees[index] = {
      ...newFees[index],
      [field]: {
        ...newFees[index][field],
        [editLang]: value
      }
    };
    onChange({ application_fee: newFees });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4 border-b pb-2">
        <IndianRupee className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-bold text-[#0B1B3D]">Application Fees</h2>
      </div>

      <div className="space-y-4">
        {fees.map((fee, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-3 items-center border p-4 rounded bg-gray-50 border-green-100 relative">
            <div className="w-full">
              <label className="block text-xs font-bold text-gray-500 mb-1">Category (e.g. Gen/OBC)</label>
              <input
                type="text"
                placeholder="Category"
                className="w-full border rounded p-2 font-bold focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                value={fee.category?.[editLang] || ''}
                onChange={(e) => updateFee(index, 'category', e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="block text-xs font-bold text-gray-500 mb-1">Amount (e.g. ₹100 or Nil)</label>
              <input
                type="text"
                placeholder="Amount / Fee"
                className="w-full border rounded p-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                value={fee.amount?.[editLang] || ''}
                onChange={(e) => updateFee(index, 'amount', e.target.value)}
              />
            </div>
            <button
              className="text-red-500 hover:bg-red-50 p-2 rounded-full absolute top-2 right-2 md:static"
              onClick={() => removeFee(index)}
              title="Remove Fee"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        
        {fees.length === 0 && (
          <div className="text-center py-6 text-gray-400 bg-gray-50 rounded border border-dashed border-gray-200">
            No application fees added yet.
          </div>
        )}

        <button
          className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded font-bold hover:bg-green-100 border border-green-200 transition-colors"
          onClick={addFee}
        >
          <Plus className="w-4 h-4" /> Add Fee Category
        </button>
      </div>
    </div>
  );
}
