import {
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from './config';

export function subscribeActiveTrip(callback) {
  const configRef = doc(db, 'config', 'activeTripId');
  let tripUnsub = null;

  const configUnsub = onSnapshot(configRef, (configSnap) => {
    if (tripUnsub) tripUnsub();

    if (!configSnap.exists()) {
      callback(null);
      return;
    }

    const { tripId } = configSnap.data();
    const tripRef = doc(db, 'trips', tripId);
    tripUnsub = onSnapshot(tripRef, (tripSnap) => {
      if (!tripSnap.exists()) {
        callback(null);
        return;
      }
      callback({ id: tripSnap.id, ...tripSnap.data() });
    });
  });

  return () => {
    configUnsub();
    if (tripUnsub) tripUnsub();
  };
}

export function updateRound(tripId, rounds) {
  return updateDoc(doc(db, 'trips', tripId), { rounds });
}

export function updateGolfers(tripId, golfers) {
  return updateDoc(doc(db, 'trips', tripId), { golfers });
}

export function updateTripSettings(tripId, settings) {
  return updateDoc(doc(db, 'trips', tripId), settings);
}

export function createTrip(tripId, tripData) {
  return setDoc(doc(db, 'trips', tripId), tripData);
}

export function setActiveTripId(tripId) {
  return setDoc(doc(db, 'config', 'activeTripId'), { tripId });
}
