# Mayank Thapliyal — Editorial Portfolio

A personal React/TypeScript portfolio for Mayank Thapliyal, an MCA student at GGSIPU (2026–2028). Warm cream, black typography, soft orange light, Instrument Serif, and Anton establish the editorial design.

## Run locally

Use Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

Vite serves the app at `http://localhost:5173` by default.

```sh
npm run build
npm run preview
npm run lint
npm run format:check
npm run test:e2e
```

The production output is `dist/`, ready for static hosting. No server, API keys, or runtime external fonts are required. Configure the host with build command `npm run build` and publish directory `dist`.

## Experience

- A layered hero with two supplied 10-second portrait clips playing as one silent, inline sequence. The original static portrait appears while loading, when autoplay is denied, on media failure, and for reduced-motion visitors. Warm gradients, oversized type, soft video masks, and faint editorial grain preserve the composition.
- A short GSAP intro (about 1.85 seconds), followed by hero entrances. Reduced-motion visitors skip the preloader and animation. Content remains usable while the intro plays.
- GSAP ScrollTrigger section reveals, scroll progress, desktop pointer interactions, restrained mouse/scroll parallax, and Lenis wheel scrolling. Touch scrolling remains native. Motion and observers are cleaned up on unmount or preference changes.
- A sticky navigation bar and a native mobile navigation dialog with focus containment, Escape handling, and scroll restoration.
- Staggered project cards with real existing ResumeIQ and OceanXplore screenshots. CodeMentor AI uses clearly labeled typographic concept artwork and remains in progress.
- Lazy-loaded native project dialogs with descriptions, technologies, planned/completed capabilities, screenshots, and the exact supplied live URLs. Missing repository links are omitted.
- Editorial about, education, current learning, capabilities, and contact sections. A four-step “How I Build” timeline describes the learning and project-building process. Skill rows expand with native, keyboard-accessible disclosure controls to reveal descriptions and individual technology context. There are no invented employers, clients, metrics, or credentials.
- A responsive gallery of actual ResumeIQ and OceanXplore screenshots, with full-size image links. Desktop scrolling gently advances the gallery through GSAP; direct interaction takes over immediately. Swipe, trackpad, and previous/next controls also navigate it.
- A contact form inside an expandable panel. It validates required fields and opens the visitor’s email app with an encoded draft. It does not transmit messages or claim delivery.
- The résumé link appears only when `public/resume.pdf` exists at build time. Add a valid PDF and rebuild to enable it.
- Certifications render only when real entries are added to `src/data/certifications.ts`. Certificate images are optional.

## Content and styling

| Content                                         | Location                                    |
| ----------------------------------------------- | ------------------------------------------- |
| Identity and portrait                           | `src/data/site.ts`                          |
| Hero video sources, fallback and timings        | `src/data/hero.ts`                          |
| Video sequencing and lifecycle                  | `src/components/hero/HeroPortraitVideo.tsx` |
| Editorial composition and responsive refinement | `src/styles/editorial-refinement.css`       |
| Entrance and scroll animation utilities         | `src/animations/editorial.ts`               |
| Video blending and grain                        | `src/styles/hero-video.css`                 |
| Portrait display mask                           | `src/data/portrait.ts`                      |
| Exact personal URLs                             | `src/data/socials.ts`                       |
| Projects, statuses, screenshots, demos          | `src/data/projects.ts`                      |
| Building process                                | `src/data/process.ts`                       |
| Section layouts and interactions                | `src/styles/sections.css`                   |
| Technical skills                                | `src/data/skills.ts`                        |
| Education                                       | `src/data/education.ts`                     |
| Certifications                                  | `src/data/certifications.ts`                |
| Navigation                                      | `src/data/navigation.ts`                    |
| Colors and fonts                                | `src/styles/variables.css`                  |
| Layout and responsive breakpoints               | `src/styles/globals.css`                    |
| Project cards and dialogs                       | `src/styles/projects.css`                   |
| Intro, scrolling and reveals                    | `src/components/experience/Experience.tsx`  |
| Intro/cursor and reduced-motion styles          | `src/styles/animations.css`                 |

