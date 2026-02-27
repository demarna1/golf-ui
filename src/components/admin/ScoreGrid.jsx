import { useState } from 'react';
import { batchUpsertScores } from '../../firebase/scoreService';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

export default function ScoreGrid({ trip, scores }) {
  const user = useAuth();
  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const rounds = [...trip.rounds].sort((a, b) => a.order - b.order);

  function isParticipant(golferId, round) {
    return round.foursomes.flatMap((g) => g.players).includes(golferId);
  }

  function getCellValue(golferId, roundId) {
    const editKey = `${roundId}_${golferId}`;
    if (editKey in edits) return edits[editKey];
    const scoreData = scores[editKey];
    return scoreData?.gross ?? '';
  }

  function handleChange(golferId, roundId, value) {
    const editKey = `${roundId}_${golferId}`;
    setEdits((prev) => ({ ...prev, [editKey]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const updates = Object.entries(edits)
        .filter(([, val]) => val !== getCellValue)
        .map(([key, val]) => {
          const [courseId, golferId] = key.split('_');
          return {
            courseId,
            golferId,
            gross: val === '' ? null : Number(val),
          };
        });
      if (updates.length > 0) {
        await batchUpsertScores(trip.id, updates, user.uid);
      }
      setEdits({});
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const hasEdits = Object.keys(edits).length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-masters-green">Scores</h3>
        <div className="flex items-center gap-3">
          {error && <span className="text-red-600 text-sm">{error}</span>}
          {saving && <span className="text-gray-500 text-sm">Saving...</span>}
          <Button onClick={handleSave} disabled={!hasEdits || saving} size="sm">
            Save Changes
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="bg-masters-green text-white">
              <th className="px-3 py-2 text-left font-semibold sticky left-0 bg-masters-green">
                Player
              </th>
              {rounds.map((r) => (
                <th key={r.id} className="px-3 py-2 text-center font-semibold whitespace-nowrap">
                  <div>{r.shortName}</div>
                  <div className="text-xs font-normal text-white/60">Par {r.par}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trip.golfers.map((golfer) => (
              <tr key={golfer.id} className="border-b border-gray-100">
                <td className="px-3 py-1.5 font-medium whitespace-nowrap sticky left-0 bg-white">
                  {golfer.name}
                </td>
                {rounds.map((round) => {
                  const participating = isParticipant(golfer.id, round);
                  return (
                    <td key={round.id} className="px-1 py-1">
                      <input
                        type="number"
                        min="40"
                        max="150"
                        disabled={!participating}
                        value={getCellValue(golfer.id, round.id)}
                        onChange={(e) => handleChange(golfer.id, round.id, e.target.value)}
                        className={`w-16 mx-auto block text-center font-mono text-sm rounded border px-1 py-1
                          ${
                            participating
                              ? 'border-gray-300 focus:border-masters-green focus:ring-1 focus:ring-masters-green'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          }`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
