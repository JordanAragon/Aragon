# Aragon — V8 UX / Narrative / Content Audit

## Current state

Aragon V8 reorganizes the homepage around a studio-first narrative:

01 — Hero / identity
02 — Problem / what is failing
03 — System / how the pieces connect
04 — What We Build / what Aragon can build
05 — Selected Work / evidence
06 — Process / how the studio works
07 — About Aragon / founder relationship
08 — Lab / current explorations
09 — Contact / action

The primary entity is Aragon. Jordan David Aragon appears as founder, software developer and builder, with his personal portfolio remaining separate.

## Content decisions

- The Hero now defines Aragon explicitly as a Software & Technology Studio.
- Problem remains before technology so the positioning starts from context instead of a tool list.
- The former long Crowd narrative is now a shorter System section with four beats: Problem → Activity → Direction → System.
- Capabilities use the stable concepts Presencia / Sistema / Producto but expose concrete deliverables.
- Selected Work contains real built or operated systems available to describe without inventing commercial outcomes.
- Lab is reserved for concepts, prototypes and explorations.
- About connects Aragon and Jordan without collapsing the two brands.
- Contact is framed as the consequence of the previous sections.

## Visual direction

The V8 visual system intentionally reduces card-like UI and relies more on typography, whitespace, rules, scale, image fields and composition.

The retained motion hierarchy is:

- Primary: hero transitions, system storytelling, project transitions.
- Secondary: hover, image and cursor details.
- Tertiary: microfeedback.

Motion should not compete with the information hierarchy.

## Crowd Canvas

The Crowd Canvas continues to use the Skiper/Open Peeps sprite sheet through the existing external asset reference. V8 reduces the scroll budget substantially so the canvas functions as narrative support rather than the dominant content block.

The current implementation uses a resize event and does not claim ResizeObserver, DPR capping or automatic viewport pausing in this document.

## Work and case studies

Selected Work currently documents:

- AiDEN — a real nursery operations system built with React/Vite/Tailwind and operational data flows.
- Aragon Server — a real self-hosted infrastructure environment operated with Linux, Docker and private services.

The case-study route lives under `/work/[slug]`. Case pages document context, system, stack and status while deliberately avoiding unverifiable commercial metrics.

## Contact

Cal.com remains the scheduling path. The inline form prepares a mailto message in the visitor's email client and does not imply a server-side email backend.

## QA

The release gate is `npm run build`, which runs ESLint, TypeScript and Next.js build. Final experience QA should cover navigation, scroll storytelling, preloader, reduced motion, keyboard behavior, responsive layouts, Cal.com, contact form and work case routes.

Visual browser verification is still required for final desktop and mobile composition because static repository inspection cannot prove every interaction state.
