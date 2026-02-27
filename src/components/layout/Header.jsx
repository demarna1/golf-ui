import { Link } from 'react-router-dom';
import { useTrip } from '../../hooks/useTrip';

export default function Header() {
  const { trip } = useTrip();

  return (
    <header className="bg-masters-green text-white">
      <div className="max-w-5xl mx-auto px-4 py-6 text-center">
        <Link to="/" className="no-underline text-white">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
            {trip?.name || 'Golf Trip'}
          </h1>
          {trip?.tagline && (
            <p className="mt-1 text-gold font-body text-sm italic">
              {trip.tagline}
            </p>
          )}
        </Link>
      </div>
    </header>
  );
}
