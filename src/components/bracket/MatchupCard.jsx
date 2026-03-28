import GolferName from '../ui/GolferName';

function PlayerRow({ golfer, seed, score, isWinner, isLoser }) {
  if (!golfer) {
    return (
      <div className="px-3 py-1.5 flex justify-between items-center">
        <span className="text-sm italic text-gray-400 font-body">TBD</span>
        <span className="text-sm font-mono text-gray-400">—</span>
      </div>
    );
  }

  const lastName = golfer.name.split(' ').slice(-1)[0];

  return (
    <div
      className={`px-3 py-1.5 flex justify-between items-center gap-2
        ${isWinner ? 'border-l-3 border-gold font-semibold' : ''}
        ${isLoser ? 'text-gray-400' : ''}`}
    >
      <span className="text-sm font-body truncate">
        <span className="text-xs text-gray-500 mr-1">({seed})</span>
        <GolferName golfer={golfer}>
          {golfer.name.charAt(0)}. {lastName}
        </GolferName>
      </span>
      <span className="text-sm font-mono tabular-nums shrink-0">
        {score !== null ? score : '—'}
      </span>
    </div>
  );
}

export default function MatchupCard({ matchup, isChampion, isSethBowl }) {
  const { golferA, seedA, golferB, seedB, scoreA, scoreB, winner } = matchup;

  const isAWinner = winner && golferA && winner.id === golferA.id;
  const isBWinner = winner && golferB && winner.id === golferB.id;

  const highlightClass = (isChampion || isSethBowl) && winner
    ? 'ring-2 ring-gold'
    : '';

  return (
    <div className={`w-44 bg-white rounded border border-gray-200 overflow-hidden shadow-sm ${highlightClass}`}>
      <PlayerRow
        golfer={golferA}
        seed={seedA}
        score={scoreA}
        isWinner={isAWinner}
        isLoser={isBWinner && golferA}
      />
      <div className="border-t border-gray-200" />
      <PlayerRow
        golfer={golferB}
        seed={seedB}
        score={scoreB}
        isWinner={isBWinner}
        isLoser={isAWinner && golferB}
      />
    </div>
  );
}
