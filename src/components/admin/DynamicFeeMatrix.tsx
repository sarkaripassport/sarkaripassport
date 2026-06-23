'use client';

import { useState } from 'react';
import { Plus, Trash2, IndianRupee } from 'lucide-react';

export default function DynamicFeeMatrix() {
  const [fees, setFees] = useState([
    { id: 1, category: 'General / OBC / EWS', amount: '100' },
    { id: 2, category: 'SC / ST / PH', amount: '0' },
    { id: 3, category: 'All Category Female', amount: '0' }
  ]);

  const addFee = () => {
    setFees([...fees, { id: Date.now(), category: '', amount: '' }]);
  };

  const updateFee = (id: number, field: 'category' | 'amount', value: string) => {
    setFees(fees.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const removeFee = (id: number) => {
    setFees(fees.filter(f => f.id !== id));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="bg-green-50 border-b border-green-100 py-2.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-green-700" />
          <span className="text-xs font-bold text-green-900 uppercase tracking-wider">Application Fee</span>
        </div>
        <button onClick={addFee} className="text-[10px] font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded uppercase hover:bg-green-300">
          + Add Category
        </button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-3">
          {fees.map((fee) => (
            <div key={fee.id} className="flex items-center gap-3">
              <input 
                type="text" 
                placeholder="Category (e.g. Gen/OBC)" 
                value={fee.category}
                onChange={(e) => updateFee(fee.id, 'category', e.target.value)}
                className="flex-[2] border border-gray-200 rounded px-2 py-1.5 text-sm focus:border-green-500 outline-none" 
              />
              <div className="flex-[1] flex items-center border border-gray-200 rounded overflow-hidden focus-within:border-green-500">
                <span className="bg-gray-50 px-2 py-1.5 text-sm text-gray-500 font-bold border-r border-gray-200">₹</span>
                <input 
                  type="text" 
                  placeholder="Amount" 
                  value={fee.amount}
                  onChange={(e) => updateFee(fee.id, 'amount', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm outline-none" 
                />
              </div>
              <button onClick={() => removeFee(fee.id)} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
