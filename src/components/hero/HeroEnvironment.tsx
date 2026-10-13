import { Component, lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const HeroScene = lazy(() => import('./HeroScene'));

// A failed optional renderer must never take down the portfolio or its media.
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HeroEnvironment() {
  const reduced = useReducedMotion();
  return (
    <div className="hero-environment" aria-hidden="true">
      <div className="hero-technical-grid" />
      <div className="hero-scene-fallback">
        <span className="fallback-sculpture" />
        <span className="fallback-orbit" />
        <span className="fallback-orbit orbit-secondary" />
      </div>
      {!reduced && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </SceneBoundary>
      )}
      <span className="scene-annotation">Build. Learn. Create. Repeat.</span>
    </div>
  );
}
