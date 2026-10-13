# Cinematic portfolio implementation report

Updated: 13 October 2026. Workspace: `/Users/mayankthapliyal/Portfolio`.

The existing React/TypeScript/Vite portfolio now has a genuine Three.js hero environment while retaining its editorial typography, real portrait player, project content, section architecture, navigation, and contact behavior.

## Implementation

- Added a lazily loaded React Three Fiber scene: three interlocking orange ribbons, two orbital rings with moving nodes, faceted satellites, warm lights, restrained depth particles, and a fine CSS grid.
- Kept the actual portrait in its separate native video layer. Inspected decoded frames from both source clips; they contain opaque studio backgrounds. The scene is composed around that background, with its own lower fade so orange geometry does not show through the jacket fade. No media files, facial features, or player framing parameters were changed.
- Retained the established heading/portrait placement. Removed their independent pointer/scroll offsets so the camera and background now supply depth without detaching the portrait or moving the heading toward the header. Kept the entrance and video animations; shortened the coordinated entrance to approximately 2.3 seconds.
- Added supporting identity text, a working View My Work anchor, a keyboard-accessible Quick Intro dialog, and the email link. The intro is explicitly text, because the supplied clips are silent portraits rather than a spoken introduction.
- Added restrained project-artwork tilt for mouse/fine-pointer devices. Reduced-motion and touch layouts keep static cards. Project screenshots, descriptions, technology lists, completed/in-progress statuses, live links, and dialogs remain intact.
- Applied the supplied ivory/cream/orange palette and expanded the About copy with the supplied DSA and Generative AI learning interests. Reviewed the remaining sections and retained their intentional spacing and truthful content.

A final scroll-return check also exposed a pre-existing active-navigation bug: the percentage-based IntersectionObserver band could collapse on wide, short viewports and leave Work selected at the top. Navigation now selects the section beneath the measured sticky header on scroll/resize, including Home after returning to zero. The regression also exposed a duplicated anchor offset: Lenis added another 80 pixels beyond the existing 90-pixel CSS scroll padding. Lenis now uses that existing CSS padding as the single source for anchor clearance.

## Rendering and fallback behavior

There is one decorative canvas. Its chunk loads separately from the HTML interface. The scene contains no external models, texture downloads, shadow maps, or postprocessing. Mobile reduces geometry subdivisions and particles (12 versus 32 after the polish pass below), disables antialiasing, and caps DPR at 1; desktop caps it at 1.5. The production scene chunk is approximately 238 kB gzip, loaded only when motion is allowed.

Fiber's frame loop stops offscreen and in hidden tabs. Shared ribbon/satellite geometries and materials have explicit disposal; Fiber disposes the remaining scene resources. Effect cleanup removes ScrollTriggers, observers, and pointer/visibility/context listeners. Camera and mesh motion use frame callbacks without per-frame React state updates.

Reduced motion creates no canvas and does not request the optional scene module. A static CSS sculpture and orbit composition remains. An error boundary protects the rest of the application from renderer initialization failure; context loss removes the canvas and reveals the same fallback.

## Dependencies added

| Dependency           | Version   | Purpose                                                 |
| -------------------- | --------- | ------------------------------------------------------- |
| `three`              | `0.182.0` | Geometry, lighting, materials, camera, WebGL rendering  |
| `@react-three/fiber` | `^9.8.1`  | React-compatible scene lifecycle and shared render loop |
| `@types/three`       | `0.182.0` | TypeScript definitions, development dependency          |

Three.js and its types are pinned together because the installed Fiber version still internally uses `THREE.Clock`, deprecated beginning with r183. The initial newest-version trial exposed that warning in the existing browser-console regression test. Pinning the compatible pair resolves it without suppressing console warnings. No Drei or additional animation library was added. npm reported zero known vulnerabilities at installation.

## Changed files

