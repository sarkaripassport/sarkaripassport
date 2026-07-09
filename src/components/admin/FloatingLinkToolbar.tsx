"use client";

import { useState, useEffect } from 'react';
import { Link as LinkIcon, Unlink, Check, X } from 'lucide-react';
import { useTextSelection } from '@/hooks/useTextSelection';

export default function FloatingLinkToolbar() {
  const { selection, setSelection } = useTextSelection();
  const [showInput, setShowInput] = useState(false);
  const [url, setUrl] = useState('');

  // Reset state when selection changes
  useEffect(() => {
    if (!selection) {
      setShowInput(false);
      setUrl('');
    }
  }, [selection]);

  if (!selection) return null;

  const { text, x, y, element, start, end } = selection;

  // Check if the selected text is already an HTML link
  // e.g. <a href="...">word</a>
  const isLinked = text.trim().startsWith('<a ') && text.trim().endsWith('</a>');

  const handleApplyLink = () => {
    if (!url || !element) return;
    
    // Inject the raw HTML link
    const newText = `<a href="${url}" target="_blank" class="text-blue-600 underline font-semibold">${text}</a>`;
    
    element.setRangeText(newText, start, end, 'end');
    // Dispatch an input event so React's onChange picks it up
    element.dispatchEvent(new Event('input', { bubbles: true }));
    
    setSelection(null);
  };

  const handleUnlink = () => {
    if (!element) return;
    
    // Attempt to extract the text inside the <a> tag
    const match = text.match(/<a[^>]*>(.*?)<\/a>/i);
    const plainText = match ? match[1] : text;
    
    element.setRangeText(plainText, start, end, 'end');
    element.dispatchEvent(new Event('input', { bubbles: true }));
    
    setSelection(null);
  };

  return (
    <div 
      id="hyperlink-widget"
      className="fixed z-[9999] bg-white rounded-lg shadow-xl border border-gray-200 flex items-center p-1.5 gap-1 animate-in fade-in zoom-in-95 duration-100"
      style={{
        left: Math.max(10, x - 50),
        top: Math.max(10, y),
      }}
    >
      {!showInput ? (
        <>
          {isLinked ? (
            <button 
              onClick={handleUnlink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md font-bold text-sm transition-colors"
              title="Remove Hyperlink"
            >
              <Unlink className="w-4 h-4" /> Unlink
            </button>
          ) : (
            <button 
              onClick={() => setShowInput(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-blue-50 text-blue-600 rounded-md font-bold text-sm transition-colors"
              title="Add Hyperlink"
            >
              <LinkIcon className="w-4 h-4" /> Link
            </button>
          )}
        </>
      ) : (
        <div className="flex items-center gap-2 px-1">
          <input 
            type="url"
            autoFocus
            placeholder="https://"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApplyLink();
              if (e.key === 'Escape') setShowInput(false);
            }}
            className="w-48 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <button onClick={handleApplyLink} className="p-1 text-green-600 hover:bg-green-50 rounded">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={() => setShowInput(false)} className="p-1 text-gray-500 hover:bg-gray-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
