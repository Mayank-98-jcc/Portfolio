import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const ContactScene = lazy(() => import('./ContactScene'));
class EnvironmentBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function ContactEnvironment() {
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={host} className="contact-environment" aria-hidden="true">
      <div className="contact-scene-fallback">
        <div className="contact-static-arch">
          <i />
          <span />
          <span />
        </div>
        <div className="contact-static-floor" />
        <div className="contact-static-table" />
        <div className="contact-static-lamp" />
      </div>
      {near && !reduced && (
        <EnvironmentBoundary>
          <Suspense fallback={null}>
            <ContactScene />
          </Suspense>
        </EnvironmentBoundary>
      )}
    </div>
  );
}
