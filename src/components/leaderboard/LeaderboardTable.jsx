import { formatToPar } from '../../lib/leaderboard';

export default function LeaderboardTable({ standings, rounds, viewMode }) {
  const countingRounds = rounds.filter((r) => r.countsToTotal);
  const exhibitionRounds = rounds.filter((r) => !r.countsToTotal);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-body">
        <thead>
          <tr className="bg-masters-green text-white">
            <th className="px-3 py-2.5 text-left font-semibold w-8">#</th>
            <th className="px-3 py-2.5 text-left font-semibold">Player</th>
            {countingRounds.map((r) => (
              <th key={r.id} className="px-3 py-2.5 text-center font-semibold whitespace-nowrap">
                {r.shortName}
              </th>
            ))}
            <th className="px-3 py-2.5 text-center font-semibold bg-gold text-masters-green">
              Total
            </th>
            {exhibitionRounds.map((r) => (
              <th
                key={r.id}
                className="px-3 py-2.5 text-center font-semibold text-white/50 whitespace-nowrap"
              >
                {r.shortName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {standings.map((row, idx) => {
            const pos = idx + 1;
            const isLeader = idx === 0 && row.total !== null;

            return (
              <tr
                key={row.golfer.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors
                  ${isLeader ? 'border-l-4 border-l-gold bg-gold/5' : ''}`}
              >
                <td className="px-3 py-2.5 text-gray-500 font-mono text-xs">
                  {row.total !== null ? pos : '—'}
                </td>
                <td className="px-3 py-2.5 font-medium whitespace-nowrap">
                  {row.golfer.name}
                </td>
                {countingRounds.map((r) => {
                  const s = row.roundScores[r.id];
                  return (
                    <td key={r.id} className="px-3 py-2.5 text-center font-mono">
                      {s?.display ?? '—'}
                    </td>
                  );
                })}
                <td className="px-3 py-2.5 text-center font-mono font-semibold bg-gold/10">
                  {row.total !== null ? (
                    <>
                      {row.total}{' '}
                      <span className="text-xs text-gray-500">
                        ({formatToPar(row.totalToPar)})
                      </span>
                    </>
                  ) : (
                    '—'
                  )}
                </td>
                {exhibitionRounds.map((r) => {
                  const s = row.roundScores[r.id];
                  return (
                    <td
                      key={r.id}
                      className="px-3 py-2.5 text-center font-mono text-gray-400"
                    >
                      {s?.display ?? '—'}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
