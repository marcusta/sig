import { useCallback, useState } from "react";
import { getSortedPlayers } from "../dataHelpers";
import { Tournament, ResultType, PlayerRounds } from "../TournamentDataTypes";
import { ViewTypeParams } from "../ViewTypes";
import { BackButton } from "./BackButton";
import { Scorecard } from "./Scorecard";

function getRound(num: number, type: ResultType, playerRound: PlayerRounds) {
  if (playerRound.rounds[num] === undefined) return <span></span>;
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

function getNumberOfRounds(tournament: Tournament) {
  let maxRounds = 0;
  Object.values(tournament.playerRounds).forEach((playerRounds) => {
    if (playerRounds.rounds.length > maxRounds) {
      maxRounds = playerRounds.rounds.length;
    }
  });
  return maxRounds;
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

export function TournamentLeaderboard({
  data,
  gotoView,
  params,
}: ViewTypeParams) {
  const [activeTab, setActiveTab] = useState<ResultType>("net");
  if (!params) return <div>Invalid tournament</div>;
  const tournament = data.find((tournament) => tournament.id === params[0]);
  if (!tournament) return <div>Invalid tournament</div>;
  return (
    <>
      <h1 className="title is-1">{tournament.name}</h1>
      <BackButton gotoView={gotoView} />
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
      <ResultList tournament={tournament} type={activeTab} />
    </>
  );
}

function ResultList({
  tournament,
  type,
}: {
  tournament: Tournament;
  type: ResultType;
}) {
  const [selectedPlayer, setSelectedPlayer] = useState<
    PlayerRounds | undefined
  >();
  const list = getSortedPlayers(tournament, type);

  const toggleVisiblePlayer = useCallback(
    (player: PlayerRounds) => {
      if (selectedPlayer?.id === player.id) {
        setSelectedPlayer(undefined);
      } else {
        setSelectedPlayer(player);
      }
    },
    [selectedPlayer]
  );

  const numberOfRounds = getNumberOfRounds(tournament);

  return (
    <table className="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>POS</th>
          <th>SPELARE</th>
          <th>HCP</th>
          {numberOfRounds >= 1 && <th>RD1</th>}
          {numberOfRounds >= 2 && <th>RD2</th>}
          {numberOfRounds >= 3 && <th>RD3</th>}
          {numberOfRounds >= 4 && <th>RD4</th>}
          <th>TOTAL</th>
          <th>POÄNG</th>
        </tr>
      </thead>
      <tbody>
        {list &&
          list.map((playerRound, index: number) => (
            <>
              <tr
                key={playerRound.id}
                onClick={() => toggleVisiblePlayer(playerRound)}
                className={
                  selectedPlayer?.id === playerRound.id ? "is-selected" : ""
                }
              >
                <td>
                  {
                    playerRound[
                      type === "gross" ? "grossPosition" : "netPosition"
                    ]
                  }
                </td>
                <td className="player">{playerRound.name}</td>
                <td>{playerRound.handicap}</td>
                {numberOfRounds >= 1 && (
                  <td>{getRound(0, type, playerRound)}</td>
                )}
                {numberOfRounds >= 2 && (
                  <td>{getRound(1, type, playerRound)}</td>
                )}
                {numberOfRounds >= 3 && (
                  <td>{getRound(2, type, playerRound)}</td>
                )}
                {numberOfRounds >= 4 && (
                  <td>{getRound(3, type, playerRound)}</td>
                )}

                <td>{getTotalShots(type, playerRound)}</td>
                <td>
                  {playerRound[type === "gross" ? "grossPoints" : "netPoints"]}
                </td>
              </tr>
              {selectedPlayer && selectedPlayer.id === playerRound.id && (
                <tr>
                  <td colSpan={7}>
                    <Scorecard
                      playerRounds={playerRound}
                      type={type}
                      tournament={tournament}
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
