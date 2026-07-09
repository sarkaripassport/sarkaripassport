import { useState, useEffect, useRef } from 'react';

export interface SelectionData {
  text: string;
  x: number;
  y: number;
  element: HTMLInputElement | HTMLTextAreaElement | null;
  start: number;
  end: number;
}

export function useTextSelection() {
  const [selection, setSelection] = useState<SelectionData | null>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleSelectionCheck = () => {
      // Small delay to let DOM and React state settle
      setTimeout(() => {
        const activeEl = document.activeElement;
        
        // Prevent clearing if clicking inside the widget itself
        if (activeEl?.closest('#hyperlink-widget') != null) {
          return;
        }

        if (activeEl && (activeEl.tagName === 'TEXTAREA' || (activeEl.tagName === 'INPUT' && (activeEl as HTMLInputElement).type === 'text'))) {
          const input = activeEl as HTMLInputElement | HTMLTextAreaElement;
          const start = input.selectionStart || 0;
          const end = input.selectionEnd || 0;
          
          if (start !== end && end > start) {
            const text = input.value.substring(start, end);
            setSelection({
              text,
              x: lastMousePos.current.x,
              y: lastMousePos.current.y - 50, // Offset above cursor
              element: input,
              start,
              end
            });
          } else {
            setSelection(null);
          }
        } else {
          setSelection(null);
        }
      }, 50);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleSelectionCheck);
    document.addEventListener('keyup', handleSelectionCheck);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleSelectionCheck);
      document.removeEventListener('keyup', handleSelectionCheck);
    };
  }, []);

  return { selection, setSelection };
}
