import { useState } from "react";
import {
  calculateStrokeLengthForDistance,
  getBallSpeedForDistance,
  getBlastMotionClubSpeed,
  puttsAs,
} from "./strokecalculator";
import "./DataTrainer.css";
import GolfPuttingStrokeArc from "./CanvasArc";

export function DataTrainer({}: { distance: number }) {
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
    setTxtStimp(stimp);
    let value = parseInt(stimp);
    if (Number.isNaN(value) || value < 10 || value > 11) {
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

  return (
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
      <DataView
        puttsAsDist={puttsAsDist}
        ballspeed={ballspeed}
        strokeLength={strokeLength}
        blastMotionClubSpeed={bmClubspeed}
        stimp={stimp}
        elevation={elevation}
        distance={distance}
      />
      <GolfPuttingStrokeArc
        length={strokeLength}
        width={800}
        height={800}
        color="#bbbbbb"
        lineWidth={12}
        x={100}
        y={200}
        radius={200}
        startAngle={Math.PI / 8}
        endAngle={Math.PI}
        backStrokeDuration={600}
        forwardStrokeDuration={300}
      />
    </div>
  );
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
    <div className="dataTileSet">
      <DataTile label="Putts as" value={puttsAsDist} />
      <DataTile label="Ballspeed" value={ballspeed} />
      <DataTile label="Club speed" value={blastMotionClubSpeed} />
      <DataTile label="Stroke Length" value={strokeLength} />
      <DataTile label="Elevation" value={elevation} />
      <DataTile label="Distance" value={distance} />
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
