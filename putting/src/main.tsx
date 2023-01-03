import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

function render() {
  let distance = Math.floor(Math.random() * 200) / 10;
  root.render(
    <React.StrictMode>
      <App distance={distance} />
    </React.StrictMode>
  );
}

render();

setInterval(() => {
  render();
}, 15000);