The supplied portrait is stored at `public/images/profile/mayank-original.png`. Its existing optimized JPEG is used for smaller resolutions. The real project screenshots are at `public/images/projects/{resumeiq,oceanxplore}/preview.png`. A screenshot's original aspect ratio is preserved. Project-specific fallback artwork and text handle missing images without broken controls.

Project descriptions reflect the supplied project information. Screenshot UI numbers are not portfolio performance claims. CodeMentor capabilities and architecture remain explicitly planned. No distinct design-reference attachment was available; the design follows the written editorial brief.

## Portrait video

The source order is **Professional_portrait_animation_20261008174911.mp4** followed by **Create_professional_portrait_vid…\_20261008175317.mp4**, as selected by Mayank. Public assets are `public/videos/mayank-portrait-01.mp4` (about 1.64 MB) and `mayank-portrait-02.mp4` (about 1.75 MB). Both retain their original 1280×720, 24 fps H.264 picture streams; audio tracks are removed and MP4 metadata is placed first for progressive playback. The original Downloads files remain untouched.

`HeroPortraitVideo` uses two stacked native video elements. Only the active clip plays; the standby starts loading around second 7. The outgoing frame stays fully opaque beneath the incoming layer until its fade completes, avoiding transparency through the face. A 150 ms crossfade joins the clips, making the sequence approximately 20 seconds including overlap. The source clips contain different framing and camera push-ins: the crossfade softens those differences, but cannot make independently generated footage a perfectly matched continuous take without altering its content.

Playback pauses when the portrait is offscreen or the tab is hidden. Reduced-motion mode creates no video elements or video requests. Both videos have inline/muted/loop behavior; only the initial slot uses the native autoplay attribute, and the controller starts the standby at its turn. Autoplay rejection preserves the poster. A failed clip is skipped when the other can play; a late or failed standby leaves the healthy clip looping. Both failures restore the portrait. All frame callbacks, timers, observers and event listeners are cleaned up.

The portrait container retains its dimensions in every state. Videos use centered `object-fit: cover` to crop the landscape backgrounds without stretching the face. The original image's silhouette mask is used only for the fallback. Each video has a matching `.mask.json` outline track, loaded alongside its clip and applied with a display-only CSS polygon on each decoded frame. This keeps the head opaque and the greeting behind it; a separate vertical mask fades only the lower jacket. If an outline cannot load, a soft perimeter mask remains available. Source video files are unchanged. The outlines can be regenerated with `python3 scripts/trace-portrait-masks.py` (requires OpenCV and NumPy), using thresholds calibrated for these two clips. Replacement footage requires regenerating and visually checking its outlines. No controls or media-player chrome are exposed; identity, role and other essential information remain HTML text.

## Validation

Playwright covers desktop Chrome, mobile Chrome, small mobile, desktop WebKit, and iPhone WebKit emulation. Tests check image loading, runtime errors, widths from 320 to 1920px, exact project and social URLs, native dialogs and focus restoration, mobile navigation, gallery controls, keyboard-operated skill disclosures, the four-step building timeline, reduced motion, résumé absence, and automated WCAG A/AA checks. Video-specific tests cover actual first→second→first playback, deferred downloads, blocked autoplay, delayed responses, source failures, visibility/offscreen pausing, reload, resizing, and live reduced-motion preference changes. External project navigation is intercepted in tests so the suite does not depend on third-party deployment availability.

Chrome should be installed locally. For WebKit:

```sh
npx playwright install webkit
npm run test:e2e
```

These checks use browser engines and mobile emulation, not physical devices. Automated accessibility testing supplements keyboard and visual checks; it is not full accessibility certification.

## Publication

The site is prepared as a local/static build. It has not been deployed to an external hosting provider. Once the public domain is known, add a canonical URL and make the Open Graph image URL absolute in `index.html`. The current social preview uses a local image path. The default Vite configuration assumes domain-root hosting; subpath hosting requires updating the base and asset URLs.

## Rights

No open-source license is granted for the original portfolio code, copy, or personal photograph. Dependencies retain their respective licenses. Existing technology marks are from Devicon; their license remains at `public/images/technologies/LICENSE.txt`.
