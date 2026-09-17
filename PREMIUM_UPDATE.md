# Aragon — Premium Storytelling Pass / 2026-09-17

## Experience pass
- Hero rebuilt around a pinned editorial stage: premise → friction → build.
- ARAGON wordmark reveals character-by-character on entry and responds to scroll.
- Real Aragon product / infrastructure visuals are layered as an art-directed system rather than a single generic card.
- Preloader rebuilt with letter reveal, progress rail, grid, and shutter transition.
- Crowd story expanded into a four-beat scroll narrative: assumption → noise → real problem → system.
- Crowd fallback asset now uses a transparent cutout derived from the supplied reference image so the people remain visible even if Canvas has a rendering issue.
- Canvas crowd engine now has robust image loading, ResizeObserver, DPR handling, cleanup, and a scene mode.
- Context section now references the visible crowd scene asset instead of the broken black raster.
- Header remains fixed/pill-based with active-section state and mobile navigation.
- Existing project stack, method, agenda, and footer remain intact while the new visual language is layered on top.

## Research direction
The interaction vocabulary was refined against current Skiper UI and Awwwards references around Canvas crowds, scroll storytelling, preloaders, interactive navigation, hero scroll openers, text reveals, horizontal/stacked project interactions, and process narratives. The references reviewed included Skiper 39, Bright Biotech, Stellare Agency, Aerleum, Oaksun Studio, Alejandro Schintu and related Awwwards elements.

## Local verification
- TypeScript/TSX syntax was checked with the installed TypeScript compiler's transpile parser for the edited React files.
- Full `npm install` / production build could not be completed in this environment because npm registry packages were unavailable from the runtime cache.
