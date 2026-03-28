import { useState } from 'react';
import { useTrip } from '../../hooks/useTrip';
import { useBets } from '../../hooks/useBets';
import { placeBet } from '../../firebase/betService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

const LS_KEY = 'bets_voter_name';

function SplitBar({ overVoters, underVoters }) {
  const overCount = overVoters.length;
  const underCount = underVoters.length;
  const total = overCount + underCount;

  const overPct = total > 0 ? (overCount / total) * 100 : 50;
  const underPct = total > 0 ? (underCount / total) * 100 : 50;

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs font-mono font-medium mb-1">
        <span className="text-red-600">Over ({overCount})</span>
        <span className="text-masters-green">Under ({underCount})</span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
        {total > 0 ? (
          <>
            <div
              className="bg-red-500 transition-all duration-300"
              style={{ width: `${overPct}%` }}
            />
            <div
              className="bg-masters-green transition-all duration-300"
              style={{ width: `${underPct}%` }}
            />
          </>
        ) : (
          <div className="w-full bg-gray-200" />
        )}
      </div>
      <div className="flex justify-between mt-1">
        <p className="text-xs text-gray-400 truncate max-w-[45%]">
          {overVoters.join(', ') || '\u00A0'}
        </p>
        <p className="text-xs text-gray-400 truncate max-w-[45%] text-right">
          {underVoters.join(', ') || '\u00A0'}
        </p>
      </div>
    </div>
  );
}

function NamePicker({ golfers, onSelect }) {
  const [selected, setSelected] = useState('');

  return (
    <Card className="p-6 text-center">
      <h3 className="font-heading text-lg font-semibold text-masters-green mb-2">
        Who are you?
      </h3>
      <p className="text-sm text-gray-500 font-body mb-4">
        Select your name to view and place bets.
      </p>
      <div className="flex items-center justify-center gap-3">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm font-body focus:border-masters-green focus:ring-1 focus:ring-masters-green"
        >
          <option value="">Select your name...</option>
          {golfers.map((g) => (
            <option key={g.id} value={g.name}>
              {g.name}
            </option>
          ))}
        </select>
        <Button size="sm" disabled={!selected} onClick={() => onSelect(selected)}>
          Confirm
        </Button>
      </div>
    </Card>
  );
}

function BetCard({ golfer, bet, voterName }) {
  const overVoters = bet?.votes?.over || [];
  const underVoters = bet?.votes?.under || [];
  const myPick = overVoters.includes(voterName)
    ? 'over'
    : underVoters.includes(voterName)
      ? 'under'
      : null;

  function handlePick(side) {
    placeBet(golfer.tripId, golfer.id, voterName, side);
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-semibold text-masters-green">
            {golfer.name}
          </h3>
          <p className="text-sm text-gray-500 font-mono">
            O/U {golfer.overUnderLine}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={myPick === 'over' ? 'danger' : 'ghost'}
            onClick={() => handlePick('over')}
          >
            Over
          </Button>
          <Button
            size="sm"
            variant={myPick === 'under' ? 'primary' : 'ghost'}
            onClick={() => handlePick('under')}
          >
            Under
          </Button>
        </div>
      </div>
      <SplitBar overVoters={overVoters} underVoters={underVoters} />
    </Card>
  );
}

export default function BetsList() {
  const { trip, loading: tripLoading } = useTrip();
  const { bets, loading: betsLoading } = useBets(trip?.id);
  const [voterName, setVoterName] = useState(() => localStorage.getItem(LS_KEY) || '');

  if (tripLoading || betsLoading) return <Spinner />;

  function handleSelectName(name) {
    localStorage.setItem(LS_KEY, name);
    setVoterName(name);
  }

  function handleChangeName() {
    localStorage.removeItem(LS_KEY);
    setVoterName('');
  }

  if (!voterName) {
    return <NamePicker golfers={trip.golfers} onSelect={handleSelectName} />;
  }

  const golfersWithLines = trip.golfers.filter((g) => g.overUnderLine);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-body">
          Betting as <span className="font-semibold text-masters-green">{voterName}</span>
        </p>
        <button
          onClick={handleChangeName}
          className="text-xs text-gray-400 hover:text-gray-600 underline font-body"
        >
          Change
        </button>
      </div>

      {golfersWithLines.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-sm text-gray-500 font-body">No lines have been set yet.</p>
        </Card>
      ) : (
        golfersWithLines.map((golfer) => (
          <BetCard
            key={golfer.id}
            golfer={{ ...golfer, tripId: trip.id }}
            bet={bets[golfer.id]}
            voterName={voterName}
          />
        ))
      )}
    </div>
  );
}
