import { useTrip } from '../hooks/useTrip';
import { useScores } from '../hooks/useScores';
import FoursomeDisplay from '../components/round/FoursomeDisplay';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { Link } from 'react-router-dom';

function isRoundComplete(round, scores) {
  const participants = round.foursomes.flatMap((f) => f.players);
  if (participants.length === 0) return false;
  return participants.every((golferId) => {
    const key = `${round.id}_${golferId}`;
    return scores[key]?.gross != null;
  });
}

export default function Schedule() {
  const { trip, loading: tripLoading } = useTrip();
  const { scores, loading: scoresLoading } = useScores(trip?.id);

  if (tripLoading || scoresLoading) return <Spinner />;
  if (!trip) return <p className="text-center text-gray-500 py-12">No active trip found.</p>;

  const sortedRounds = [...trip.rounds].sort((a, b) => a.order - b.order);

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-masters-green mb-4">Schedule</h2>
      <div className="space-y-6">
        {sortedRounds.map((round) => {
          const started = isRoundComplete(round, scores);

          return (
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
                {started && (
                  <span className="text-sm text-gray-400 font-body italic">Completed</span>
                )}
              </div>
              {started ? (
                <Link
                  to={`/rounds/${round.id}`}
                  className="inline-block px-4 py-2 text-sm font-medium font-body text-masters-green border border-masters-green rounded-lg hover:bg-masters-green hover:text-white transition-colors"
                >
                  View Results
                </Link>
              ) : (
                round.foursomes.length > 0 && (
                  <FoursomeDisplay foursomes={round.foursomes} golfers={trip.golfers} />
                )
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
