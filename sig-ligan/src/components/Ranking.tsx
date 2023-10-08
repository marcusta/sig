import { useState } from "react";
import { ResultType, Tournament } from "../TournamentDataTypes";
import { ViewTypeParams } from "../ViewTypes";
import { BackButton } from "./BackButton";

type PlayerPoints = {
  id: string;
  name: string;
  points: number;
  tournamentsPlayed: number;
  tournamentsWon: number;
};

function sumAllPlayersPointsFromData(
  resultType: ResultType,
  data: Tournament[]
): PlayerPoints[] {
  const allPlayersPoints: { [key: string]: PlayerPoints } = {};
  data.forEach((tournament) => {
    Object.keys(tournament.playerRounds).forEach((playerId) => {
      const player = tournament.playerRounds[playerId];
      if (!allPlayersPoints[playerId]) {
        allPlayersPoints[playerId] = {
          id: player.id,
          name: player.name,
          tournamentsPlayed: 0,
          tournamentsWon: 0,
          points: 0,
        };
      }
      const points = player[`${resultType}Points`];
      if (points) {
        allPlayersPoints[playerId].points += points;
      }
      if (
        player[`${resultType}Position`] === "1" ||
        player[`${resultType}Position`] === "T1"
      ) {
        allPlayersPoints[playerId].tournamentsWon += 1;
      }
      allPlayersPoints[playerId].tournamentsPlayed += 1;
    });
  });
  return Object.values(allPlayersPoints).sort((a, b) => b.points - a.points);
}

export function Ranking({
  data,
  params,
  gotoView,
}: ViewTypeParams): JSX.Element {
  const [activeTab, setActiveTab] = useState<ResultType>("net");
  return (
    <>
      <h1 className="title is-1">Ranking</h1>
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
      <RankList data={data} type={activeTab} gotoView={gotoView} />
    </>
  );
}

function RankList({
  data,
  type,
  gotoView,
}: {
  data: Tournament[];
  type: ResultType;
  gotoView: (view: string, params?: string[]) => void;
}) {
  const list = sumAllPlayersPointsFromData(type, data);
  return (
    <table className="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>POS</th>
          <th>SPELARE</th>
          <th>SPELAT</th>
          <th>VUNNA</th>
          <th>POÄNG</th>
        </tr>
      </thead>
      <tbody>
        {list &&
          list.map((playerPoints, index: number) => (
            <tr
              key={index}
              onClick={() => {
                gotoView("player", [playerPoints.id]);
              }}
            >
              <td>{index + 1}</td>
              <td>{playerPoints.name}</td>
              <td>{playerPoints.tournamentsPlayed}</td>
              <td>{playerPoints.tournamentsWon}</td>
              <td>{playerPoints.points}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
