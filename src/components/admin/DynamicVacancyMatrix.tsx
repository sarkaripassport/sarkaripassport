'use client';

import { useState } from 'react';
import { Plus, Trash2, Settings, Table as TableIcon } from 'lucide-react';

export default function DynamicVacancyMatrix() {
  const [columns, setColumns] = useState(['Post Name', 'UR', 'OBC', 'SC', 'ST', 'Total', 'Eligibility']);
  const [rows, setRows] = useState<{id: number, data: Record<string, string>}[]>([
    { id: 1, data: { 'Post Name': '', 'UR': '', 'OBC': '', 'SC': '', 'ST': '', 'Total': '', 'Eligibility': '' } }
  ]);
  const [newColName, setNewColName] = useState('');

  const addColumn = () => {
    if (newColName && !columns.includes(newColName)) {
      setColumns([...columns, newColName]);
      const updatedRows = rows.map(row => ({
        ...row,
        data: { ...row.data, [newColName]: '' }
      }));
      setRows(updatedRows);
      setNewColName('');
    }
  };

  const removeColumn = (colToRemove: string) => {
    setColumns(columns.filter(col => col !== colToRemove));
    const updatedRows = rows.map(row => {
      const newData: Record<string, string> = { ...row.data };
      delete newData[colToRemove];
      return { ...row, data: newData };
    });
    setRows(updatedRows);
  };

  const addRow = () => {
    const newRowData: Record<string, string> = {};
    columns.forEach(col => newRowData[col] = '');
    setRows([...rows, { id: Date.now(), data: newRowData }]);
  };

  const updateCell = (rowId: number, colName: string, value: string) => {
    setRows(rows.map(row => {
      if (row.id === rowId) {
        return { ...row, data: { ...row.data, [colName]: value } };
      }
      return row;
    }));
  };

  const removeRow = (rowId: number) => {
    setRows(rows.filter(row => row.id !== rowId));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="bg-[#f0f0f1] border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#1d2327]">
          <TableIcon className="w-5 h-5 text-[#2271b1]" />
          <h3 className="font-bold text-[14px]">Dynamic Vacancy Matrix</h3>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="New Column Name" 
            value={newColName}
            onChange={(e) => setNewColName(e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded"
          />
          <button onClick={addColumn} className="bg-[#2271b1] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#135e96] flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Column
          </button>
        </div>
      </div>

      <div className="p-4 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="border border-gray-200 bg-gray-50 p-2 text-xs font-bold text-gray-700 relative group">
                  {col}
                  {columns.length > 2 && (
                    <button 
                      onClick={() => removeColumn(col)}
                      className="absolute right-1 top-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Column"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </th>
              ))}
              <th className="border border-gray-200 bg-gray-50 p-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((col, idx) => (
                  <td key={idx} className="border border-gray-200 p-0">
                    <input 
                      type="text" 
                      value={row.data[col] || ''}
                      onChange={(e) => updateCell(row.id, col, e.target.value)}
                      className="w-full p-2 outline-none focus:ring-2 focus:ring-[#2271b1] text-sm"
                      placeholder={`Enter ${col}`}
                    />
                  </td>
                ))}
                <td className="border border-gray-200 p-2 text-center">
                  <button onClick={() => removeRow(row.id)} className="text-red-500 hover:text-red-700 disabled:opacity-30" disabled={rows.length === 1}>
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-4 flex justify-center">
          <button 
            onClick={addRow}
            className="flex items-center gap-2 px-4 py-2 border border-dashed border-[#2271b1] text-[#2271b1] font-semibold text-sm rounded-lg hover:bg-blue-50 transition-colors w-full justify-center"
          >
            <Plus className="w-4 h-4" /> Add Row
          </button>
        </div>
      </div>

      <div className="bg-slate-900 text-green-400 p-3 text-[10px] font-mono border-t border-gray-200 max-h-32 overflow-y-auto">
        <div className="text-gray-400 mb-1 flex items-center gap-1"><Settings className="w-3 h-3" /> Live JSON Output (SEO Ready):</div>
        {JSON.stringify(rows.map(r => r.data), null, 2)}
      </div>
    </div>
  );
}
