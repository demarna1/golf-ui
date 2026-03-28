import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './config';

export function subscribeBets(tripId, callback) {
  const q = query(
    collection(db, 'bets'),
    where('tripId', '==', tripId)
  );
  return onSnapshot(q, (snapshot) => {
    const bets = {};
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      bets[data.golferId] = data;
    });
    callback(bets);
  });
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
