import { useTrip } from '../hooks/useTrip';
import FoursomeDisplay from '../components/round/FoursomeDisplay';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { Link } from 'react-router-dom';

export default function Schedule() {
  const { trip, loading } = useTrip();

  if (loading) return <Spinner />;
  if (!trip) return <p className="text-center text-gray-500 py-12">No active trip found.</p>;

  const sortedRounds = [...trip.rounds].sort((a, b) => a.order - b.order);

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-masters-green mb-4">Schedule</h2>
      <div className="space-y-6">
        {sortedRounds.map((round) => (
          <Card key={round.id} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <Link
                  to={`/rounds/${round.id}`}
                  className="font-heading text-lg font-semibold text-masters-green hover:text-masters-green-light transition-colors"
                >
                  Day {round.order}: {round.name}
                </Link>
                <p className="text-sm text-gray-500 font-body mt-0.5">
                  {new Date(round.date + 'T12:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {' '}&middot; Par {round.par}
                </p>
                {round.address && (
                  <p className="text-sm text-gray-400 font-body mt-0.5">
                    {round.address}
                  </p>
                )}
              </div>
              {!round.countsToTotal && (
                <Badge variant="exhibition">Exhibition</Badge>
              )}
            </div>
            {round.foursomes.length > 0 && (
              <FoursomeDisplay foursomes={round.foursomes} golfers={trip.golfers} />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
