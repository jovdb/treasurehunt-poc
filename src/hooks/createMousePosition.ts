import {
  createSignal, onMount, onCleanup, batch,
} from "solid-js";

export function createMousePosition() {
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);
  const [buttons, setButtons] = createSignal(0);

  function onMouseMove(e: MouseEvent) {
    batch(() => {
      setX(e.pageX);
      setY(e.pageY);
      setButtons(e.buttons);
    });
  }

  onMount(() => {
    window.addEventListener("mousemove", onMouseMove);
  });

  onCleanup(() => {
    window.removeEventListener("mousemove", onMouseMove);
  });

  return [x, y, buttons] as const;
}
