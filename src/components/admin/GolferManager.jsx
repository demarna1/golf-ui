import { useState } from 'react';
import { updateGolfers } from '../../firebase/tripService';
import Button from '../ui/Button';

export default function GolferManager({ trip }) {
  const [golfers, setGolfers] = useState(trip.golfers);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [dirty, setDirty] = useState(false);

  function handleFieldChange(idx, field, value) {
    setGolfers((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: field === 'handicapIndex' ? Number(value) : value };
      return next;
    });
    setDirty(true);
  }

  function handleAdd() {
    const id = `golfer-${Date.now()}`;
    setGolfers((prev) => [...prev, { id, name: '', handicapIndex: 0 }]);
    setDirty(true);
  }

  function handleRemove(idx) {
    setGolfers((prev) => prev.filter((_, i) => i !== idx));
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await updateGolfers(trip.id, golfers);
      setDirty(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-masters-green">Golfers</h3>
        <div className="flex items-center gap-3">
          {error && <span className="text-red-600 text-sm">{error}</span>}
          <Button variant="ghost" onClick={handleAdd} size="sm">+ Add Golfer</Button>
          <Button onClick={handleSave} disabled={!dirty || saving} size="sm">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {golfers.map((golfer, idx) => (
          <div key={golfer.id} className="flex items-center gap-3 bg-white rounded border border-gray-200 px-3 py-2">
            <span className="text-xs text-gray-400 font-mono w-5">{idx + 1}</span>
            <input
              type="text"
              value={golfer.name}
              onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
              placeholder="Name"
              className="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-masters-green focus:ring-1 focus:ring-masters-green"
            />
            <input
              type="number"
              step="0.1"
              value={golfer.handicapIndex}
              onChange={(e) => handleFieldChange(idx, 'handicapIndex', e.target.value)}
              className="w-20 rounded border border-gray-300 px-2 py-1.5 text-sm font-mono text-center focus:border-masters-green focus:ring-1 focus:ring-masters-green"
            />
            <button
              onClick={() => handleRemove(idx)}
              className="text-red-400 hover:text-red-600 text-sm px-1"
              title="Remove golfer"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
