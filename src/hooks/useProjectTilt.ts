import type { PointerEvent } from 'react';

/** Tilt only the artwork wrapper; GSAP retains ownership of the card entrance. */
export function useProjectTilt() {
  function reset(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.removeProperty('--tilt-x');
    event.currentTarget.style.removeProperty('--tilt-y');
  }
  return {
    onPointerMove(event: PointerEvent<HTMLElement>) {
      if (
        event.pointerType !== 'mouse' ||
        !matchMedia(
          '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
        ).matches
      )
        return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      event.currentTarget.style.setProperty('--tilt-x', `${-y * 4}deg`);
      event.currentTarget.style.setProperty('--tilt-y', `${x * 4}deg`);
    },
    onPointerLeave: reset,
    onPointerCancel: reset,
  };
}
