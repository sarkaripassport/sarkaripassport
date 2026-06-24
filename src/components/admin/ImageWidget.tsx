'use client';

import { Image as ImageIcon, Upload } from 'lucide-react';

export default function ImageWidget() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden w-full">
      <div className="bg-purple-50 border-b border-purple-100 py-2.5 px-4 flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-purple-700" />
        <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">Custom Image</span>
      </div>
      <div className="p-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 m-4 rounded-lg bg-gray-50 hover:bg-purple-50 hover:border-purple-300 transition-colors cursor-pointer">
        <Upload className="w-8 h-8 text-purple-400 mb-2" />
        <span className="text-sm font-semibold text-gray-600">Click to upload image</span>
        <span className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</span>
      </div>
    </div>
  );
}
