# Aragon — Premium UX / Motion Audit

## Audit focus

The previous iteration had three structural issues: the hero was using several independently positioned narratives in the same visual plane; the crowd section rendered a single composite image instead of the Skiper-style sprite crowd; and the Canvas resize routine was resizing the backing store on every animation frame.

## Corrections applied

### 01 — Hero
- Rebuilt the hero as one sticky stage with three controlled narrative phases.
- Only one narrative phase is visually active at a time; hidden phases do not capture pointer events.
- The main visual is constrained to the stage instead of being allowed to grow outside the viewport.
- The ARAGON wordmark now reveals letter by letter and keeps a restrained terminal-style caret.
- Scroll transforms affect the wordmark, product preview, copy and progress rail as a single composition.
- Mobile uses a separate spatial layout rather than inheriting the desktop offsets.

### 02 — Crowd / Skiper adaptation
- The previous full-width composite artwork is no longer the animation source.
- The Canvas now consumes a true 15 × 7 sprite sheet (`aragon-crowd-sprite.png`), matching the data shape required by the Skiper 39 implementation.
- Characters are independently instantiated, depth-scaled, vertically staggered and sorted by their anchor position.
- Walk cycles are GSAP timelines with horizontal movement + vertical bob.
- The crowd changes walking direction at four scroll-story phases: left → right → right → left → right/left continuation, creating a visual response to the narrative instead of a static placed image.
- The supplied crowd artwork is retained only as a low-opacity end-state texture, not as the main interactive effect.
- Canvas backing dimensions are resized only when the element size or device pixel ratio changes; the previous per-frame resize bottleneck was removed.

### 03 — Preloader
- Asset loading is now based on the actual local visual assets used by the page.
- ARAGON reveals progressively while the assets resolve.
- The progress counter is tied to the loading state instead of being a purely decorative timer.
- Body scrolling is locked during entry and released after the exit transition.
- Timers and animation frames are cleaned up on unmount.

### 04 — Navigation / page composition
- Existing navigation IDs and hash links were checked; no broken internal hash targets were found in the rendered home page.
- Header glass effect was softened so it does not compete with the editorial hero.
- Existing project / method / agenda sections were preserved to avoid breaking their current interaction systems.

## Responsive rules

The hero, crowd stage and preloader have dedicated breakpoints at 1100px, 780px and 520px. The crowd never relies on a fixed viewport-width image being visible outside its clipping stage.

## Performance notes

- Canvas uses a capped DPR of 2.
- The Canvas no longer changes its bitmap width/height on every GSAP ticker frame.
- Crowd depth sorting happens during setup/rebuild instead of every frame.
- All GSAP timelines are killed on cleanup.
- Reduced-motion mode disables the main crowd animation and falls back to the supplied still artwork.

## Verification

- TypeScript/TSX source files were parsed successfully with the TypeScript compiler's transpile parser.
- CSS brace balance was checked: balanced.
- A full `npm install` / Next production build could not be completed in this environment because npm dependency installation timed out; this is an environment limitation, not reported as a successful production build.

## Reference principles

The implementation follows the interaction principles documented by Skiper UI for Skiper 39: Canvas-based crowd, GSAP-driven movement, sprite-sheet characters and automatic sizing. Skiper also explicitly credits Open Peeps for the illustration source and requires attribution for the free component.

The broader narrative system borrows established patterns visible in Skiper's image-reveal / perspective-scroll components and in Awwwards case-study references: pinned scroll storytelling, staged reveals, restrained micro-interactions, and typography used as a structural part of the motion system.
