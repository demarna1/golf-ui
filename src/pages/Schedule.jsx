import { useTrip } from '../hooks/useTrip';
import FoursomeDisplay from '../components/round/FoursomeDisplay';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { Link } from 'react-router-dom';

function isRoundStarted(round) {
  const firstTeeTime = round.firstTeeTime || round.foursomes?.[0]?.teeTime;
  if (!firstTeeTime || !round.date) return false;

  // Parse tee time like "9:11 AM"
  const match = firstTeeTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return false;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  const roundStart = new Date(`${round.date}T00:00:00`);
  roundStart.setHours(hours, minutes, 0, 0);

  const twoHoursAfter = new Date(roundStart.getTime() + 2 * 60 * 60 * 1000);
  return new Date() >= twoHoursAfter;
}

export default function Schedule() {
  const { trip, loading } = useTrip();

  if (loading) return <Spinner />;
  if (!trip) return <p className="text-center text-gray-500 py-12">No active trip found.</p>;

  const sortedRounds = [...trip.rounds].sort((a, b) => a.order - b.order);

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-masters-green mb-4">Schedule</h2>
      <div className="space-y-6">
        {sortedRounds.map((round) => {
          const started = isRoundStarted(round);

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
