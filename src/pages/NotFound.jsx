import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="font-heading text-4xl font-bold text-masters-green mb-2">404</h2>
      <p className="text-gray-500 mb-6">Page not found.</p>
      <Link
        to="/"
        className="text-masters-green font-medium hover:underline"
      >
        Back to leaderboard
      </Link>
    </div>
  );
}
