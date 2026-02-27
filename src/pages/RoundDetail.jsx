import { useParams, Link } from 'react-router-dom';
import { useTrip } from '../hooks/useTrip';
import { useScores } from '../hooks/useScores';
import RoundTable from '../components/round/RoundTable';
import FoursomeDisplay from '../components/round/FoursomeDisplay';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

export default function RoundDetail() {
  const { courseId } = useParams();
  const { trip, loading: tripLoading } = useTrip();
  const { scores, loading: scoresLoading } = useScores(trip?.id);

  if (tripLoading || scoresLoading) return <Spinner />;
  if (!trip) return <p className="text-center text-gray-500 py-12">No active trip found.</p>;

  const round = trip.rounds.find((r) => r.id === courseId);
  if (!round) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Round not found.</p>
        <Link to="/schedule" className="text-masters-green hover:underline">Back to schedule</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/schedule" className="text-sm text-gray-500 hover:text-masters-green mb-3 inline-block">
        &larr; Schedule
      </Link>

      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-heading text-xl font-semibold text-masters-green">
            Day {round.order}: {round.name}
          </h2>
          <p className="text-sm text-gray-500 font-body mt-0.5">
            {new Date(round.date + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
            {' '}&middot; Par {round.par} &middot; Rating {round.courseRating} / Slope {round.slopeRating}
          </p>
        </div>
        {!round.countsToTotal && <Badge variant="exhibition">Exhibition</Badge>}
      </div>

      <Card className="mb-6">
        <RoundTable round={round} golfers={trip.golfers} scores={scores} />
      </Card>

      {round.foursomes.length > 0 && (
        <div>
          <h3 className="font-heading text-lg font-semibold text-masters-green mb-3">Foursomes</h3>
          <FoursomeDisplay foursomes={round.foursomes} golfers={trip.golfers} />
        </div>
      )}
    </div>
  );
}
