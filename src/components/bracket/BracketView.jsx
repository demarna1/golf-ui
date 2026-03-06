import MatchupCard from './MatchupCard';

function RoundColumn({ round, isFirstRound, isLastRound, isChampion, isSethBowl }) {
  return (
    <div className="flex flex-col shrink-0">
      <div className="text-xs font-body text-gray-500 mb-1 text-center truncate px-1">
        {round.golfRound?.shortName || ''}
      </div>
      <div className={`flex flex-col flex-1 ${isFirstRound ? 'gap-2 justify-center' : 'justify-around'}`}>
        {round.matchups.map((matchup, i) => (
          <MatchupCard
            key={i}
            matchup={matchup}
            isChampion={isLastRound && isChampion}
            isSethBowl={isLastRound && isSethBowl}
          />
        ))}
      </div>
    </div>
  );
}

function BracketSection({ title, rounds, isChampion, isSethBowl, titleColor }) {
  return (
    <div>
      <h3 className={`font-heading text-sm font-semibold mb-3 ${titleColor}`}>
        {title}
      </h3>
      <div className="flex items-stretch gap-2">
        {rounds.map((round, i) => (
          <RoundColumn
            key={i}
            round={round}
            isFirstRound={i === 0}
            isLastRound={i === rounds.length - 1}
            isChampion={isChampion}
            isSethBowl={isSethBowl}
          />
        ))}
      </div>
    </div>
  );
}

export default function BracketView({ bracket }) {
  const { winnersRounds, losersRounds, champion, sethBowlWinner } = bracket;

  if (!winnersRounds.length) {
    return (
      <p className="text-center text-gray-500 py-8 font-body">
        Bracket requires 16 players.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[800px]">
        <BracketSection
          title="Winners Bracket"
          rounds={winnersRounds}
          isChampion
          titleColor="text-masters-green"
        />

        {champion && (
          <div className="my-4 px-2">
            <span className="text-sm font-heading font-semibold text-gold">
              Champion: {champion.name}
            </span>
          </div>
        )}

        <div className="border-t border-dashed border-gray-300 my-6" />

        <BracketSection
          title="Losers Bracket (Seth Bowl)"
          rounds={losersRounds}
          isSethBowl
          titleColor="text-red-700"
        />

        {sethBowlWinner && (
          <div className="mt-4 px-2">
            <span className="text-sm font-heading font-semibold text-red-700">
              Seth Bowl Winner: {sethBowlWinner.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
