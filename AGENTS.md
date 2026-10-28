# AGENTS.md — Codex CLI instructions

## Mission

Implement the **Mocking momoshop** take-home as a maintainable, intentionally small frontend prototype. Treat this repository as a long-lived product, not a throwaway screenshot clone. Read `IMPLEMENTATION_PLAN.md` before editing code. The human is the final architect and reviewer.

## Non-negotiable constraints

1. Implement only `/` and `/search/:keyword` in the first pass; support results for `asics` and an empty state for `ascis` through deterministic mock data.
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
- `pages/` composes feature/entity UI for each route.
- `features/search/` owns search form, search behavior and search-specific UI.
- `entities/product/` owns `Product`, `ProductRepository`, mock implementation, and reusable product presentation.
- `data/` owns fixtures; only repository/data adapter should access fixtures directly.
- `shared/` owns truly generic primitives/layout; it must not import from `features`, `entities`, or `pages`.
- Do not introduce cross-feature imports or barrel exports that hide circular dependencies.

## URL and UX contract

- `/` displays a lightweight homepage and a search field.
- Search submit trims input and navigates to `/search/${encodeURIComponent(query)}`. Blank input does not navigate.
- `/search/:keyword` decodes route keyword through router semantics and uses it as canonical state. Refresh/direct navigation works in dev.
- `asics` finds locally seeded products; `ascis` has no matching products. General search uses deterministic case-insensitive matching over product name/brand/tags.
- Results render clear loading, error, empty and success states; avoid stale response overwrites on rapid query changes.
- Existing query params like `?_isFuzzy=0&searchType=1` may be ignored with a documented decision; do not implement fuzzy search by accident.
- Accessible search label, semantic headings, keyboard submission, sensible focus and responsive grid are minimum UX quality.

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
