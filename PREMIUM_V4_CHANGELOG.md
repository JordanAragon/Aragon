# Aragon Premium V4

## What changed

The hero and crowd systems were rebuilt around a single scroll narrative instead of independent decorative animations.

### Hero
A single sticky 100svh stage now drives the story. The large ARAGON wordmark, product view and headline share one timeline. Three phases are intentionally mutually exclusive so the page cannot show multiple hero stories stacked on top of each other.

### Crowd
The main crowd renderer now uses a real 15×7 sprite sheet. Each person is instantiated independently and receives its own scale, depth, vertical offset, direction and GSAP walk timeline. The scroll progress changes the global flow direction at story beats, so the crowd physically turns with the narrative.

### Preloader
The entry sequence preloads the exact local hero/crowd assets used by the page and reveals ARAGON while they resolve.

### Performance
Canvas bitmap dimensions are only changed when size/DPR changes. Crowd depth sorting happens on setup/rebuild, not every animation frame. GSAP timelines are cleaned on unmount.

### Responsive
Desktop/tablet/mobile use separate placement rules for the hero and crowd stage. Oversized image assets are clipped by their own stage rather than relying on viewport-wide overflow.

### Build fixes
The V4 progress indicators now use Motion elements for Motion-only `scaleX` styles, which keeps strict TypeScript checks valid under React DOM typings. The malformed `.hero-v4-phase-main` CSS declaration was also repaired so Turbopack can parse `app/premium.css` successfully.
