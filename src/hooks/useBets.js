import { useState, useEffect } from 'react';
import { subscribeBets } from '../firebase/betService';

export function useBets(tripId) {
  const [bets, setBets] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) return;
    setLoading(true);
    return subscribeBets(tripId, (data) => {
      setBets(data);
      setLoading(false);
    });
  }, [tripId]);

  return { bets, loading };
}
