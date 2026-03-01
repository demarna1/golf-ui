import { useState, useRef, useEffect } from 'react';
import { useTrip } from '../../hooks/useTrip';

export default function TripSelector() {
  const { trip, activeTrip, allTrips, setViewTripId } = useTrip();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (allTrips.length <= 1) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-body font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
      >
        <span>{trip?.year}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 z-50">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            All Trips
          </div>
          {allTrips.map((t) => {
            const isViewing = t.id === trip?.id;
            const isCurrent = t.id === activeTrip?.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setViewTripId(t.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm font-body transition-colors flex items-center justify-between
                  ${isViewing ? 'bg-masters-green/5 text-masters-green' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <div>
                  <span className="font-medium">{t.name || t.id}</span>
                  <span className="text-xs text-gray-400 ml-1.5">{t.year}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isCurrent && (
                    <span className="text-[10px] font-medium text-gold bg-gold/15 px-1.5 py-0.5 rounded">
                      Current
                    </span>
                  )}
                  {isViewing && (
                    <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
