# IA Artifacts

These artifacts are the system-level layer that sits before page pattern samples.
They prevent PRD-to-page generation from collapsing a management system into one
oversized workspace page.

## Current Seed Set

- `ia-patterns.json`: reusable information architecture patterns distilled from
  representative admin systems.
- `route-vocabulary.json`: route naming and split rules for common admin verbs.
- `data-quality-control-tower.md`: a worked IA map for the dataset quality
  evaluation PRD.

## How To Use

1. Read `ia-patterns.json` before Product Design Brief.
2. Pick the closest system archetype and page lifecycle sequence.
3. Use `route-vocabulary.json` to name routes by business verbs, not generic
   containers.
4. Write `<output>/DESIGN-BRIEF.md` with one page per verb.
5. Only then scaffold and write pages.

## Hard Rule

A page is allowed to be dense, but it must not own unrelated lifecycle verbs.
If one route tries to import, configure, run, repair, report, and audit, the IA
is wrong before any UI code is written.
