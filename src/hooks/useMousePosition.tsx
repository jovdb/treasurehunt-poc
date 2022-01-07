import { createSignal, onMount, onCleanup, batch } from 'solid-js';

export function useMousePosition() {
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);

  function onMouseMove(e: MouseEvent) {
    if (e.buttons === 1) {
      batch(() => {
        setX(e.pageX);
        setY(e.pageY);
      });
    }
  }

  onMount(() => {
    window.addEventListener("mousemove", onMouseMove);
  });

  onCleanup(() => {
    window.removeEventListener("mousemove", onMouseMove);
  });

  return [x, y];
}
