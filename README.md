# Mayank Thapliyal — Cinematic Editorial Portfolio

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
- A coordinated GSAP entrance completes in about 2.3 seconds, with the preloader gone at about 1.05 seconds. Reduced-motion visitors skip both. The heading and portrait stay anchored during scrolling and pointer movement.
- A lazy-loaded Three.js / React Three Fiber environment adds three interlocking orange ribbons, two orbital paths and moving nodes, faceted satellites, warm lighting, and sparse depth particles. The portrait stays a separate HTML video layer. A restrained camera responds to fine pointers and ScrollTrigger progress.
- WebGL rendering pauses offscreen and in hidden tabs. Mobile uses lower geometry complexity, 12 particles instead of 32, no antialiasing, and DPR capped at 1 (desktop cap 1.5). One shared procedural 64×64 texture adds restrained surface grain; there are no external models, texture downloads, shadows, or postprocessing. Reduced-motion visitors do not download the scene module or create a canvas. Initialization failure and context loss leave the static CSS composition visible. Shared ribbon/satellite/node geometry, materials, and texture are explicitly disposed; Fiber owns the remaining canvas resources; effect cleanup removes observers, listeners, and ScrollTriggers.
- The two orbit planes precess within small angular bounds at different rates. Particles drift independently behind the foreground content. Camera parallax accepts only mouse input on desktop fine-pointer devices, eases back on pointer leave, and resets its target when the viewport, input capability, or tab visibility changes.
- “View My Work” links to the real project section. “Quick Intro” opens an accessible text introduction, since no spoken introduction video is supplied. GitHub, LinkedIn, and email remain direct links.
- GSAP ScrollTrigger section reveals, scroll progress, a desktop cursor, subtle project-artwork tilt, and Lenis wheel scrolling. Touch scrolling remains native. Motion and observers are cleaned up on unmount or preference changes.
- A sticky navigation bar and a native mobile navigation dialog with focus containment, Escape handling, and scroll restoration.
- Staggered project cards with real existing ResumeIQ and OceanXplore screenshots. CodeMentor AI uses clearly labeled typographic concept artwork and remains in progress.
- Lazy-loaded native project dialogs with descriptions, technologies, planned/completed capabilities, screenshots, and the exact supplied live URLs. Missing repository links are omitted.
- Editorial about, education, current learning, capabilities, and contact sections. A four-step “How I Build” timeline describes the learning and project-building process. Skill rows expand with native, keyboard-accessible disclosure controls to reveal descriptions and individual technology context. There are no invented employers, clients, metrics, or credentials.
- A responsive gallery of actual ResumeIQ and OceanXplore screenshots, with full-size image links. Desktop scrolling gently advances the gallery through GSAP; direct interaction takes over immediately. Swipe, trackpad, and previous/next controls also navigate it.
- A contact form inside an expandable panel. It validates required fields and opens the visitor’s email app with an encoded draft. It does not transmit messages or claim delivery.
- The résumé link appears only when `public/resume.pdf` exists at build time. Add a valid PDF and rebuild to enable it.
- Certifications render only when real entries are added to `src/data/certifications.ts`. Certificate images are optional.

Three.js is pinned to `0.182.0` with matching types because Fiber 9 still uses `THREE.Clock`, deprecated in Three.js r183. Upgrade this pair together when Fiber adopts the replacement timer. The scene has no dependency on Drei.

## Content and styling

| Content                                         | Location                                    |
| ----------------------------------------------- | ------------------------------------------- |
| Identity and portrait                           | `src/data/site.ts`                          |
| Hero video sources, fallback and timings        | `src/data/hero.ts`                          |
| Video sequencing and lifecycle                  | `src/components/hero/HeroPortraitVideo.tsx` |
| Editorial composition and responsive refinement | `src/styles/editorial-refinement.css`       |
| Entrance and scroll animation utilities         | `src/animations/editorial.ts`               |
| Video blending and grain                        | `src/styles/hero-video.css`                 |
| Responsive hero composition                     | `src/styles/hero-composition.css`           |
| 3D scene, camera and lifecycle                  | `src/components/hero/HeroScene.tsx`         |
| Lazy renderer boundary and static fallback      | `src/components/hero/HeroEnvironment.tsx`   |
| Scene styling and hero actions                  | `src/styles/hero-scene.css`                 |
| Accessible introduction                         | `src/components/hero/HeroIntro.tsx`         |
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

