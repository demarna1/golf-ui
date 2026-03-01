import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTrip } from '../hooks/useTrip';
import { useScores } from '../hooks/useScores';
import { computeLeaderboard } from '../lib/leaderboard';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';

export default function Leaderboard() {
  const { trip, loading: tripLoading } = useTrip();
  const { scores, loading: scoresLoading } = useScores(trip?.id);
  const [searchParams, setSearchParams] = useSearchParams();

  const viewMode = searchParams.get('view') || 'gross';

  const standings = useMemo(
    () => computeLeaderboard(trip, scores, viewMode),
    [trip, scores, viewMode]
  );

  if (tripLoading || scoresLoading) return <Spinner />;
  if (!trip) return <p className="text-center text-gray-500 py-12">No active trip found.</p>;

  function toggleView(mode) {
    setSearchParams(mode === 'gross' ? {} : { view: mode });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-semibold text-masters-green">Leaderboard</h2>
        <div className="flex rounded-lg overflow-hidden border border-gray-300">
          <button
            onClick={() => toggleView('gross')}
            className={`px-3 py-1.5 text-sm font-medium font-body transition-colors
              ${viewMode === 'gross' ? 'bg-masters-green text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            True
          </button>
          <button
            onClick={() => toggleView('net')}
            className={`px-3 py-1.5 text-sm font-medium font-body transition-colors border-l border-gray-300
              ${viewMode === 'net' ? 'bg-masters-green text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            HDCP
          </button>
        </div>
      </div>

      <Card>
        <LeaderboardTable
          standings={standings}
          rounds={trip.rounds}
          viewMode={viewMode}
        />
      </Card>
    </div>
  );
}
