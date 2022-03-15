/* eslint-disable no-debugger */
import { Component, createSignal } from "solid-js";

import styles from "./App.module.css";
import { TopView } from "./components/TopView/TopView";

const App: Component = () => {
  const [getShowInfo, setShowInfo] = createSignal(true);

  return (
    <div class={styles.App}>
      <TopView />
      {getShowInfo() && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            "font-size": "0.8em",
            "background-color": "white",
            border: "1px solid #888",
            "border-radius": "5px",
            padding: "8px",
            cursor: "pointer",
            "margin-left": "10px",
          }}
          onClick={() => setShowInfo(false)}
        >
          This is a POC for a GPS based treasurehunt game.<br/>
          You can simulate movement with the arrow keys.<br/>
          Press Home to jump the first waypoint, PageDown for the next waypoint.
          <div
            style={{
              position: "absolute",
              top: "0px",
              right: "8px",
            }}
          >
            x
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
