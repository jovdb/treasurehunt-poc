import { createMemo } from "solid-js";
import { state } from "../../store/store";
import { Explosion } from "../Explosion/Explosion";
import styles from "./Score.module.css";

export function Score() {
  return (
    <div class={styles.Score}>
      Score: <Explosion
          signal={createMemo(() => state.score)}
          condition={(value: number) => value > 0}
        >
          <span class={styles.Score__value}>{state.score}</span>
        </Explosion>
    </div>
  );
}
