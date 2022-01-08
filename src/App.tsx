/* eslint-disable no-debugger */
import { Component } from "solid-js";

import styles from "./App.module.css";
import { TopView } from "./components/TopView/TopView";

const App: Component = () => (
  <div class={styles.App}>
    <TopView />
  </div>
);

export default App;
