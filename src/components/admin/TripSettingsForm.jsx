import { useState } from 'react';
import { updateTripSettings } from '../../firebase/tripService';
import Button from '../ui/Button';

export default function TripSettingsForm({ trip }) {
  const [form, setForm] = useState({
    name: trip.name || '',
    location: trip.location || '',
    year: trip.year || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [dirty, setDirty] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await updateTripSettings(trip.id, {
        name: form.name,
        location: form.location,
        year: Number(form.year),
      });
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
        <h3 className="font-heading text-lg font-semibold text-masters-green">Trip Settings</h3>
        <div className="flex items-center gap-3">
          {error && <span className="text-red-600 text-sm">{error}</span>}
          <Button onClick={handleSave} disabled={!dirty || saving} size="sm">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        <label className="text-sm sm:col-span-2">
          <span className="text-gray-500">Trip Name</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-masters-green focus:ring-1 focus:ring-masters-green"
          />
        </label>
        <label className="text-sm">
          <span className="text-gray-500">Location</span>
          <input
            type="text"
            value={form.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-masters-green focus:ring-1 focus:ring-masters-green"
          />
        </label>
        <label className="text-sm">
          <span className="text-gray-500">Year</span>
          <input
            type="number"
            value={form.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono focus:border-masters-green focus:ring-1 focus:ring-masters-green"
          />
        </label>
      </div>
    </div>
  );
}
