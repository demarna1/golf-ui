import { useState, useEffect } from 'react';
import { subscribeScores } from '../firebase/scoreService';

export function useScores(tripId) {
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) return;
    setLoading(true);
    return subscribeScores(tripId, (data) => {
      setScores(data);
      setLoading(false);
    });
  }, [tripId]);

  return { scores, loading };
}
