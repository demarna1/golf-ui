import { useState } from 'react';
import { createTrip, setActiveTripId } from '../../firebase/tripService';
import Button from '../ui/Button';

const EMPTY_ROUND = {
  name: '',
  shortName: '',
  date: '',
  par: 72,
  courseRating: 72.0,
  slopeRating: 113,
  countsToTotal: true,
  foursomes: [],
};

export default function NewTripForm() {
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    location: '',
    year: new Date().getFullYear() + 1,
    startDate: '',
    endDate: '',
  });
  const [golferNames, setGolferNames] = useState('');
  const [rounds, setRounds] = useState([{ ...EMPTY_ROUND }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleRoundChange(idx, field, value) {
    setRounds((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  }

  function addRound() {
    setRounds((prev) => [...prev, { ...EMPTY_ROUND }]);
  }

  function removeRound(idx) {
    setRounds((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const golfers = golferNames
        .split('\n')
        .map((n) => n.trim())
        .filter(Boolean)
        .map((name, i) => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          handicapIndex: 0,
        }));

      const tripRounds = rounds.map((r, i) => ({
        ...r,
        id: r.shortName.toLowerCase().replace(/\s+/g, '-') || `round-${i + 1}`,
        order: i + 1,
        par: Number(r.par),
        courseRating: Number(r.courseRating),
        slopeRating: Number(r.slopeRating),
      }));

      const tripId = `${form.year}-${form.location.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      const tripData = {
        ...form,
        year: Number(form.year),
        golfers,
        rounds: tripRounds,
      };

      await createTrip(tripId, tripData);
      await setActiveTripId(tripId);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-heading text-masters-green font-semibold">Trip created!</p>
        <p className="text-sm text-gray-500 mt-2">The new trip is now active.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <h3 className="font-heading text-lg font-semibold text-masters-green">New Trip</h3>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="text-sm sm:col-span-2">
          <span className="text-gray-500">Trip Name</span>
          <input type="text" required value={form.name} onChange={(e) => handleFormChange('name', e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-masters-green focus:ring-1 focus:ring-masters-green" />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="text-gray-500">Tagline</span>
          <input type="text" value={form.tagline} onChange={(e) => handleFormChange('tagline', e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-masters-green focus:ring-1 focus:ring-masters-green" />
        </label>
        <label className="text-sm">
          <span className="text-gray-500">Location</span>
          <input type="text" required value={form.location} onChange={(e) => handleFormChange('location', e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-masters-green focus:ring-1 focus:ring-masters-green" />
        </label>
        <label className="text-sm">
          <span className="text-gray-500">Year</span>
          <input type="number" required value={form.year} onChange={(e) => handleFormChange('year', e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono focus:border-masters-green focus:ring-1 focus:ring-masters-green" />
        </label>
        <label className="text-sm">
          <span className="text-gray-500">Start Date</span>
          <input type="date" value={form.startDate} onChange={(e) => handleFormChange('startDate', e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-masters-green focus:ring-1 focus:ring-masters-green" />
        </label>
        <label className="text-sm">
          <span className="text-gray-500">End Date</span>
          <input type="date" value={form.endDate} onChange={(e) => handleFormChange('endDate', e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-masters-green focus:ring-1 focus:ring-masters-green" />
        </label>
      </div>

      <label className="text-sm block">
        <span className="text-gray-500">Golfers (one name per line)</span>
        <textarea
          rows={6}
          value={golferNames}
          onChange={(e) => setGolferNames(e.target.value)}
          placeholder={"Ryan Jones\nMike Smith\n..."}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-masters-green focus:ring-1 focus:ring-masters-green"
        />
      </label>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700">Rounds</h4>
          <Button type="button" variant="ghost" size="sm" onClick={addRound}>+ Add Round</Button>
        </div>
        <div className="space-y-4">
          {rounds.map((round, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase">Round {idx + 1}</span>
                {rounds.length > 1 && (
                  <button type="button" onClick={() => removeRound(idx)} className="text-red-400 hover:text-red-600 text-sm">
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <label className="text-sm col-span-2 sm:col-span-3">
                  <span className="text-gray-500">Course Name</span>
                  <input type="text" value={round.name} onChange={(e) => handleRoundChange(idx, 'name', e.target.value)}
                    className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-masters-green focus:ring-1 focus:ring-masters-green" />
                </label>
                <label className="text-sm">
                  <span className="text-gray-500">Short Name</span>
                  <input type="text" value={round.shortName} onChange={(e) => handleRoundChange(idx, 'shortName', e.target.value)}
                    className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-masters-green focus:ring-1 focus:ring-masters-green" />
                </label>
                <label className="text-sm">
                  <span className="text-gray-500">Date</span>
                  <input type="date" value={round.date} onChange={(e) => handleRoundChange(idx, 'date', e.target.value)}
                    className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-masters-green focus:ring-1 focus:ring-masters-green" />
                </label>
                <label className="text-sm">
                  <span className="text-gray-500">Par</span>
                  <input type="number" value={round.par} onChange={(e) => handleRoundChange(idx, 'par', e.target.value)}
                    className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm font-mono focus:border-masters-green focus:ring-1 focus:ring-masters-green" />
                </label>
                <label className="text-sm">
                  <span className="text-gray-500">Course Rating</span>
                  <input type="number" step="0.1" value={round.courseRating} onChange={(e) => handleRoundChange(idx, 'courseRating', e.target.value)}
                    className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm font-mono focus:border-masters-green focus:ring-1 focus:ring-masters-green" />
                </label>
                <label className="text-sm">
                  <span className="text-gray-500">Slope Rating</span>
                  <input type="number" value={round.slopeRating} onChange={(e) => handleRoundChange(idx, 'slopeRating', e.target.value)}
                    className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm font-mono focus:border-masters-green focus:ring-1 focus:ring-masters-green" />
                </label>
                <label className="text-sm flex items-center gap-2 col-span-2 sm:col-span-3 mt-1">
                  <input type="checkbox" checked={round.countsToTotal} onChange={(e) => handleRoundChange(idx, 'countsToTotal', e.target.checked)}
                    className="rounded border-gray-300 text-masters-green focus:ring-masters-green" />
                  Counts to total
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={saving} size="lg" className="w-full sm:w-auto">
        {saving ? 'Creating...' : 'Create Trip & Set Active'}
      </Button>
    </form>
  );
}
