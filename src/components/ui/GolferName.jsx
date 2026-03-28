import { useState, useRef, useEffect } from 'react';

export default function GolferName({ golfer, children }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!showTooltip) return;
    function handleClickOutside(e) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setShowTooltip(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTooltip]);

  const name = children ?? golfer.name;

  return (
    <span className="inline-flex items-center gap-1">
      {name}
      {golfer.injury && (
        <span className="relative" ref={tooltipRef}>
          <button
            type="button"
            onClick={() => setShowTooltip((v) => !v)}
            className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-100 text-red-600 text-[10px] font-bold leading-none cursor-pointer hover:bg-red-200 transition-colors"
            aria-label="Injury status: questionable"
          >
            Q
          </button>
          {showTooltip && (
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-50 w-48 rounded bg-gray-900 text-white text-xs px-2.5 py-1.5 shadow-lg font-body font-normal">
              {golfer.injury}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
