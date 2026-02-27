import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

export function subscribeScores(tripId, callback) {
  const q = query(
    collection(db, 'scores'),
    where('tripId', '==', tripId)
  );
  return onSnapshot(q, (snapshot) => {
    const scores = {};
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const key = `${data.courseId}_${data.golferId}`;
      scores[key] = data;
    });
    callback(scores);
  });
}

export function batchUpsertScores(tripId, updates, userId) {
  const batch = writeBatch(db);
  updates.forEach(({ courseId, golferId, gross }) => {
    const docId = `${tripId}_${courseId}_${golferId}`;
    const ref = doc(db, 'scores', docId);
    batch.set(ref, {
      tripId,
      courseId,
      golferId,
      gross,
      updatedAt: serverTimestamp(),
      updatedBy: userId,
    });
  });
  return batch.commit();
}
