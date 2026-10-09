import gsap from 'gsap';

export function heroEntrance(timeline: gsap.core.Timeline, start: number) {
  timeline
    .from('.hero-glow', { opacity: 0, duration: 1 }, start)
    .from(
      '.navbar',
      { y: -20, opacity: 0, duration: 0.7, clearProps: 'transform,opacity' },
      start + 0.1,
    )
    .from(
      '.greeting-word',
      { y: 50, opacity: 0, filter: 'blur(10px)', stagger: 0.1, duration: 1, clearProps: 'filter' },
      start + 0.2,
    )
    .from(
      '.portrait-reveal-layer',
      {
        clipPath: 'inset(100% 0 0 0)',
        scale: 1.03,
        opacity: 0,
        duration: 1.3,
        clearProps: 'clipPath',
      },
      start + 0.35,
    )
    .from('.name-line-inner', { yPercent: 110, stagger: 0.1, duration: 0.85 }, start + 0.7)
    .from('.hero-note', { y: 25, opacity: 0, duration: 0.7 }, start + 1)
    .from('.hero-role', { y: 25, opacity: 0, duration: 0.7 }, start + 1.15)
    .from('.hero-availability', { scale: 0.9, opacity: 0, duration: 0.6 }, start + 1.35)
    .from(
      '.hero-bottom, .hero-topline',
      { opacity: 0, duration: 0.6, clearProps: 'opacity' },
      start + 1.6,
    );
}

export function editorialReveals() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
    if (element.matches('.skill-row')) return;
    const project = element.matches('.project-card');
    gsap.from(element, {
      y: project ? 80 : 35,
      opacity: 0,
      duration: project ? 1 : 0.8,
      delay: project && element.matches(':nth-child(even)') ? 0.12 : 0,
      ease: 'power3.out',
      ...(element.matches('.about-visual')
        ? { clipPath: 'inset(0 100% 0 0)', clearProps: 'clipPath' }
        : {}),
      scrollTrigger: { trigger: element, start: 'top 94%', once: true },
    });
    if (project) {
      gsap.from(element.querySelector('.project-image-button'), {
        clipPath: 'inset(0 0 100% 0)',
        duration: 1.1,
        clearProps: 'clipPath',
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 94%', once: true },
      });
      gsap.from(element.querySelector('.project-meta'), {
        y: 20,
        opacity: 0,
        duration: 0.7,
        delay: 0.15,
        scrollTrigger: { trigger: element, start: 'top 94%', once: true },
      });
      const images = element.querySelectorAll('.project-preview-image img');
      if (images.length)
        gsap.from(images, {
          scale: 1.08,
          duration: 1.2,
          ease: 'power2.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: element, start: 'top 94%', once: true },
        });
    }
  });
  gsap.utils.toArray<HTMLElement>('.skill-row').forEach((row) => {
    gsap
      .timeline({ scrollTrigger: { trigger: row, start: 'top 92%', once: true } })
      .from(row, { '--divider-progress': 0, duration: 0.8, ease: 'power2.out' })
      .from(
        row.querySelectorAll('.row-number, h3, .skill-names span, svg'),
        { y: 18, opacity: 0, stagger: 0.055, duration: 0.6 },
        0.15,
      );
  });
  gsap.from('#about-title .editorial-line > span', {
    yPercent: 110,
    stagger: 0.12,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#about-title', start: 'top 92%', once: true },
  });
  gsap
    .timeline({ scrollTrigger: { trigger: '.process-timeline', start: 'top 88%', once: true } })
    .from('.process-timeline', { '--timeline-progress': 0, duration: 1.25, ease: 'power2.inOut' })
    .from(
      '.process-step',
      { y: 30, opacity: 0, stagger: 0.14, duration: 0.8, ease: 'power3.out' },
      0.15,
    );
  gsap.from('.learning-inner > div > span', {
    y: 18,
    opacity: 0,
    stagger: 0.08,
    duration: 0.6,
    scrollTrigger: { trigger: '#learning', start: 'top 94%', once: true },
  });
  gsap.utils.toArray<HTMLElement>('.service-row').forEach((row) =>
    gsap.from(row, {
      '--divider-progress': 0,
      duration: 0.9,
      scrollTrigger: { trigger: row, start: 'top 92%', once: true },
    }),
  );
  gsap.from('.contact-line-inner', {
    yPercent: 110,
    stagger: 0.12,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#contact-title', start: 'top 92%', once: true },
  });
}

export function heroScroll() {
  const scrollTrigger = { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 1 };
  gsap.to('.hero-glow', { y: -25, ease: 'none', scrollTrigger });
  gsap.to('.portrait-scroll-layer', {
    y: -60,
    scale: 0.99,
    opacity: 0.95,
    ease: 'none',
    scrollTrigger,
  });
  gsap.to('.hero-greeting', { y: -80, ease: 'none', scrollTrigger });
  gsap.to('.hero-name', { y: -40, ease: 'none', scrollTrigger });
  gsap.to('.hero-note, .hero-role', { '--scroll-right': '-25px', ease: 'none', scrollTrigger });
  gsap.to('.about-visual .project-preview-frame', {
    y: -12,
    ease: 'none',
    scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 1 },
  });
}
