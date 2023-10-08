import { PlayerRounds, Tournament, ResultType } from "../TournamentDataTypes";
import "./Scorecard.css";

export function Scorecard({
  playerRounds,
  tournament,
  type,
}: {
  playerRounds: PlayerRounds;
  tournament: Tournament;
  type: ResultType;
}) {
  const outPar = tournament.pars.slice(0, 9).reduce((a, b) => a + b, 0);
  const inPar = tournament.pars.slice(9, 18).reduce((a, b) => a + b, 0);
  const totalPar = outPar + inPar;
  return (
    <table className="table is-fullwidth">
      <thead>
        <tr>
          <th>Hål</th>
          <th align="center">1</th>
          <th align="center">2</th>
          <th align="center">3</th>
          <th align="center">4</th>
          <th align="center">5</th>
          <th align="center">6</th>
          <th align="center">7</th>
          <th align="center">8</th>
          <th align="center">9</th>
          <th align="center">Ut</th>
          <th align="center">10</th>
          <th align="center">11</th>
          <th align="center">12</th>
          <th align="center">13</th>
          <th align="center">14</th>
          <th align="center">15</th>
          <th align="center">16</th>
          <th align="center">17</th>
          <th align="center">18</th>
          <th align="center">In</th>
          <th align="center">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {tournament.pars.map((par, index) => {
            if (index == 0) {
              return (
                <>
                  <td className="content is-small">Par</td>
                  <td align="center">{par}</td>
                </>
              );
            } else if (index == 9) {
              return (
                <>
                  <td align="center">{outPar}</td>
                  <td align="center">{par}</td>
                </>
              );
            } else {
              return <td align="center">{par}</td>;
            }
          })}
          <td>{inPar}</td>
          <td>{totalPar}</td>
        </tr>
        <tr>
          {tournament.indexes.map((idx, index) => {
            if (index == 0) {
              return (
                <>
                  <td className="content is-small">Hcp</td>
                  <td align="center">{idx}</td>
                </>
              );
            } else if (index == 9) {
              return (
                <>
                  <td></td>
                  <td align="center">{idx}</td>
                </>
              );
            } else {
              return <td align="center">{idx}</td>;
            }
          })}
          <td></td>
          <td></td>
        </tr>
        {playerRounds.rounds.map((round, roundIndex) => (
          <>
            <tr>
              <td colSpan={22}>
                <p className="content is-small">Rond {roundIndex + 1}</p>
              </td>
            </tr>
            <tr>
              <td className="content is-small" align="center">
                Slag
              </td>
              <td align="center">
                {drawHole(round.gross.holes[0], tournament.pars[0])}
              </td>
              <td align="center">
                {drawHole(round.gross.holes[1], tournament.pars[1])}
              </td>
              <td align="center">
                {drawHole(round.gross.holes[2], tournament.pars[2])}
              </td>
              <td align="center">
                {drawHole(round.gross.holes[3], tournament.pars[3])}
              </td>
              <td align="center">
                {drawHole(round.gross.holes[4], tournament.pars[4])}
              </td>
              <td align="center">
                {drawHole(round.gross.holes[5], tournament.pars[5])}
              </td>
              <td align="center">
                {drawHole(round.gross.holes[6], tournament.pars[6])}
              </td>
              <td align="center">
                {drawHole(round.gross.holes[7], tournament.pars[7])}
              </td>
              <td align="center">
                {drawHole(round.gross.holes[8], tournament.pars[8])}
              </td>
              <td align="center">{round.gross.out}</td>
              <td align="center">
                {drawHole(round.gross.holes[9], tournament.pars[9])}
              </td>
              <td align="center">
                {drawHole(round.gross.holes[10], tournament.pars[10])}
              </td>
              <td align="center">
                {drawHole(round.gross.holes[11], tournament.pars[11])}
              </td>
              <td align="center">
                {drawHole(round.gross.holes[12], tournament.pars[12])}
              </td>
              <td align="center">
                {drawHole(round.gross.holes[13], tournament.pars[13])}
              </td>
              <td align="center">
                {drawHole(round.gross.holes[14], tournament.pars[14])}
              </td>
              <td align="center">
                {drawHole(round.gross.holes[15], tournament.pars[15])}
              </td>
              <td align="center">
                {drawHole(round.gross.holes[16], tournament.pars[16])}
              </td>
              <td align="center">
                {drawHole(round.gross.holes[17], tournament.pars[17])}
              </td>
              <td align="center">{round.gross.in}</td>
              <td align="center">{round.gross.total}</td>
            </tr>
            <tr className="netResult">
              <td align="center" className="content is-small">
                Netto
              </td>
              <td align="center">{round.net.holes[0]}</td>
              <td align="center">{round.net.holes[1]}</td>
              <td align="center">{round.net.holes[2]}</td>
              <td align="center">{round.net.holes[3]}</td>
              <td align="center">{round.net.holes[4]}</td>
              <td align="center">{round.net.holes[5]}</td>
              <td align="center">{round.net.holes[6]}</td>
              <td align="center">{round.net.holes[7]}</td>
              <td align="center">{round.net.holes[8]}</td>
              <td align="center">{round.net.out}</td>
              <td align="center">{round.net.holes[9]}</td>
              <td align="center">{round.net.holes[10]}</td>
              <td align="center">{round.net.holes[11]}</td>
              <td align="center">{round.net.holes[12]}</td>
              <td align="center">{round.net.holes[13]}</td>
              <td align="center">{round.net.holes[14]}</td>
              <td align="center">{round.net.holes[15]}</td>
              <td align="center">{round.net.holes[16]}</td>
              <td align="center">{round.net.holes[17]}</td>
              <td align="center">{round.net.in}</td>
              <td align="center">{round.net.total}</td>
            </tr>
          </>
        ))}
      </tbody>
    </table>
  );
}

function drawHole(shots: number, par: number) {
  if (shots === 0) {
    return <span className="holeNotPlayed">-</span>;
  } else if (shots === par) {
    return <span>{shots}</span>;
  } else if (shots === par - 1) {
    // birdie
    return <span className="birdie">{shots}</span>;
  } else if (shots < par - 1) {
    // eagle
    return <span className="eagle">{shots}</span>;
  } else if (shots === par + 1) {
    return <span className="bogey">{shots}</span>;
  } else if (shots > par + 1) {
    return <span className="doubleBogey">{shots}</span>;
  }

  return <span>{shots}</span>;
}
