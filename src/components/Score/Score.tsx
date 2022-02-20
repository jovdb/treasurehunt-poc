import { state } from "../../store/store";
import styles from "./Score.module.css";

export function Score() {
  return (
    <div class={styles.Score}>
      Score: <span class={styles.Score__value}>{state.score}</span>
    </div>
  );
}
