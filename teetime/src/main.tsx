import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { LeagueTable } from "./pages/LeagueTable";
import { PlayerView } from "./pages/Player";
import { Rounds } from "./pages/Rounds";
import { calculatePointsAndStandings, fetchData } from "./teetimeResults";
import { YearSelector } from "./YearSelector";
import "bulma/css/bulma.min.css";
import "@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css";
import "@fortawesome/react-fontawesome";

import "./App.css";

async function render() {
  const data = await fetchData();
  const updatedData = calculatePointsAndStandings(data);
  let basename = "/";
  if (window.location.pathname.includes("/teetime")) {
    basename = "/teetime";
  }
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: (
          <YearSelector data={updatedData} childRenderer={LeagueTable} />
        ),
      },
      {
        path: "/ligan/:yearParam",
        element: (
          <YearSelector data={updatedData} childRenderer={LeagueTable} />
        ),
      },
      {
        path: "/rundor/:yearParam",
        element: <YearSelector data={updatedData} childRenderer={Rounds} />,
      },
      {
        path: "/spelare/:yearParam/:playerParam",
        element: <YearSelector data={updatedData} childRenderer={PlayerView} />,
      },
    ],
    { basename }
  );

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

render();
