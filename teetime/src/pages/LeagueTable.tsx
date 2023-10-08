import { Link } from "react-router-dom";
import { Navbar } from "../Navbar";
import { Player, Year } from "../TeeTimeResultTypes";

export function LeagueTable({
  data,
  yearParam,
}: {
  data: Year;
  yearParam?: string;
}): React.ReactElement {
  return (
    <>
      <Navbar />
      <section className="is-section">
        <h4 className="title is-4">Totalresultat {yearParam}</h4>
        <PlayerTable players={data.players} />
      </section>
    </>
  );
}

export function PlayerTable({ players }: { players: Player[] }) {
  return (
    <table className="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th></th>
          <th style={{ textAlign: "center" }}>V</th>
          <th style={{ textAlign: "center" }}>T3</th>
          <th style={{ textAlign: "center" }}>T5</th>
          <th style={{ textAlign: "center" }}>Delt.</th>
          <th style={{ textAlign: "center" }}>Poäng</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player) => (
          <tr key={player.nick}>
            <td>
              <Link to={"/spelare/2023/" + player.nick}>{player.nick}</Link>
            </td>
            <td>{player.won}</td>
            <td>{player.top3}</td>
            <td>{player.top5}</td>
            <td>{player.played}</td>
            <td>{player.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