To add a real CodeMentor AI screenshot, place it at `public/images/projects/codementor-ai/preview.png`. In its `src/data/projects.ts` entry, set `image` to `/images/projects/codementor-ai/preview.png`, change `imageKind` to `screenshot`, and update `imageAlt`, `imageNote`, and `previewLabel` to describe that actual capture. The card and dialog share the same renderer; a failed screenshot returns to the labeled concept graphic. Keep `status: 'In Progress'` and the empty demo URL until a real public release is available. Adding a screenshot does not mark the project completed.

Project descriptions reflect the supplied project information. Screenshot UI numbers are not portfolio performance claims. CodeMentor capabilities and architecture remain explicitly planned. The cinematic enhancement follows the supplied cream/orange editorial reference while retaining the existing content and real portrait.

## Portrait video

The source order is **Professional_portrait_animation_20261008174911.mp4** followed by **Create_professional_portrait_vid…\_20261008175317.mp4**, as selected by Mayank. Public assets are `public/videos/mayank-portrait-01.mp4` (about 1.64 MB) and `mayank-portrait-02.mp4` (about 1.75 MB). Both retain their original 1280×720, 24 fps H.264 picture streams; audio tracks are removed and MP4 metadata is placed first for progressive playback. The original Downloads files remain untouched.

`HeroPortraitVideo` uses two stacked native video elements for an approximately 20-second loop. The first clip uses its first 6 source seconds at 0.6× speed, followed by all 10 seconds of the second clip at normal speed. This avoids the first take’s native hair crop and larger head turn near its end. Only the active clip plays; standby loading begins with 3 source seconds remaining. A frame-ready direct handoff keeps one fully opaque face visible, avoiding double-face crossfades. Uniform framing correction counteracts each source's camera push-in without stretching facial proportions. The two independent takes differ in pose and lighting, so their cuts are not perfectly invisible. Near the end of the first source, the very top of the hair is already cropped in the original footage; CSS cannot restore those missing pixels; the player therefore switches before that unsafe source tail.

Playback pauses when the portrait is offscreen or the tab is hidden. Reduced-motion mode creates no video elements or video requests. Both videos have inline/muted/loop behavior; only the initial slot uses the native autoplay attribute, and the controller starts the standby at its turn. Autoplay rejection preserves the poster. A failed clip is skipped when the other can play; a late or failed standby leaves the healthy clip looping. Both failures restore the portrait. All frame callbacks, timers, observers and event listeners are cleaned up.

The portrait container retains its 4:3 dimensions in every state. Videos use centered `object-fit: cover` to crop the landscape backgrounds without stretching the face. Both native backgrounds are opaque: the videos have warm studio backgrounds and the original poster has a cool gray backdrop. Broad scene-edge gradients fade their sides and lower jacket into the page. There is no hair/ear outline tracing, silhouette polygon, face filtering, or per-frame background removal. The former threshold-generated outlines cut through fine hair and created the pasted-on appearance; those unused tracks and their generator have been removed. All original media remains unchanged. True transparent overlap behind the hair would require carefully matted replacement footage. No controls or media-player chrome are exposed; identity, role and other essential information remain HTML text.

## Validation

Playwright covers desktop Chrome, mobile Chrome, small mobile, desktop WebKit, and iPhone WebKit emulation. Tests check image loading, runtime errors, widths from 320 to 1920px, exact project and social URLs, native dialogs and focus restoration, mobile navigation, gallery controls, keyboard-operated skill disclosures, the four-step building timeline, reduced motion, résumé absence, and automated WCAG A/AA checks. Video-specific tests cover actual first→second→first playback, deferred downloads, blocked autoplay, delayed responses, source failures, visibility/offscreen pausing, reload, resizing, and live reduced-motion preference changes. Additional WebGL tests count actual draw calls, exercise resizing and offscreen/tab pausing, toggle reduced motion to verify canvas cleanup, simulate unavailable WebGL and context loss, and check the new introduction dialog. Heading tests measure actual font bounds at the five target viewports and compare rendered ink against portrait overlap. External project navigation is intercepted in tests so the suite does not depend on third-party deployment availability.

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
