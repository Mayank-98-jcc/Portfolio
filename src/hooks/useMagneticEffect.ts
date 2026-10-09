import type { PointerEvent } from 'react';
import { useReducedMotion } from './useReducedMotion';
export function useMagneticEffect<T extends HTMLElement>() {
  const reduced = useReducedMotion();
  return {
    onPointerMove(event: PointerEvent<T>) {
      if (reduced || event.pointerType !== 'mouse') return;
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty(
        '--magnetic-x',
        `${((event.clientX - rect.left) / rect.width - 0.5) * 5}px`,
      );
      event.currentTarget.style.setProperty(
        '--magnetic-y',
        `${((event.clientY - rect.top) / rect.height - 0.5) * 4}px`,
      );
    },
    onPointerLeave(event: PointerEvent<T>) {
      event.currentTarget.style.setProperty('--magnetic-x', '0px');
      event.currentTarget.style.setProperty('--magnetic-y', '0px');
    },
  };
}
