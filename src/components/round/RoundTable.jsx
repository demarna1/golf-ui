import { computeCourseHandicap } from '../../lib/leaderboard';

export default function RoundTable({ round, golfers, scores }) {
  const participants = round.foursomes.flat();

  const rows = golfers
    .filter((g) => participants.includes(g.id))
    .map((golfer) => {
      const key = `${round.id}_${golfer.id}`;
      const gross = scores[key]?.gross ?? null;
      const ch = computeCourseHandicap(
        golfer.handicapIndex,
        round.slopeRating,
        round.courseRating,
        round.par
      );
      const net = gross !== null ? gross - ch : null;

      return { golfer, gross, net, courseHandicap: ch };
    })
    .sort((a, b) => {
      if (a.gross === null && b.gross === null) return 0;
      if (a.gross === null) return 1;
      if (b.gross === null) return -1;
      return a.gross - b.gross;
    });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-body">
        <thead>
          <tr className="bg-masters-green text-white">
            <th className="px-3 py-2.5 text-left font-semibold">#</th>
            <th className="px-3 py-2.5 text-left font-semibold">Player</th>
            <th className="px-3 py-2.5 text-center font-semibold">Handicap</th>
            <th className="px-3 py-2.5 text-center font-semibold">Course HC</th>
            <th className="px-3 py-2.5 text-center font-semibold">Gross</th>
            <th className="px-3 py-2.5 text-center font-semibold">Net</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.golfer.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-3 py-2.5 text-gray-500 font-mono text-xs">
                {row.gross !== null ? idx + 1 : '—'}
              </td>
              <td className="px-3 py-2.5 font-medium whitespace-nowrap">
                {row.golfer.name}
              </td>
              <td className="px-3 py-2.5 text-center font-mono">
                {row.golfer.handicapIndex.toFixed(1)}
              </td>
              <td className="px-3 py-2.5 text-center font-mono">
                {row.courseHandicap}
              </td>
              <td className="px-3 py-2.5 text-center font-mono font-semibold">
                {row.gross ?? '—'}
              </td>
              <td className="px-3 py-2.5 text-center font-mono">
                {row.net ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
