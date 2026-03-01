import Card from '../ui/Card';

export default function FoursomeDisplay({ foursomes, golfers }) {
  const golferMap = {};
  golfers.forEach((g) => {
    golferMap[g.id] = g;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {foursomes.map((group, idx) => (
        <Card key={idx} className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-body">
              Group {idx + 1}
            </h4>
            {group.teeTime && (
              <span className="text-xs font-mono text-masters-green font-medium">
                {group.teeTime}
              </span>
            )}
          </div>
          <ul className="space-y-1">
            {group.players.map((golferId) => (
              <li key={golferId} className="text-sm font-body">
                {golferMap[golferId]?.name || golferId}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
