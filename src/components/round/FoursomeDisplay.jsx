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
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 font-body">
            Group {idx + 1}
          </h4>
          <ul className="space-y-1">
            {group.map((golferId) => (
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
