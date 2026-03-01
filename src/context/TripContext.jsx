import { createContext, useState, useEffect, useCallback } from 'react';
import { subscribeActiveTrip, subscribeTrip, listTrips } from '../firebase/tripService';

export const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [activeTrip, setActiveTrip] = useState(null);
  const [viewTrip, setViewTrip] = useState(null);
  const [viewTripId, setViewTripIdState] = useState(null);
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to the active trip
  useEffect(() => {
    return subscribeActiveTrip((data) => {
      setActiveTrip(data);
      setLoading(false);
    });
  }, []);

  // Subscribe to a specific viewed trip when viewTripId is set
  useEffect(() => {
    if (!viewTripId) {
      setViewTrip(null);
      return;
    }
    return subscribeTrip(viewTripId, (data) => {
      setViewTrip(data);
    });
  }, [viewTripId]);

  // Load all trips for the selector
  useEffect(() => {
    listTrips().then((trips) => {
      trips.sort((a, b) => (b.year || 0) - (a.year || 0));
      setAllTrips(trips);
    });
  }, [activeTrip?.id]);

  const setViewTripId = useCallback((id) => {
    if (!id || id === activeTrip?.id) {
      setViewTripIdState(null);
    } else {
      setViewTripIdState(id);
    }
  }, [activeTrip?.id]);

  const trip = viewTrip || activeTrip;
  const isViewingActiveTrip = !viewTripId;

  return (
    <TripContext.Provider value={{
      trip,
      activeTrip,
      loading,
      allTrips,
      viewTripId,
      setViewTripId,
      isViewingActiveTrip,
    }}>
      {children}
    </TripContext.Provider>
  );
}
