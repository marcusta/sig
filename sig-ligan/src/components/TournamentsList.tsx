import { getLeaderForTournament } from "../dataHelpers";
import { ViewTypeParams } from "../ViewTypes";

export function TournamentList({ data, gotoView, params }: ViewTypeParams) {
  return (
    <>
      <h1 className="title is-1">Tävlingar</h1>
      <button
        className="button is-light is-link"
        onClick={() => gotoView("ranking")}
      >
        Visa Ranking
      </button>
      &nbsp;
      <table className="table is-hoverable is-striped">
        <thead>
          <tr>
            <th>Tävling</th>
            <th>Brutto</th>
            <th>Netto</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((tournament) => (
              <tr key={tournament.id}>
                <td
                  onClick={() => {
                    gotoView("tournamentLeaderboard", [tournament.id]);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <span style={{ color: "#44c" }}>{tournament.name}</span>
                </td>
                <td>{getLeaderForTournament(tournament, "gross")}</td>
                <td>{getLeaderForTournament(tournament, "net")}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
