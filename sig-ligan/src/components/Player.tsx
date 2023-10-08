import { useState, useCallback } from "react";
import { getSortedPlayers } from "../dataHelpers";
import { PlayerRounds, ResultType, Tournament } from "../TournamentDataTypes";
import { ViewTypeParams } from "../ViewTypes";
import { BackButton } from "./BackButton";
import { Scorecard } from "./Scorecard";

export function Player({ data, params, gotoView }: ViewTypeParams) {
  if (!params || params.length === 0) {
    return <div>Missing params</div>;
  }
  const [activeTab, setActiveTab] = useState<ResultType>("net");
  const playerId = params[0];
  const player = findPlayerFromTournaments(data, playerId);
  const tournament = findAllTournamentsWherePlayerParticipated(data, playerId);
  if (!player) {
    return <div>Player not found</div>;
  }
  return (
    <div>
      <h1 className="title is-1">{player.name}</h1>
      <BackButton gotoView={gotoView} backView="ranking" />
      <div className="tabs">
        <ul>
          <li className={activeTab === "net" ? "is-active" : ""}>
            <a onClick={() => setActiveTab("net")}>Netto</a>
          </li>
          <li className={activeTab === "gross" ? "is-active" : ""}>
            <a onClick={() => setActiveTab("gross")}>Brutto</a>
          </li>
        </ul>
      </div>
      <ResultList
        playerId={playerId}
        tournaments={tournament}
        type={activeTab}
      />
    </div>
  );
}

function getRound(num: number, type: ResultType, playerRound: PlayerRounds) {
  if (!playerRound.rounds[num]) return <span></span>;
  return (
    (
      <>
        <span>{playerRound.rounds[num][type].toPar}&nbsp;&nbsp;</span>
        <span style={{ color: "#ff6666", fontSize: "80%" }}>
          {playerRound.rounds[num].activeHole === 19
            ? "F"
            : playerRound.rounds[num].activeHole}
        </span>
      </>
    ) || <span>0</span>
  );
}

function getTotalShots(type: ResultType, playerRounds: PlayerRounds) {
  let totalShots = playerRounds.rounds.reduce((acc, round) => {
    if (round && round.activeHole === 19) {
      return acc + round[type].total;
    }
    return acc;
  }, 0);
  const total = totalShots > 0 ? "(" + totalShots + ")" : "";
  return (
    <>
      <span>{playerRounds[type]}&nbsp;&nbsp;</span>
      <span style={{ color: "#ff6666", fontSize: "75%" }}>{total}</span>
    </>
  );
}

function ResultList({
  playerId,
  tournaments,
  type,
}: {
  playerId: string;
  tournaments: Tournament[];
  type: ResultType;
}) {
  const [selectedTournament, setSelectedTournament] = useState<
    string | undefined
  >();
  const list = tournaments.map((tournament) => ({
    ...tournament.playerRounds[playerId],
    tournament,
  }));

  const toggleVisibleRow = useCallback(
    (tournament: Tournament) => {
      if (tournament?.id === selectedTournament) {
        setSelectedTournament(undefined);
      } else {
        setSelectedTournament(tournament.id);
      }
    },
    [selectedTournament]
  );

  return (
    <table className="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>POS</th>
          <th>TÄVLING</th>
          <th>HCP</th>
          <th>RD1</th>
          <th>RD2</th>
          <th>RD3</th>
          <th>TOTAL</th>
          <th>POÄNG</th>
        </tr>
      </thead>
      <tbody>
        {list &&
          list.map((playerRound, index: number) => (
            <>
              <tr
                key={playerRound.tournament.id}
                onClick={() => toggleVisibleRow(playerRound.tournament)}
                className={
                  selectedTournament === playerRound.tournament.id
                    ? "is-selected"
                    : ""
                }
              >
                <td>
                  {
                    playerRound[
                      type === "gross" ? "grossPosition" : "netPosition"
                    ]
                  }
                </td>
                <td className="player">{playerRound.tournament.name}</td>
                <td>{playerRound.handicap}</td>
                <td>{getRound(0, type, playerRound)}</td>
                <td>{getRound(1, type, playerRound)}</td>
                <td>{getRound(2, type, playerRound)}</td>
                <td>{getTotalShots(type, playerRound)}</td>
                <td>
                  {playerRound[type === "gross" ? "grossPoints" : "netPoints"]}
                </td>
              </tr>
              {selectedTournament === playerRound.tournament.id && (
                <tr>
                  <td colSpan={7}>
                    <Scorecard
                      playerRounds={playerRound}
                      type={type}
                      tournament={playerRound.tournament}
                    />
                  </td>
                </tr>
              )}
            </>
          ))}
      </tbody>
    </table>
  );
}

function findAllTournamentsWherePlayerParticipated(
  data: Tournament[],
  playerId: string
) {
  const tournaments: Tournament[] = [];
  data.forEach((tournament) => {
    if (tournament.playerRounds[playerId]) {
      tournaments.push(tournament);
    }
  });
  return tournaments;
}

function findPlayerFromTournaments(data: Tournament[], playerId: string) {
  for (let i = 0; i < data.length; i++) {
    const tournament = data[i];
    if (tournament.playerRounds[playerId]) {
      return tournament.playerRounds[playerId];
    }
  }
  return null;
}
