import { useState } from 'react';
import { updateRound } from '../../firebase/tripService';
import Button from '../ui/Button';

export default function FoursomeEditor({ trip }) {
  const [selectedRoundId, setSelectedRoundId] = useState(trip.rounds[0]?.id);
  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const round = trip.rounds.find((r) => r.id === selectedRoundId);
  const foursomes = edits[selectedRoundId] || round?.foursomes || [];

  function handleSwap(groupIdx, slotIdx, newGolferId) {
    const current = foursomes.map((g) => ({ players: [...g.players] }));
    const oldGolferId = current[groupIdx].players[slotIdx];

    // Find where the new golfer currently is and swap
    for (let gi = 0; gi < current.length; gi++) {
      for (let si = 0; si < current[gi].players.length; si++) {
        if (current[gi].players[si] === newGolferId) {
          current[gi].players[si] = oldGolferId;
        }
      }
    }
    current[groupIdx].players[slotIdx] = newGolferId;

    setEdits((prev) => ({ ...prev, [selectedRoundId]: current }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const updatedRounds = trip.rounds.map((r) =>
        edits[r.id] ? { ...r, foursomes: edits[r.id] } : r
      );
      await updateRound(trip.id, updatedRounds);
      setEdits({});
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const hasEdits = Object.keys(edits).length > 0;
  const allGolferIds = trip.golfers.map((g) => g.id);
  const golferMap = {};
  trip.golfers.forEach((g) => { golferMap[g.id] = g; });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-masters-green">Foursomes</h3>
        <div className="flex items-center gap-3">
          {error && <span className="text-red-600 text-sm">{error}</span>}
          <Button onClick={handleSave} disabled={!hasEdits || saving} size="sm">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {trip.rounds.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRoundId(r.id)}
            className={`px-3 py-1.5 text-sm rounded font-body whitespace-nowrap transition-colors
              ${selectedRoundId === r.id
                ? 'bg-masters-green text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {r.shortName}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {foursomes.map((group, groupIdx) => (
          <div key={groupIdx} className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Group {groupIdx + 1}
            </h4>
            <div className="space-y-2">
              {group.players.map((golferId, slotIdx) => (
                <select
                  key={slotIdx}
                  value={golferId}
                  onChange={(e) => handleSwap(groupIdx, slotIdx, e.target.value)}
                  className="block w-full rounded border border-gray-300 px-2 py-1.5 text-sm font-body focus:border-masters-green focus:ring-1 focus:ring-masters-green"
                >
                  {allGolferIds.map((id) => (
                    <option key={id} value={id}>
                      {golferMap[id]?.name || id}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
