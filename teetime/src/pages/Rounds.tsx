import { Link } from "react-router-dom";
import { Navbar } from "../Navbar";
import { Competition, PlayerResult, Year } from "../TeeTimeResultTypes";

export function Rounds({
  data,
  yearParam,
}: {
  data: Year;
  yearParam?: string;
}) {
  return (
    <>
      <Navbar />
      <h4 className="title is-4">Deltävlingar {yearParam}</h4>
      <hr />
      {data.competitions.map((competition) => (
        <CompetitionSection key={competition.id} competition={competition} />
      ))}
    </>
  );
}

function CompetitionSection({ competition }: { competition: Competition }) {
  const shouldRenderTable = competition.results.length > 0;
  return (
    <section className="is-section">
      <h5
        className="title is-5"
        style={{
          textDecoration: competition.cancelled ? "line-through" : "",
        }}
      >
        {competition.name}
        {competition.note ? ", " + competition.note : ""}
      </h5>
      {shouldRenderTable && (
        <CompetitionTable playerResults={competition.results} />
      )}
      <hr />
    </section>
  );
}

function CompetitionTable({
  playerResults,
}: {
  playerResults: PlayerResult[];
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
        {playerResults
          .sort((a, b) => a.position - b.position)
          .map((player) => (
            <tr key={player.nick}>
              <td>
                <Link to={"/spelare/2023/" + player.nick}>
                  <span
                    style={
                      player.dq
                        ? {
                            textDecoration: "line-through",
                          }
                        : {}
                    }
                  >
                    {player.nick}
                  </span>
                </Link>
              </td>
              <td>{player.result}</td>
              <td>{player.position}</td>
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
          ))}
      </tbody>
    </table>
  );
}
