import { computeCourseHandicap } from './leaderboard';

const SEED_MATCHUPS = [
  [1, 16],
  [8, 9],
  [5, 12],
  [4, 13],
  [6, 11],
  [3, 14],
  [7, 10],
  [2, 15],
];

export function computeSeeds(golfers) {
  if (!golfers) return [];
  return [...golfers]
    .sort((a, b) => {
      if (a.handicapIndex !== b.handicapIndex) return a.handicapIndex - b.handicapIndex;
      return a.name.localeCompare(b.name);
    })
    .map((golfer, i) => ({ seed: i + 1, golfer }));
}

function getScore(golfer, round, scores, viewMode) {
  if (!golfer || !round) return null;
  const key = `${round.id}_${golfer.id}`;
  const gross = scores[key]?.gross ?? null;
  if (gross === null) return null;
  if (viewMode === 'net') {
    const ch = computeCourseHandicap(
      golfer.handicapIndex,
      round.slopeRating,
      round.courseRating,
      round.par
    );
    return gross - ch;
  }
  return gross;
}

function resolveMatchup(golferA, seedA, golferB, seedB, round, scores, viewMode, isLosersBracket) {
  const scoreA = getScore(golferA, round, scores, viewMode);
  const scoreB = getScore(golferB, round, scores, viewMode);

  const matchup = {
    golferA,
    seedA,
    golferB,
    seedB,
    scoreA,
    scoreB,
    winner: null,
    loser: null,
    tied: false,
  };

  if (scoreA === null || scoreB === null) return matchup;

  matchup.tied = scoreA === scoreB;

  if (isLosersBracket) {
    // Higher score advances; tiebreaker: higher seed (worse player) wins
    if (scoreA > scoreB) {
      matchup.winner = golferA;
      matchup.loser = golferB;
    } else if (scoreB > scoreA) {
      matchup.winner = golferB;
      matchup.loser = golferA;
    } else {
      // Tie — lower seed number (better player) wins in losers bracket
      matchup.winner = seedA < seedB ? golferA : golferB;
      matchup.loser = seedA < seedB ? golferB : golferA;
    }
  } else {
    // Lower score advances; tiebreaker: lower seed wins
    if (scoreA < scoreB) {
      matchup.winner = golferA;
      matchup.loser = golferB;
    } else if (scoreB < scoreA) {
      matchup.winner = golferB;
      matchup.loser = golferA;
    } else {
      // Tie — higher seed number (underdog) wins in winners bracket
      matchup.winner = seedA > seedB ? golferA : golferB;
      matchup.loser = seedA > seedB ? golferB : golferA;
    }
  }

  return matchup;
}

function findSeed(seeds, golfer) {
  if (!golfer) return null;
  const entry = seeds.find((s) => s.golfer.id === golfer.id);
  return entry ? entry.seed : null;
}

export function computeBracket(trip, scores, viewMode = 'gross') {
  if (!trip || !trip.golfers || !trip.rounds) {
    return { seeds: [], winnersRounds: [], losersRounds: [], champion: null, sethBowlWinner: null };
  }

  const seeds = computeSeeds(trip.golfers);
  if (seeds.length < 16) {
    return { seeds, winnersRounds: [], losersRounds: [], champion: null, sethBowlWinner: null };
  }

  const countingRounds = trip.rounds.filter((r) => r.countsToTotal).sort((a, b) => a.order - b.order);

  // Round of 16 (Day 1)
  const r16Round = countingRounds[0] || null;
  const r16Matchups = SEED_MATCHUPS.map(([seedA, seedB]) => {
    const a = seeds[seedA - 1];
    const b = seeds[seedB - 1];
    return resolveMatchup(a.golfer, a.seed, b.golfer, b.seed, r16Round, scores, viewMode, false);
  });

  // Winners QF (Day 2)
  const wqfRound = countingRounds[1] || null;
  const wqfMatchups = [];
  for (let i = 0; i < 8; i += 2) {
    const golferA = r16Matchups[i].winner;
    const golferB = r16Matchups[i + 1].winner;
    const seedA = findSeed(seeds, golferA);
    const seedB = findSeed(seeds, golferB);
    wqfMatchups.push(resolveMatchup(golferA, seedA, golferB, seedB, wqfRound, scores, viewMode, false));
  }

  // Winners SF (Day 3)
  const wsfRound = countingRounds[2] || null;
  const wsfMatchups = [];
  for (let i = 0; i < 4; i += 2) {
    const golferA = wqfMatchups[i].winner;
    const golferB = wqfMatchups[i + 1].winner;
    const seedA = findSeed(seeds, golferA);
    const seedB = findSeed(seeds, golferB);
    wsfMatchups.push(resolveMatchup(golferA, seedA, golferB, seedB, wsfRound, scores, viewMode, false));
  }

  // Winners Final (Day 4)
  const wfRound = countingRounds[3] || null;
  const wfGolferA = wsfMatchups[0]?.winner || null;
  const wfGolferB = wsfMatchups[1]?.winner || null;
  const wfSeedA = findSeed(seeds, wfGolferA);
  const wfSeedB = findSeed(seeds, wfGolferB);
  const wfMatchup = resolveMatchup(wfGolferA, wfSeedA, wfGolferB, wfSeedB, wfRound, scores, viewMode, false);

  // Losers QF (Day 2) — losers from R16, paired: L of match 1 vs L of match 4, L of match 2 vs L of match 3, etc.
  const lqfPairings = [
    [0, 3],
    [1, 2],
    [4, 7],
    [5, 6],
  ];
  const lqfMatchups = lqfPairings.map(([i, j]) => {
    const golferA = r16Matchups[i].loser;
    const golferB = r16Matchups[j].loser;
    const seedA = findSeed(seeds, golferA);
    const seedB = findSeed(seeds, golferB);
    return resolveMatchup(golferA, seedA, golferB, seedB, wqfRound, scores, viewMode, true);
  });

  // Losers SF (Day 3)
  const lsfMatchups = [];
  for (let i = 0; i < 4; i += 2) {
    const golferA = lqfMatchups[i].winner;
    const golferB = lqfMatchups[i + 1].winner;
    const seedA = findSeed(seeds, golferA);
    const seedB = findSeed(seeds, golferB);
    lsfMatchups.push(resolveMatchup(golferA, seedA, golferB, seedB, wsfRound, scores, viewMode, true));
  }

  // Seth Bowl (Day 4)
  const sbGolferA = lsfMatchups[0]?.winner || null;
  const sbGolferB = lsfMatchups[1]?.winner || null;
  const sbSeedA = findSeed(seeds, sbGolferA);
  const sbSeedB = findSeed(seeds, sbGolferB);
  const sbMatchup = resolveMatchup(sbGolferA, sbSeedA, sbGolferB, sbSeedB, wfRound, scores, viewMode, true);

  return {
    seeds,
    winnersRounds: [
      { name: 'Round of 16', golfRound: r16Round, matchups: r16Matchups },
      { name: 'Quarterfinals', golfRound: wqfRound, matchups: wqfMatchups },
      { name: 'Semifinals', golfRound: wsfRound, matchups: wsfMatchups },
      { name: 'Final', golfRound: wfRound, matchups: [wfMatchup] },
    ],
    losersRounds: [
      { name: 'Quarterfinals', golfRound: wqfRound, matchups: lqfMatchups },
      { name: 'Semifinals', golfRound: wsfRound, matchups: lsfMatchups },
      { name: 'Seth Bowl', golfRound: wfRound, matchups: [sbMatchup] },
    ],
    champion: wfMatchup.winner,
    sethBowlWinner: sbMatchup.winner,
  };
}
