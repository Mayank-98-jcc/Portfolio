import { siteConfig } from './site';

export const heroVideo = {
  // Order confirmed by Mayank: Professional_portrait_animation, then Create_professional_portrait_vid.
  first: '/videos/mayank-portrait-01.mp4',
  second: '/videos/mayank-portrait-02.mp4',
  // The first source's push-in reaches the top edge near its end. Use its safe
  // first six seconds at 0.6x to retain a ten-second take without cropped frames
  // or the sideways head turn immediately before the cut to the second take.
  // Match head size at the cuts and leave clearance above the perimeter mask.
  framing: [
    { endSeconds: 6, playbackRate: 0.6, startScale: 1.15, endScale: 0.94, offsetY: 1.5 },
    { endSeconds: 10, playbackRate: 1, startScale: 1, endScale: 0.89, offsetY: 1 },
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

type PortraitFraming = {
  endSeconds: number;
  playbackRate: number;
  startScale: number;
  endScale: number;
  /** Percentage of the scene height, independent of viewport size. */
  offsetY: number;
};
