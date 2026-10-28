# AGENTS.md — Codex CLI instructions

## Mission

Implement the **Mocking momoshop** take-home as a maintainable, intentionally small frontend prototype. Treat this repository as a long-lived product, not a throwaway screenshot clone. Read `IMPLEMENTATION_PLAN.md` before editing code. The human is the final architect and reviewer.

## Non-negotiable constraints

1. Implement `/`, `/search/:keyword`, and `/product/:productId`; the human explicitly authorized the product route on 2026-10-28 after the first pass. Support `asics` results and `ascis` empty state through deterministic mock data.
2. **No calls to real momoshop APIs, scraping, authentication, or external production endpoints.** Reference URLs are for comparison only.
3. Use React + TypeScript + Vite + React Router, CSS Modules, pnpm, Vitest and React Testing Library unless the human approves a change.
4. Prefer a single application with feature-oriented modules; **do not add Nx, Redux, Next.js, a UI framework, or a new package without explaining the need and getting approval**.
5. Keep domain models, repository interface, fixtures, UI components, and routing responsibilities separate. Pages are composition layers, not data stores.
6. Favor readable, boring code: strict TypeScript, explicit names, small focused components, no `any` without documented justification, no speculative abstractions.
7. Mock repository must return promises and allow deterministic loading/error/success/empty testing. No network dependency is needed.
8. Preserve meaningful Git history; no force push, reset, rebase, squashing or rewriting commits without explicit human approval.
9. Never claim a test, build, screenshot comparison, or command passed unless it was actually run.
10. Do not copy copyrighted site assets or commit secrets. Use locally authored or permitted placeholder visuals.

## Working protocol

Before each implementation batch:
- State the goal, affected files, acceptance criteria, and tradeoff in 3–6 lines.
- Inspect existing code first. Prefer minimal diffs and reuse current conventions.
- Ask the human only when an architectural decision materially changes scope or dependencies; otherwise make a reasonable documented choice.

After each batch:
- Run targeted tests; run `pnpm lint`, `pnpm test`, and `pnpm build` before final handoff (if configured).
- Report what changed, exact checks and outcomes, limitations, and next action.
- Append a truthful entry to `docs/ai-collaboration.md`; include human review/corrections when they actually occur.
- Commit at coherent boundaries with descriptive messages **if human has authorized agent commits**. If not, propose the exact commit message and let human commit. Never fabricate a Co-authored-by identity; use an accurate agent-assisted note in commit body/log if needed.

## Dependency boundaries

- `app/` composes routes and providers.
- `pages/` composes UI and connects Router state to Business.
- `components/` owns UI layout, product presentation and search form interaction.
- `libs/apiservices/` owns data-source interfaces, adapters and normalized transport types; it must not import Business or UI.
- `libs/store/` owns Business models, pure rules and async state coordination; currently React hooks, no state-management package.
- `libs/utils/` owns UI pure helpers without data-source or Business dependencies.
- `data/` owns fixtures; only the data adapter reads them directly.
- Read `src/libs/README.md` before changing layer ownership. Do not retain parallel entities/features/shared implementations or add barrels that hide circular dependencies.

## URL and UX contract

- `/` displays a lightweight homepage and a search field.
- Search submit trims input and navigates to `/search/${encodeURIComponent(query)}`. Blank input does not navigate.
- `/search/:keyword` decodes route keyword through router semantics and uses it as canonical state. Refresh/direct navigation works in dev.
- `asics` finds locally seeded products; `ascis` has no matching products. General search uses deterministic case-insensitive matching over product name/brand/tags.
- Results render clear loading, error, empty and success states; avoid stale response overwrites on rapid query changes.
- Existing query params like `?_isFuzzy=0&searchType=1` may be ignored with a documented decision; do not implement fuzzy search by accident.
- Accessible search label, semantic headings, keyboard submission, sensible focus and responsive grid are minimum UX quality.

## Product detail contract

- Product cards link to local product detail and retain the originating search path/query for the return link.
- ProductRepository.getById accepts a stable mock ID or product code, resolves detail or null, and preserves configured delay/error behavior.
- Detail loading/error/not-found/success are distinct; obsolete responses cannot overwrite a newer product.
- Color/size/quantity selection and confirmation are local demonstrations, not a cart, checkout or order. Validate options in Business; UI owns draft selection and focus.
- Product code 15745582 maps to a local demo. Reference pages guide structure only; retain original demo names/prices and locally authored artwork.

- Product introduction/specifications/purchase notes are local accessible tabs; tab changes must not alter pathname, query or hash.
- Product recommendations exclude the current item and use deterministic mock candidates. Recently viewed products contain only successful canonical product IDs, deduplicated and capped at eight; persist locally, exclude the current item from display, and offer clear. Storage failure must not break product detail.

## Tests and quality gates

- At least repository search tests and search-route UI tests for success/empty/navigation.
- Test user-observable behavior, not implementation details; avoid snapshots as the only assertion.
- No dead code, unused dependencies, or unfinished TODOs without an issue or explicit documentation.
- If a gate fails, fix it or document the precise failure; never silently skip.
- Keep runtime dependencies minimal and pinned through the lockfile.

## Documentation obligations

Maintain:
- `README.md`: project intent, installation/run/test/build, supported routes, assumptions, tradeoffs summary, known gaps, future work.
- `docs/architecture.md`: module boundaries, dependency direction, data flow, URL state, repository adapter seam.
- `docs/tradeoffs.md`: decisions, alternatives, costs, reversal triggers.
- `docs/ai-collaboration.md`: actual prompts/objectives, agent proposals, human corrections, checks and commit references.
- `IMPLEMENTATION_PLAN.md`: baseline plan; if implementation deviates, document what and why rather than silently rewriting history.

## Priority under time pressure

1. Clean runnable scaffold.
2. Typed mock repository and deterministic data.
3. Homepage + search + empty state.
4. Focused tests and build.
5. Docs, commit hygiene and comparison gaps.
6. Cosmetic polish and bonus work **only if time remains**.

## Stop and escalate

Ask for approval before adding a major framework/dependency, changing the scope, contacting external services, deleting significant work, rewriting Git history, or sacrificing core tests for appearance. If time is exhausted, stop with an honest, reviewable, documented state.

## Completion response format

Provide: (1) implemented scope, (2) changed files, (3) actual commands/checks and outcomes, (4) key tradeoffs, (5) known limitations, (6) commit hashes if present, (7) next recommended step.

## libs layering and inactive examples

When adding or reviewing `src/libs` conventions or examples, read `src/libs/README.md` first. Runtime modules have migrated to these folders under the human-approved mapping in `docs/layer-migration.md`. Files ending `.example.ts.md` remain documentation only. Keep the existing mock behavior and package dependencies unless the human authorizes a further change.
