export function computeCourseHandicap(handicapIndex, slopeRating, courseRating, par) {
  return Math.round(handicapIndex * (slopeRating / 113) + (courseRating - par));
}

export function computeLeaderboard(trip, scores, viewMode = 'gross') {
  if (!trip || !trip.golfers || !trip.rounds) return [];

  const countingRounds = trip.rounds.filter((r) => r.countsToTotal);

  return trip.golfers
    .map((golfer) => {
      let total = null;
      let totalToPar = null;
      const roundScores = {};

      trip.rounds.forEach((round) => {
        const key = `${round.id}_${golfer.id}`;
        const scoreData = scores[key];
        const gross = scoreData?.gross ?? null;

        let displayScore = gross;
        let scoreToPar = null;

        if (gross !== null) {
          if (viewMode === 'net') {
            const ch = computeCourseHandicap(
              golfer.handicapIndex,
              round.slopeRating,
              round.courseRating,
              round.par
            );
            displayScore = gross - ch;
            scoreToPar = displayScore - round.par;
          } else {
            scoreToPar = gross - round.par;
          }
        }

        roundScores[round.id] = {
          gross,
          display: displayScore,
          toPar: scoreToPar,
        };

        if (round.countsToTotal && gross !== null) {
          const val = viewMode === 'net' ? displayScore : gross;
          if (total === null) {
            total = val;
            totalToPar = scoreToPar;
          } else {
            total += val;
            totalToPar += scoreToPar;
          }
        }
      });

      const hasAllCounting = countingRounds.every((r) => {
        const key = `${r.id}_${golfer.id}`;
        return scores[key]?.gross != null;
      });

      return {
        golfer,
        roundScores,
        total,
        totalToPar,
        hasAllCounting,
      };
    })
    .sort((a, b) => {
      if (a.total === null && b.total === null) return 0;
      if (a.total === null) return 1;
      if (b.total === null) return -1;
      return a.total - b.total;
    });
}

export function formatToPar(toPar) {
  if (toPar === null || toPar === undefined) return '—';
  if (toPar === 0) return 'E';
  return toPar > 0 ? `+${toPar}` : `${toPar}`;
}
