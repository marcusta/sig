import { useParams } from "react-router-dom";
import { Competition, Player, Year } from "../TeeTimeResultTypes";
import { PlayerTable } from "./LeagueTable";
import { Navbar } from "../Navbar";

export function PlayerView({
  data,
  yearParam,
}: {
  data: Year;
  yearParam?: string;
}) {
  const { playerParam } = useParams();
  const player = data.players.find((p) => p.nick === playerParam);
  if (!player) {
    return <div>Ingen spelare {playerParam}</div>;
  }
  //<h3 className="title is-3">{player.name}</h3>
  return (
    <>
      <Navbar />
      <section className="is-section">
        <h3 className="title is-3">
          {player.name} {yearParam}
        </h3>
        <h4 className="title is-4">Totalt</h4>
        <PlayerTable players={[player]} />
        <hr />
        <h4 className="title is-4">Stats</h4>
        <PlayerStatsTable player={player} />
        <hr />
        <h4 className="title is-4">Deltävlingar</h4>
        <CompetitionsTable
          competitions={data.competitions}
          playerNick={player.nick}
        />
        <h4 className="title is-4">Missade deltävlingar</h4>
        <MissedCompetitionsTable
          competitions={data.competitions}
          playerNick={player.nick}
        />
      </section>
    </>
  );
}

function PlayerStatsTable({ player }: { player: Player }) {
  return (
    <table className="table is-striped is-hoverable is-fullwidth">
      <tbody>
        <tr>
          <td>Snitt poängbogey</td>
          <td>{player.meanResult}</td>
        </tr>
        <tr>
          <td>Snitt poängbogey, top 10</td>
          <td>{player.meanResultTop10}</td>
        </tr>
        <tr>
          <td>Bäst poängbogey</td>
          <td>{player.bestResult}</td>
        </tr>
        <tr>
          <td>Sämst poängbogey</td>
          <td>{player.worstResult}</td>
        </tr>
        <tr>
          <td>Deltagargrad</td>
          <td>{player.playedPercentage}%</td>
        </tr>
        <tr>
          <td>Rankpoäng, top 10</td>
          <td>{player.points}</td>
        </tr>
        <tr>
          <td>Rankpoäng totalt</td>
          <td>{player.totalPoints}</td>
        </tr>
        <tr>
          <td>Snitt rankpoäng</td>
          <td>{player.meanPoints}</td>
        </tr>
        <tr>
          <td>Snitt rankpoäng, top 10</td>
          <td>{player.meanPointsTop10}</td>
        </tr>
        <tr>
          <td>Handikappdopning</td>
          <td>{player.dopedHandicap}</td>
        </tr>
      </tbody>
    </table>
  );
}

function CompetitionsTable({
  competitions,
  playerNick,
}: {
  competitions: Competition[];
  playerNick: string;
}) {
  return (
    <table className="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th style={{ textAlign: "center" }}></th>
          <th style={{ textAlign: "center" }}>Res</th>
          <th style={{ textAlign: "center" }}>Pos</th>
          <th style={{ textAlign: "center" }}>Poäng</th>
        </tr>
      </thead>
      <tbody>
        {competitions.map((comp) => {
          const player = comp.results.find((p) => p.nick === playerNick);
          if (!player) {
            return undefined;
          }
          return (
            <tr key={comp.id}>
              <td>
                {comp.name}
                {comp.note ? (
                  <p className="is-small is-size-7 is-uppercase">{comp.note}</p>
                ) : undefined}
              </td>
              <td style={{ verticalAlign: "middle" }}>{player.result}</td>
              <td style={{ verticalAlign: "middle" }}>{player.position}</td>
              <td
                style={{
                  verticalAlign: "middle",
                  backgroundColor:
                    player.usedForPoints && player.position < 6 && !player.dq
                      ? "#8d8"
                      : "",
                }}
              >
                {player.points}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function MissedCompetitionsTable({
  competitions,
  playerNick,
}: {
  competitions: Competition[];
  playerNick: string;
}) {
  return (
    <table className="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th align="center">Deltävling</th>
        </tr>
      </thead>
      <tbody>
        {competitions.map((comp) => {
          const player = comp.results.find((p) => p.nick === playerNick);
          if (!player) {
            return (
              <tr key={comp.id}>
                <td
                  style={{
                    textDecoration: comp.cancelled ? "line-through" : "",
                  }}
                >
                  {comp.name}
                  {comp.note ? (
                    <p className="is-small is-size-7 is-uppercase">
                      {comp.note}
                    </p>
                  ) : undefined}
                </td>
              </tr>
            );
          }
          return undefined;
        })}
      </tbody>
    </table>
  );
}
