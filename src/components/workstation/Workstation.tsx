import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { projects } from '../../data/projects';
import { ProjectArtwork } from '../projects/ProjectArtwork';
export function Workstation() {
  const track = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
      const gallery = track.current;
      if (!gallery) return;
      const tween = gsap.to(gallery, {
        scrollLeft: () => gallery.scrollWidth - gallery.clientWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: gallery,
          start: 'top 75%',
          end: 'bottom 40%',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      // Explicit gallery interaction takes over from the scroll choreography.
      const manual = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
      const section = gallery.closest('section');
      section?.addEventListener('pointerdown', manual, { passive: true });
      gallery.addEventListener('wheel', manual, { passive: true });
      gallery.addEventListener('keydown', manual);
      return () => {
        section?.removeEventListener('pointerdown', manual);
        gallery.removeEventListener('wheel', manual);
        gallery.removeEventListener('keydown', manual);
      };
    });
    return () => media.revert();
  }, []);
  function move(direction: number) {
    track.current?.scrollBy({
      left: direction * track.current.clientWidth * 0.8,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }
  return (
    <section className="section workstation-section" aria-labelledby="workspace-title">
      <div className="section-kicker" data-reveal>
        <span>06 / BEHIND THE BUILD</span>
        <span>THINK. MAKE. REFINE.</span>
      </div>
      <div className="section-heading" data-reveal>
        <h2 id="workspace-title">
          INSIDE THE
          <br />
          <span className="serif">projects.</span>
        </h2>
        <div>
          <p>
            Real interfaces.
            <br />
            Ideas made tangible.
          </p>
          <div className="gallery-controls">
            <button
              className="circle-icon"
              aria-label="Previous project screenshot"
              onClick={() => move(-1)}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              className="circle-icon"
              aria-label="Next project screenshot"
              onClick={() => move(1)}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
      <div
        ref={track}
        className="workspace-track"
        tabIndex={0}
        aria-label="Project screenshot gallery. Swipe or use arrow buttons to explore."
        data-lenis-prevent
      >
        {projects
          .filter((project) => project.imageKind === 'screenshot')
          .map((project, index) => (
            <figure className={`gallery-project project-${project.id}`} key={project.id}>
              <a
                href={project.image}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} screenshot`}
              >
                <ProjectArtwork project={project} />
              </a>
              <figcaption>
                <span>
                  0{index + 1} / {project.title}
                </span>
                <span>{project.subtitle}</span>
              </figcaption>
            </figure>
          ))}
      </div>
      <p className="gallery-note">
        Screenshots from ResumeIQ and OceanXplore. Open an image to explore the interface in detail.
      </p>
    </section>
  );
}
