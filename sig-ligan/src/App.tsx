import { useCallback, useEffect, useState } from "react";
import { NavBar } from "./components/Navbar";
import "bulma/css/bulma.min.css";

export interface Tournament {
  id: string;
  name: string;
  pars: number[];
  indexes: number[];
  par: string;
  playerRounds: { [key: string]: PlayerRounds };
}

export interface PlayerRounds {
  name: string;
  id: string;
  handicap: number;
  gross: number;
  net: number;
  rounds: Round[];
}

export interface Round {
  scoreId: string;
  activeHole: string;
  round: string;
  date: string;
  status: string;
  net: Result;
  gross: Result;
}

export interface Result {
  in: number;
  out: number;
  total: number;
  toPar: number;
  holes: number[];
}

type ResultType = "gross" | "net";

function getLeaderForTournament(
  tournament: Tournament,
  type: ResultType
): string {
  const playerRounds = tournament.playerRounds;
  const playerIds = Object.keys(playerRounds);
  const players = playerIds.map((playerId) => playerRounds[playerId]);
  const sortedPlayers = players
    .sort((a, b) => a[type] - b[type])
    .map((player, index) => {
      return {
        ...player,
        place: index + 1,
      };
    });
  const leader = sortedPlayers[0];
  return `${leader.name}, ${leader[type]}`;
}

async function fetchData(): Promise<Tournament[]> {
  const response = await fetch("http://localhost:5173/api/results.json");
  const data = await response.json();
  console.log(data);
  return Object.keys(data).map((key) => data[key]);
}

type ViewType = ({
  data,
  gotoView,
}: {
  data: Tournament[];
  gotoView: (view: string) => void;
  params?: string[];
}) => JSX.Element;

const views: { [viewName: string]: ViewType } = {
  tournamentList: TournamentList,
  tournament: Tournament,
};

function App() {
  const [data, setData] = useState<Tournament[] | undefined>();
  const [currentView, setCurrentView] = useState<{
    name: string;
    params: string[];
  }>({ name: "tournamentList", params: [] });

  useEffect(() => {
    fetchData().then((data) => setData(data));
  }, []);
  const gotoView = useCallback(
    (view: string) => {
      setCurrentView({ name: view, params: [] });
    },
    [data]
  );
  if (!data) return <div>Loading...</div>;
  const View = views[currentView.name];
  return (
    <>
      <NavBar />
      <section className="section" style={{ marginTop: "60px" }}>
        <div className="container box">
          <View data={data} gotoView={gotoView} params={currentView.params} />
        </div>
      </section>
    </>
  );
}

function Tournament({
  data,
  gotoView,
  params,
}: {
  data: Tournament[];
  gotoView: (view: string) => void;
  params?: string[];
}) {
  return (
    <>
      <h1 className="title is-1">{data.name}</h1>
    </>
  );
}

function TournamentList({
  data,
  gotoView,
  params,
}: {
  data: Tournament[];
  gotoView: (view: string) => void;
  params?: string[];
}) {
  return (
    <>
      <h1 className="title is-1">Tävlingar</h1>
      <table className="table">
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
                    gotoView("tournament");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <span style={{ color: "blue" }}>{tournament.name}</span>
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

export default App;
