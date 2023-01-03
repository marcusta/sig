import { useEffect, useState } from "react";
import GolfPuttingStrokeArc from "./CanvasArc";
import { DataTrainer } from "./DataTrainer";

function useLog(...message: any[]) {
  useEffect(() => {
    console.log(message);
  }, [message]);
}

function App({ distance }: { distance: number }) {
  useLog(`App render ${distance} `, distance);
  return (
    <div className="App">
      <DataTrainer distance={distance} />
    </div>
  );
}

export default App;
