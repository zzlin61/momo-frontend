# AGENTS.md — Project instructions

## Read before editing

Use [README.md](README.md) for delivered scope and commands, [docs/architecture.md](docs/architecture.md) for current responsibilities, and [DESIGN.md](DESIGN.md) before UI work. [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) is the preserved initial baseline; later human-authorized changes are summarized at its top. The human remains the final architect and reviewer.

When changing libs ownership or examples, read [src/libs/README.md](src/libs/README.md). Files ending .example.ts.md are inactive documentation, not runtime modules.

## Constraints

1. Support /, /search/:keyword and /product/:productId using deterministic local data. asics has results; ascis has none.
2. Do not call real momo APIs, scrape the site, or add external production endpoints. Reference pages are comparison material only.
3. Keep React, strict TypeScript, Vite, React Router, CSS Modules, pnpm, Vitest and React Testing Library. Explain and obtain human approval before adding a package or changing the stack. No state-management package is installed.
4. Keep source adapters, Business rules, UI and fixture responsibilities separate; pages compose views and Router connections.
5. Prefer explicit names and focused modules; no undocumented any, speculative frameworks or parallel legacy implementations.
6. Preserve Promise-based mock data, deterministic delay/error behavior and race protection. No network dependency is required.
7. Keep meaningful Git history. Do not force-push, reset, rebase, squash or rewrite commits without explicit authorization.
8. Use locally authored/permitted assets and never commit secrets.
9. Report only checks actually run; distinguish tests, static checks and browser evidence.

## Current ownership

- app: routes, composition, default adapter injection and global styles.
- pages/components: UI composition, presentation, form drafts, focus and tabs.
- libs/apiservices: data-source interfaces, adapters, normalized types and browser storage; no Business/UI imports.
- libs/store: Business models, pure rules and async React hooks; no UI imports.
- libs/utils: UI pure functions without data-source or Business dependencies.
- data: fixtures, read directly only by the adapter.
- Preserve UI → Business → data-source interface direction; app selects the concrete adapter. Do not restore entities/features/shared copies or hide cycles with barrels.

## Behavior contracts

- Search trims explicit submission; blank input or IME composition does not navigate. Clear returns home and preserves field focus.
- Router owns keyword/sort/brand and product ID; do not introduce a second independently editable canonical copy.
- Match local names/brands/tags case-insensitively, without fuzzy matching. Legacy reference query parameters do not affect data lookup.
- Separate loading/error/retry/empty/success and product not-found; ignore obsolete responses.
- Cards link to detail. Preserve the internal originating home/search path and query for return; use brand-search fallback when state is absent.
- getById accepts stable mock ID or product code. Code15745582 identifies a local demo, not an official live catalogue entry.
- Color/size/quantity and confirmation are page-local demonstrations. Business validates options and totals; no checkout/cart/order is implemented.
- Product tabs use local state and accessible keyboard behavior; changing tabs must preserve pathname/query/hash.
- Recommendations exclude the current product, deduplicate, prioritize the same brand and cap at four.
- Recently viewed history records successful canonical IDs only, newest first, unique, capped at eight. Persist locally, exclude current from display, offer clear and tolerate storage failure; no external transmission.
- Maintain native semantics, accessible names, visible focus, responsive layout and honest action labels.

## Implementation batches

Before work, state goal, affected files, acceptance and tradeoff in 3–6 lines; inspect existing code. Ask only for material scope/dependency decisions not already authorized.

After work:
- Run targeted verification and the configured layer/type/test/build checks; use [docs/verification.md](docs/verification.md).
- For changed UI, exercise the browser workflow when available; do not infer visual parity from code.
- Update relevant current docs and append factual objective, human corrections, commands/results, limitations and next step to docs/ai-collaboration.md.
- Commit at coherent boundaries when human authorization covers agent commits. Otherwise propose the exact message. Use accurate attribution; do not invent Co-authored-by identities.
- State actual scope, checks, remaining limitations and commit references in handoff.

## Documentation lifecycle

Maintain current README, architecture, tradeoffs, comparison, verification and DESIGN together with changes. Use [docs/README.md](docs/README.md) to distinguish current documents from completed plans and historical logs.

Preserve original planning and contemporaneous agent results; add status/context rather than rewriting old events. Example docs must remain clearly marked inactive until explicitly migrated.

## Parallel work and escalation

Use independent worktrees only for authorized parallel/isolation work; keep agent file ownership separate, integrate coherent commits and validate the combined main checkout. Vitest is scoped to src so nested worktrees are not counted.

Escalate new frameworks/dependencies, destructive or irreversible actions, Git history rewriting, external production integration or weakening core tests. Routine reversible implementation choices within authorized scope do not require another confirmation.