| File                                       | Change                                                                                                             |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `src/components/hero/HeroEnvironment.tsx`  | New lazy scene boundary and static fallback composition                                                            |
| `src/components/hero/HeroScene.tsx`        | New scene geometry, lighting, camera interaction, scroll progress, rendering lifecycle and disposal                |
| `src/components/hero/HeroIntro.tsx`        | New truthful introduction dialog with focus containment/restoration and Escape support                             |
| `src/components/layout/Navbar.tsx`         | Reliable active-section tracking using the actual sticky header position                                           |
| `tests/socials.spec.ts`                    | New active-navigation regression across all five requested viewport sizes                                          |
| `src/components/hero/Hero.tsx`             | Environment integration, grouped identity, supporting copy, actions and email link                                 |
| `src/styles/hero-scene.css`                | New scene/fallback layering, independent environment fade, responsive identity/actions and dialog styling          |
| `src/styles/hero-composition.css`          | Remove the obsolete inset reserved for the former background pointer offset                                        |
| `src/animations/editorial.ts`              | Shorter coordinated entrance; depth motion moved off the portrait and heading                                      |
| `src/components/experience/Experience.tsx` | Shorter loader, removal of independent portrait/text pointer transforms, and a single CSS-controlled anchor offset |
| `src/hooks/useProjectTilt.ts`              | New fine-pointer-only artwork interaction                                                                          |
| `src/components/projects/Projects.tsx`     | Dedicated tilt wrapper around existing artwork buttons                                                             |
| `src/styles/projects.css`                  | Restrained CSS perspective interaction isolated from GSAP card reveals                                             |
| `src/components/about/About.tsx`           | Supplied DSA and Generative AI interests in the existing introduction                                              |
| `src/styles/variables.css`                 | Updated warm palette; retained sufficient muted-text contrast                                                      |
| `src/styles/globals.css`                   | Navigation background aligned with the ivory palette                                                               |
| `src/main.tsx`                             | Import scene styles after existing hero composition styles                                                         |
| `index.html`                               | Browser theme color matches the new ivory                                                                          |
| `package.json`                             | Three.js/Fiber/type dependencies                                                                                   |
| `package-lock.json`                        | Reproducible dependency resolution                                                                                 |
| `tests/hero-scene.spec.ts`                 | New renderer lifecycle, fallback, reduced-motion, dialog and accessibility coverage                                |
| `README.md`                                | Current architecture, timings, renderer behavior and dependency compatibility notes                                |
| `IMPLEMENTATION_REPORT.md`                 | This implementation and validation report                                                                          |

Original portrait, video, project screenshots, and project data remain unchanged. Existing tests were retained and extended. No commit, push, or deployment was performed.

## Validation

Full-suite result before the final navigation correction: **177 passed, 13 intentionally skipped, 0 failed** in 4.6 minutes. The 13 pre-existing skips scope desktop-only or engine-specific cases to the appropriate configurations; all test files were included. Configurations: desktop Chrome, mobile Chrome, small mobile Chrome, desktop WebKit, and iPhone WebKit emulation.

- Production build completed with TypeScript compilation and Vite bundling. A separate smoke test of the compiled site at `http://127.0.0.1:4173` verified the lazy scene, actions, dialog, portrait sequence, and reduced-motion fallback in Chrome and WebKit. At all five requested viewports, both engines reported zero console warnings/runtime errors and no horizontal overflow.
- ESLint and Prettier checks passed.
- Fresh screenshots were captured at scroll position zero during entrance and after settling at 1440×900, 1280×800, 1024×768, 768×1024, and 390×844. The heading remains visible below the navigation; no horizontal overflow was found.
- Inspected desktop, tablet, mobile, and reduced-motion screenshots, plus project cards, About, process, skills, education, learning, and contact. Intentional whitespace and the existing section order remain.
- Tests exercise actual first→second→first portrait playback, decoded hair clearance in the first ten seconds, delayed/failed clips, denied autoplay, reduced motion, resizing, scroll return, and heading glyph visibility.
- New tests count real WebGL draw calls to verify pause/resume and rendering cleanup, test unavailable WebGL and actual context loss, and verify dialog focus, controls and automated accessibility.
- Existing tests cover navigation, real screenshots/fallbacks, truthful project status, exact external URLs, gallery controls, keyboard skill disclosures, contact draft encoding, and automated WCAG A/AA checks.
- Both supplied completed-project demo URLs returned HTTP 200 during the live-link check. This verifies endpoint availability, not every feature inside those separate applications.

Fresh screenshots and geometry/production reports are stored temporarily in `/tmp/cinematic-review/`.

After the navigation and anchor-offset corrections, the targeted follow-up suite finished with **64 passed, 6 intentional skips, 0 failed** in 1.8 minutes (`socials.spec.ts`, `portfolio.spec.ts`, and `hero-heading.spec.ts`). It includes the new navigation regression in all five browser configurations, exercising every requested viewport, plus existing navigation, accessibility, dialogs, heading visibility, video handoffs, and return-to-top behavior. The standalone WebGL/portfolio follow-up cases also passed. Build, lint, and formatting were rerun successfully after the final code change. A compiled-production check confirmed Home → Work → Home at scroll position zero.

## Remaining limitations

