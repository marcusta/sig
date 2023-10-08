import { useCallback, useEffect, useState } from "react";
import { NavBar } from "./components/Navbar";
import "bulma/css/bulma.min.css";
import { Tournament } from "./TournamentDataTypes";
import { TournamentLeaderboard } from "./components/TournamentLeaderboard";
import { ViewType } from "./ViewTypes";
import { TournamentList } from "./components/TournamentsList";
import { Ranking } from "./components/Ranking";
import { Player } from "./components/Player";

async function fetchData(): Promise<Tournament[]> {
  const response = await fetch("/api/results.json");
  const data = await response.json();
  return Object.keys(data).map((key) => data[key]);
}

const views: { [viewName: string]: ViewType } = {
  tournamentList: TournamentList,
  tournamentLeaderboard: TournamentLeaderboard,
  ranking: Ranking,
  player: Player,
};

function App() {
  const [data, setData] = useState<Tournament[] | undefined>();
  const [currentView, setCurrentView] = useState<{
    name: string;
    params?: string[];
  }>({ name: "tournamentList", params: [] });

  useEffect(() => {
    fetchData().then((data) => setData(data));
  }, []);
  const gotoView = useCallback(
    (view: string, params?: string[]) => {
      console.log("gotoView", view, params);
      setCurrentView({ name: view, params: params });
    },
    [data]
  );
  if (!data) return <div>Loading...</div>;
  const View = views[currentView.name];
  return (
    <>
      <NavBar />
      <section className="section is-medium">
        <div className="container box">
          <View data={data} gotoView={gotoView} params={currentView.params} />
        </div>
      </section>
    </>
  );
}

export default App;
