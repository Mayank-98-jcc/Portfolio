import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { heroEntrance, editorialReveals, heroScroll } from '../../animations/editorial';
gsap.registerPlugin(ScrollTrigger);
export function Experience({ root }: { root: RefObject<HTMLDivElement | null> }) {
  const loader = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    // Child layout effects run before the parent's ref is attached. The mounted
    // loader already has its actual DOM parent, so use that stable local scope.
    const scope = loader.current?.parentElement;
    if (!scope) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.to(progress.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: true },
      });
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const lenis = new Lenis({
          duration: 0.85,
          smoothWheel: true,
          syncTouch: false,
          anchors: { offset: -80 },
          prevent: (node) => node.tagName === 'DIALOG' || !!document.querySelector('dialog[open]'),
        });
        lenis.on('scroll', ScrollTrigger.update);
        const dialogObserver = new MutationObserver(() => {
          if (document.querySelector('dialog[open]')) lenis.stop();
          else if (lenis.isStopped) lenis.start();
        });
        dialogObserver.observe(document.body, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ['open'],
        });
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        const count = { value: 0 };
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro
          .fromTo('.loader-name', { yPercent: 110 }, { yPercent: 0, duration: 0.65 })
          .to(
            count,
            {
              value: 100,
              duration: 1.25,
              ease: 'power1.inOut',
              onUpdate: () => {
                if (counter.current)
                  counter.current.textContent = String(Math.round(count.value)).padStart(3, '0');
              },
            },
            0,
          )
          .fromTo(
            '.loader-line span',
            { scaleX: 0 },
            { scaleX: 1, duration: 1.25, ease: 'power1.inOut' },
            0,
          )
          .to(loader.current, { yPercent: -100, duration: 0.55, ease: 'power4.inOut' }, 1.3)
          .set(loader.current, { display: 'none' });
        heroEntrance(intro, 1.65);
        editorialReveals();
        // Scroll depth is restrained to larger layouts; touch layouts remain stable.
        const desktopScroll = gsap.matchMedia();
        desktopScroll.add('(min-width: 761px)', heroScroll);
        let disposed = false;
        document.fonts.ready.then(() => {
          if (!disposed) ScrollTrigger.refresh();
        });
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener('load', refresh);
        return () => {
          disposed = true;
          desktopScroll.revert();
          dialogObserver.disconnect();
          window.removeEventListener('load', refresh);
          gsap.ticker.remove(tick);
          lenis.destroy();
        };
      });
      mm.add(
        '(hover: hover) and (pointer: fine) and (min-width: 900px) and (prefers-reduced-motion: no-preference)',
        () => {
          const el = cursor.current;
          if (!el) return;
          const x = gsap.quickTo(el, 'x', { duration: 0.2, ease: 'power3.out' });
          const y = gsap.quickTo(el, 'y', { duration: 0.2, ease: 'power3.out' });
          const hero = scope.querySelector<HTMLElement>('#home');
          const portraitX = gsap.quickTo('.portrait-pointer-layer', 'x', {
            duration: 0.8,
            ease: 'power2.out',
          });
          const portraitY = gsap.quickTo('.portrait-pointer-layer', 'y', {
            duration: 0.8,
            ease: 'power2.out',
          });
          const greetingX = gsap.quickTo('.hero-greeting-pointer', 'x', {
            duration: 1,
            ease: 'power2.out',
          });
          const greetingY = gsap.quickTo('.hero-greeting-pointer', 'y', {
            duration: 1,
            ease: 'power2.out',
          });
          const nameX = gsap.quickTo('.hero-name', 'x', { duration: 1, ease: 'power2.out' });
          const glowX = gsap.quickTo('.hero-glow', 'x', { duration: 1.2, ease: 'power2.out' });
          const heroMove = (event: PointerEvent) => {
            if (!hero) return;
            const bounds = hero.getBoundingClientRect();
            const dx = Math.max(
              -1,
              Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2),
            );
            const dy = Math.max(
              -1,
              Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2),
            );
            portraitX(dx * 6);
            portraitY(dy * 4);
            greetingX(dx * 10);
            greetingY(dy * 8);
            nameX(dx * 3);
            glowX(dx * 12);
          };
          const heroLeave = () => {
            portraitX(0);
            portraitY(0);
            greetingX(0);
            greetingY(0);
            glowX(0);
            nameX(0);
          };
          hero?.addEventListener('pointermove', heroMove, { passive: true });
          hero?.addEventListener('pointerleave', heroLeave);
          const move = (event: PointerEvent) => {
            x(event.clientX);
            y(event.clientY);
            const target = event.target instanceof Element ? event.target : null;
            const mode = target?.closest('[data-cursor="view"]')
              ? 'view'
              : target?.closest('nav a')
                ? 'nav'
                : target?.closest('a, button, input, textarea, summary')
                  ? 'link'
                  : '';
            el.dataset.mode = mode;
            el.dataset.contrast = target?.closest('.contact-section, .footer') ? 'light' : 'dark';
            el.textContent = mode === 'view' ? 'VIEW' : mode === 'nav' ? '↗' : '';
            el.style.opacity = '1';
          };
          const leave = () => {
            el.style.opacity = '0';
          };
          window.addEventListener('pointermove', move);
          document.documentElement.addEventListener('pointerleave', leave);
          return () => {
            hero?.removeEventListener('pointermove', heroMove);
            hero?.removeEventListener('pointerleave', heroLeave);
            window.removeEventListener('pointermove', move);
            document.documentElement.removeEventListener('pointerleave', leave);
          };
        },
      );
    }, scope);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [root]);
  return (
    <>
      <div className="page-progress" ref={progress} aria-hidden="true" />
      <div className="preloader" ref={loader} aria-hidden="true">
        <div className="loader-top">
          <span>PORTFOLIO / 2026</span>
          <span>MADE WITH INTENTION.</span>
        </div>
        <div className="loader-name-mask">
          <span className="loader-name">
            MAYANK
            <br />
            THAPLIYAL<span>.</span>
          </span>
        </div>
        <div className="loader-bottom">
          <span>A CURIOUS MIND AT WORK.</span>
          <span>
            <span ref={counter}>000</span> %
          </span>
        </div>
        <div className="loader-line">
          <span />
        </div>
      </div>
      <div ref={cursor} className="custom-cursor" aria-hidden="true" />
    </>
  );
}
