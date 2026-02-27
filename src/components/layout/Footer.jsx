import { Link } from 'react-router-dom';
import { useTrip } from '../../hooks/useTrip';

export default function Footer() {
  const { trip } = useTrip();

  return (
    <footer className="bg-masters-green text-white/60 text-xs font-body mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <span>
          {trip?.location} &middot; {trip?.year}
        </span>
        <Link to="/admin/login" className="text-white/40 hover:text-white/60 transition-colors">
          Admin
        </Link>
      </div>
    </footer>
  );
}
