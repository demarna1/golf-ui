import Card from '../ui/Card';

const RULES = [
  {
    title: 'Play the Ball As It Lies',
    description:
      'Play the ball as it lies. Exceptions: tree roots and rocks — you may take relief.',
  },
  {
    title: 'Out of Bounds',
    description:
      'Advance and drop for out of bounds instead of re-teeing, for pace of play.',
  },
  {
    title: 'Breakfast Ball',
    description:
      "Optional breakfast ball on the first tee, but don't abuse it. Should be a lost ball or a genuinely bad shot.",
  },
  {
    title: 'Shotgun Mulligans',
    description:
      'Shotgun mulligans are allowed for all shots except putts. Unlimited.',
  },
];

export default function BonusRules() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 font-body">
        House rules for the trip. Play fair, keep pace, and have fun.
      </p>
      {RULES.map((rule) => (
        <Card key={rule.title} className="p-4">
          <h3 className="font-heading text-base font-semibold text-masters-green mb-1">
            {rule.title}
          </h3>
          <p className="text-sm text-gray-600 font-body">{rule.description}</p>
        </Card>
      ))}
    </div>
  );
}
