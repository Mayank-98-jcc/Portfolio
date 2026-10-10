import { siteConfig } from './site';

export const heroVideo = {
  // Order confirmed by Mayank: Professional_portrait_animation, then Create_professional_portrait_vid.
  first: '/videos/mayank-portrait-01.mp4',
  second: '/videos/mayank-portrait-02.mp4',
  // Keep both full clips and their natural studio backgrounds. Counter the
  // baked-in camera push-ins to keep apparent head size steady at the cuts.
  framing: [
    { endSeconds: 10, startScale: 1.15, endScale: 0.84 },
    { endSeconds: 10, startScale: 1, endScale: 0.89 },
  ],
  poster: siteConfig.portrait,
  posterSrcSet:
    '/images/profile/mayank-profile.jpg 900w, /images/profile/mayank-original.png 1254w',
  alt: 'Mayank Thapliyal in a navy blazer',
  preloadAheadSeconds: 3,
} as const;

export type HeroVideoConfig = {
  first: string;
  second: string;
  framing: readonly [PortraitFraming, PortraitFraming];
  poster: string;
  posterSrcSet?: string;
  alt: string;
  preloadAheadSeconds: number;
};

type PortraitFraming = { endSeconds: number; startScale: number; endScale: number };
