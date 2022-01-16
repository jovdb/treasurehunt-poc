/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { For } from "solid-js";
import { Accessor } from "solid-js/types/reactive/signal";

// TODO: use Portal?
// pass name to group?
export const SignalLogger = (props: {
  obj: Record<string, Accessor<any>>;
}) => {
  const keys = Object.keys(props.obj);
  return (
    <For each={keys}>{(key) => (
      <div style={{ "font-family": "monospace", "font-size": "7px", color: "#888" }}>
        <strong>{key}</strong>: {`${props.obj[key]()}`}
      </div>
    )}</For>
  );
};
