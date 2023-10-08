import { useState } from "react";
import {
  calculateStrokeLengthForDistance,
  getBallSpeedForDistance,
  getBlastMotionClubSpeed,
  puttsAs,
} from "./strokecalculator";
import "./DataTrainer.css";

export function DataTrainer() {
  const [distance, setDistance] = useState(5);
  const [txtDistance, setTxtDistance] = useState("5");
  const [stimp, setStimp] = useState(11);
  const [txtStimp, setTxtStimp] = useState("11");
  const [elevation, setElevation] = useState(0);
  const [txtElevation, setTxtElevation] = useState("0");

  function updateDistance(distance: string) {
    setTxtDistance(distance);

    let value = parseFloat(distance);
    if (Number.isNaN(value)) {
      return;
    }
    setDistance(value);
  }

  function updateElevation(elevation: string) {
    setTxtElevation(elevation);

    let value = parseInt(elevation);
    if (Number.isNaN(value)) {
      return;
    }
    setElevation(value);
  }

  function updateStimp(stimp: string) {
    console.log("stimp: " + stimp);
    setTxtStimp(stimp);
    let value = parseInt(stimp);
    if (Number.isNaN(value) || value < 8 || value > 13) {
      return;
    }
    setStimp(value);
  }

  const puttsAsDist = puttsAs(distance, stimp, elevation);
  const ballspeed = getBallSpeedForDistance(puttsAsDist, stimp);
  const bmClubspeed = getBlastMotionClubSpeed(ballspeed);
  const strokeLength = calculateStrokeLengthForDistance(
    puttsAsDist,
    stimp,
    elevation
  );

  const dataView = (
    <DataView
      puttsAsDist={puttsAsDist}
      ballspeed={ballspeed}
      strokeLength={strokeLength}
      blastMotionClubSpeed={bmClubspeed}
      stimp={stimp}
      elevation={elevation}
      distance={distance}
    />
  );

  let inputSet = <div></div>;

  if (isMobileView()) {
    inputSet = (
      <div className="mobileInputs">
        <div>
          Distance:{" "}
          <input
            type={"range"}
            value={txtDistance}
            onChange={(e) => updateDistance(e.target.value)}
            min={2}
            max={25}
            step={0.1}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          Elevation:{" "}
          <input
            type={"range"}
            value={txtElevation}
            onChange={(e) => updateElevation(e.target.value)}
            min={-130}
            max={130}
            step={2}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          Stimp:
          <select
            value={txtStimp}
            onChange={(e) => {
              updateStimp(e.target.value);
              console.log("stimp changed");
            }}
            style={{ width: "100%" }}
          >
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
            <option value={11}>11</option>
            <option value={12}>12</option>
            <option value={13}>13</option>
          </select>
        </div>
      </div>
    );
  } else {
    inputSet = (
      <div>
        Distance:{" "}
        <input
          type={"text"}
          value={txtDistance}
          onChange={(e) => updateDistance(e.target.value)}
        />
        Elevation:{" "}
        <input
          type={"text"}
          value={txtElevation}
          onChange={(e) => updateElevation(e.target.value)}
        />
        Stimp:{" "}
        <input
          type={"text"}
          value={txtStimp}
          onChange={(e) => updateStimp(e.target.value)}
        />
        <br />
      </div>
    );
  }

  if (isMobileView()) {
    return (
      <>
        {dataView}
        {inputSet}
      </>
    );
  } else {
    return (
      <>
        {inputSet}
        {dataView}
      </>
    );
  }
}

function isMobileView() {
  return window.innerWidth < 600;
}

function DataView({
  puttsAsDist,
  ballspeed,
  strokeLength,
  stimp,
  elevation,
  distance,
  blastMotionClubSpeed,
}: {
  puttsAsDist: number;
  ballspeed: number;
  strokeLength: number;
  stimp: number;
  elevation: number;
  distance: number;
  blastMotionClubSpeed: number;
}) {
  return (
    <div className={isMobileView() ? "mobileDataTileSet" : "dataTileSet"}>
      <DataTile label="Putts as (m)" value={puttsAsDist} />
      <DataTile label="Ballspeed (mph)" value={ballspeed} />
      <DataTile label="Club speed (mph)" value={blastMotionClubSpeed} />
      <DataTile label="Stroke Length (cm)" value={strokeLength} />
      <DataTile label="Elevation (cm)" value={elevation} />
      <DataTile label="Distance (m)" value={distance} />
      <DataTile label="Stimp" value={stimp} />
    </div>
  );
}

function DataTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="dataTile">
      <div className="dataLabel">{label}</div>
      <div className="data">{value}</div>
    </div>
  );
}
