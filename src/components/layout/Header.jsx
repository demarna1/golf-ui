import { Link } from 'react-router-dom';
import { useTrip } from '../../hooks/useTrip';
import TripSelector from './TripSelector';

export default function Header() {
  const { trip, isViewingActiveTrip, setViewTripId } = useTrip();
  const logoSrc = trip?.year ? `/logos/${trip.year}.png` : null;

  return (
    <header className="bg-masters-green text-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="no-underline text-white flex items-center gap-3">
            {logoSrc && (
              <img
                src={logoSrc}
                alt={`${trip.name} logo`}
                className="h-12 w-auto object-contain rounded-lg"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
              {trip?.name || 'Golf Trip'}
            </h1>
          </Link>
          <TripSelector />
        </div>
      </div>
      {!isViewingActiveTrip && (
        <div className="bg-gold/10 border-t border-gold/20">
          <div className="max-w-5xl mx-auto px-4 py-1.5 flex items-center justify-between">
            <span className="text-xs font-body text-white/80">
              Viewing <strong>{trip?.name}</strong> ({trip?.year})
            </span>
            <button
              onClick={() => setViewTripId(null)}
              className="text-xs font-body font-medium text-gold hover:text-gold-light transition-colors underline underline-offset-2"
            >
              Back to current trip
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
