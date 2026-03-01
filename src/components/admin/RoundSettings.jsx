import { useState } from 'react';
import { updateRound } from '../../firebase/tripService';
import Button from '../ui/Button';

export default function RoundSettings({ trip }) {
  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function getVal(roundId, field) {
    const key = `${roundId}.${field}`;
    return key in edits ? edits[key] : trip.rounds.find((r) => r.id === roundId)?.[field];
  }

  function handleChange(roundId, field, value) {
    setEdits((prev) => ({ ...prev, [`${roundId}.${field}`]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const updatedRounds = trip.rounds.map((r) => ({
        ...r,
        par: Number(getVal(r.id, 'par')) || r.par,
        courseRating: Number(getVal(r.id, 'courseRating')) || r.courseRating,
        slopeRating: Number(getVal(r.id, 'slopeRating')) || r.slopeRating,
        countsToTotal: getVal(r.id, 'countsToTotal'),
        address: getVal(r.id, 'address') ?? r.address ?? '',
      }));
      await updateRound(trip.id, updatedRounds);
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
        <h3 className="font-heading text-lg font-semibold text-masters-green">Round Settings</h3>
        <div className="flex items-center gap-3">
          {error && <span className="text-red-600 text-sm">{error}</span>}
          <Button onClick={handleSave} disabled={!hasEdits || saving} size="sm">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {trip.rounds.map((round) => (
          <div key={round.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">{round.name}</h4>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={getVal(round.id, 'countsToTotal')}
                  onChange={(e) => handleChange(round.id, 'countsToTotal', e.target.checked)}
                  className="rounded border-gray-300 text-masters-green focus:ring-masters-green"
                />
                Counts to total
              </label>
            </div>
            <label className="text-sm block mb-3">
              <span className="text-gray-500">Address</span>
              <input
                type="text"
                value={getVal(round.id, 'address') ?? ''}
                onChange={(e) => handleChange(round.id, 'address', e.target.value)}
                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-masters-green focus:ring-1 focus:ring-masters-green"
              />
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="text-sm">
                <span className="text-gray-500">Par</span>
                <input
                  type="number"
                  value={getVal(round.id, 'par')}
                  onChange={(e) => handleChange(round.id, 'par', e.target.value)}
                  className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm font-mono focus:border-masters-green focus:ring-1 focus:ring-masters-green"
                />
              </label>
              <label className="text-sm">
                <span className="text-gray-500">Course Rating</span>
                <input
                  type="number"
                  step="0.1"
                  value={getVal(round.id, 'courseRating')}
                  onChange={(e) => handleChange(round.id, 'courseRating', e.target.value)}
                  className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm font-mono focus:border-masters-green focus:ring-1 focus:ring-masters-green"
                />
              </label>
              <label className="text-sm">
                <span className="text-gray-500">Slope Rating</span>
                <input
                  type="number"
                  value={getVal(round.id, 'slopeRating')}
                  onChange={(e) => handleChange(round.id, 'slopeRating', e.target.value)}
                  className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm font-mono focus:border-masters-green focus:ring-1 focus:ring-masters-green"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
