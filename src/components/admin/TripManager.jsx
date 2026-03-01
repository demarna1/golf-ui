import { useState, useEffect } from 'react';
import { listTrips, setActiveTripId, deleteTrip } from '../../firebase/tripService';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

export default function TripManager({ activeTrip }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const list = await listTrips();
      list.sort((a, b) => (b.year || 0) - (a.year || 0));
      setTrips(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSetActive(tripId) {
    setError(null);
    try {
      await setActiveTripId(tripId);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteTrip(confirmDelete.id);
      setConfirmDelete(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <h3 className="font-heading text-lg font-semibold text-masters-green mb-4">Manage Trips</h3>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading trips...</p>
      ) : trips.length === 0 ? (
        <p className="text-gray-500 text-sm">No trips found.</p>
      ) : (
        <div className="space-y-2">
          {trips.map((trip) => {
            const isActive = activeTrip?.id === trip.id;
            return (
              <div
                key={trip.id}
                className={`flex items-center justify-between rounded-lg border p-4
                  ${isActive ? 'border-gold bg-gold/5' : 'border-gray-200 bg-white'}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{trip.name || trip.id}</span>
                    {isActive && (
                      <span className="text-xs font-medium text-gold bg-gold/20 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {trip.location} &middot; {trip.year}
                    {trip.golfers && ` \u00b7 ${trip.golfers.length} golfers`}
                    {trip.rounds && ` \u00b7 ${trip.rounds.length} rounds`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!isActive && (
                    <Button size="sm" variant="secondary" onClick={() => handleSetActive(trip.id)}>
                      Set Active
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setConfirmDelete(trip)}
                    disabled={isActive}
                    title={isActive ? 'Cannot delete the active trip' : ''}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Trip"
      >
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete <strong>{confirmDelete?.name || confirmDelete?.id}</strong>?
          This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
