import { useState, useEffect } from 'react';
import { subscribeActiveTrip } from '../firebase/tripService';

export function useTrip() {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeActiveTrip((data) => {
      setTrip(data);
      setLoading(false);
    });
  }, []);

  return { trip, loading };
}
