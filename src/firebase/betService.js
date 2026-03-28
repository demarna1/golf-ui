import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  getDocs,
  writeBatch,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './config';

export function subscribeBets(tripId, callback, onError) {
  const q = query(
    collection(db, 'bets'),
    where('tripId', '==', tripId)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const bets = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        bets[data.golferId] = data;
      });
      callback(bets);
    },
    (err) => {
      console.error('subscribeBets error:', err);
      if (onError) onError(err);
    }
  );
}

export async function resetBets(tripId) {
  const q = query(collection(db, 'bets'), where('tripId', '==', tripId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return;
  const batch = writeBatch(db);
  snapshot.forEach((docSnap) => batch.delete(docSnap.ref));
  return batch.commit();
}

export function placeBet(tripId, golferId, voterName, side) {
  const opposite = side === 'over' ? 'under' : 'over';
  const docId = `${tripId}_${golferId}`;
  return setDoc(
    doc(db, 'bets', docId),
    {
      tripId,
      golferId,
      votes: {
        [side]: arrayUnion(voterName),
        [opposite]: arrayRemove(voterName),
      },
    },
    { merge: true }
  );
}