- The portrait clips have baked-in studio backgrounds and different poses/lighting. True transparent separation around hair requires properly matted footage; CSS cannot supply it. The existing safe segment and clean-cut controller are preserved, so the two takes are not represented as a perfectly continuous performance.
- WebGL adds an optional download and GPU work. Browser emulation and local rendering were tested; physical mobile devices, low-end hardware, battery impact, and a production Lighthouse audit were not tested.
- Contact opens an email draft and requires the visitor to send it. There is no email backend or delivery confirmation.
- CodeMentor AI remains in progress with explicitly conceptual artwork. No real introduction video, résumé PDF, certifications, or production domain was supplied; none was fabricated.
- The site remains a local/static build. Canonical and absolute social-image URLs still need a real public domain when publishing.

## Focused hero polish — 13 October 2026

This follow-up preserves the existing composition, fonts, portrait sources/player, masks, GSAP entrance, navigation, and all other sections. The earlier file list and suite results above describe the preceding implementation, not additional changes in this pass.

### Causes addressed

- The orange form is three interlocking torus ribbons, not a solid sphere. Uniform materials and strong ambient/fill lighting flattened its shading. Retained the geometry and added a shared procedural 64×64 bump/roughness texture, a hemisphere light, and balanced key/fill/rim lighting. No geometry subdivisions were increased and no postprocessing or dependencies were added.
- Orbit planes were fixed while their nodes moved. The existing two planes now precess slowly at different bounded rates and depths; nodes share geometry/materials. Their lower opacity keeps the typography dominant.
- Existing particles rotated as one rigid field. They now drift individually at multiple depths, with opacity reduced and counts lowered from 42/18 to 32/12 for desktop/mobile. One points draw, buffer, and material remain.
- Pointer input checked device capability but did not filter individual touch events or reset a stale target after capability/viewport changes. Mouse-only desktop input is now clamped and resets on leave, resize, media-query change, and tab visibility change. The existing exponential camera interpolation remains; no portrait transforms were added.
- Grid line alpha decreased from 18/255 to 13/255 (about 28%). The cream/orange atmosphere and independent scene/portrait masks remain unchanged.

Both actual source clips and rendered frames were inspected. Their opaque studio backgrounds and slightly different poses are source limitations. The current lower mask preserves the face and most of the blazer, so no additional portrait fade or framing changes were warranted. The existing decoded-frame cuts avoid facial crossfades but cannot make two separate takes perfectly continuous.

### Files changed in this pass

| File                                | Change                                                                                                                                              |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/hero/HeroScene.tsx` | Surface detail, lighting, orbit motion, sparse particle drift, shared node resources, and guarded pointer input                                     |
| `src/styles/hero-scene.css`         | Lower grid contrast only                                                                                                                            |
| `tests/hero-scene.spec.ts`          | Pointer regression observes actual rendered particle model-view matrices; checks mouse response, touch rejection, reset, and stable portrait bounds |
| `README.md`                         | Updated scene resource, particle, and interaction details                                                                                           |
| `IMPLEMENTATION_REPORT.md`          | This follow-up report                                                                                                                               |

### Checks performed

- Production build passed; TypeScript and Vite completed. The optional scene chunk is 238.50 kB gzip.
- Existing `hero-scene`, `hero-heading`, and `hero-video` suites: **93 passed, 7 intentional browser/device-specific skips** across five browser configurations.
- New pointer regression: **5 passed** across the same configurations. Its initial instrumentation targeted an optimized-out shader uniform; it was corrected to observe the particle model-view matrix before the successful run.
- Fresh compiled-production screenshots captured and visually inspected in Chrome and WebKit at **1440×900, 1280×800, and 390×844**, including entrance, settled playback, second clip, looping, scroll return, and reduced-motion samples.
- Production playback observed first → second → first at each viewport in both engines. Portrait containers stayed fixed; the heading remained clear. Work links scrolled to the project section, and returning to the top resumed rendering at scroll position zero.
- All six production browser/viewport combinations reported **zero console warnings/runtime errors and no horizontal overflow**. Reduced motion removed both canvas and videos.
- Existing tests additionally exercise head clearance throughout the first ten seconds, autoplay rejection, missing/delayed media, responsive resizing, WebGL failure/context loss, and offscreen/hidden-tab cleanup. Heading/layout regression coverage also includes 1024×768 and 768×1024.
- ESLint, targeted Prettier checks, and `git diff --check` passed. Browser emulation was used; physical mobile GPU performance and battery impact were not measured.

Temporary screenshots, capture script, and production observations: `/tmp/hero-polish/`. Browser test logs: `/tmp/hero-polish-tests.log` and `/tmp/hero-polish-pointer-tests.log`.
