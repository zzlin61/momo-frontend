# Momo Frontend Take-home — Implementation Plan

> Status: Phase 1 planning draft. Owner: human candidate. Implementation agent: Codex CLI. Date: 2026-10-28.

## 1. Assignment and interpretation

Source: `Senior_Principal_Frontend_Takehome_Eval_Tw.pdf`, option A — Mocking momoshop.

- Pure frontend. **Never call real momoshop APIs**. Custom typed mock data is permitted.
- Routes: at least one; selected scope is `/`, `/search/:keyword` including successful and empty results.
- The evaluation values architecture, maintainability, delivery judgment, gap analysis versus the real site, agent collaboration and commit history more than pixel perfection.
- Phase 1 planning ~1 hour; Phase 2 implementation ~1–2 hours, measured from first implementation commit or ~120 minutes thereafter. Record actual timestamps; do not claim a timing that did not occur.
- Deliver Git repository or ZIP **including `.git` history**, README, architecture/tradeoffs, evolution plan, and genuine Agent co-authored logs.

## 2. Product scope and acceptance criteria

Reference URLs (visual/behavioral references only; no scraping or production API access):
- Home: https://www.momoshop.com.tw/main/Main.jsp
- Results: https://www.momoshop.com.tw/search/asics?_isFuzzy=0&searchType=1
- Empty example: https://www.momoshop.com.tw/search/ascis

### Must-have (P0)
1. `/` displays a recognizable ecommerce landing-page skeleton: shared header, search field, simple hero/category area, and mock product cards.
2. Submitting a nonblank search navigates to `/search/<encoded keyword>`; keyword is restored from the URL on direct refresh. Query parameters may be accepted but are not required for matching.
3. `/search/asics` displays mock results; `/search/ascis` displays an explicit empty state. Other keywords use deterministic local matching (case-insensitive); do **not** special-case a misspelling unless documented as a fixture.
4. Product data is typed, has stable IDs, and comes through an asynchronous repository interface backed by in-memory mock fixtures (no HTTP requests).
5. Loading/error/empty/success UI states are explicit; simulated errors may be test-only rather than a visible toggle.
6. `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm test` work; provide `pnpm lint` if configured.
7. README explains setup, supported flows, architectural boundaries, assumptions, known gaps, tests, and evolution plan.
8. Keep genuine incremental Git commits and agent collaboration notes.

### Nice-to-have (P1, only if time permits)
- Basic search result count, sort control, responsive grid, accessible keyboard/focus behavior.
- One browser smoke test (Playwright) if setup cost is reasonable.
- Error boundary and lightweight diagnostic logging in development.

### Explicitly out of scope
- Authentication, checkout, cart persistence, real backend, live price/stock, SEO parity, full momo navigation, exact pixel replication, advanced filters, infinite scrolling, complex global state, micro-frontends.
- No reliance on momo logos/product images/assets unless rights and usage are clear; prefer text, CSS shapes and locally authored mock assets.

## 3. Architecture decision

**Single Vite React TypeScript app with feature-based folders and narrow shared modules.** This is a deliberate alternative to Nx monorepo: there is only one deployable app and a 120-minute implementation window. A monorepo can be introduced when a second app/package and real sharing needs emerge.

Proposed structure (create only files actually used):

```text
momo-frontend/
├── src/
│   ├── app/                 # App composition, route definitions, global providers
│   ├── pages/               # HomePage, SearchPage (thin route entry points)
│   ├── features/
│   │   └── search/          # SearchForm, search hooks and view components
│   ├── entities/
│   │   └── product/         # Product type, repository contract, mock implementation, ProductCard
│   ├── shared/
│   │   ├── layout/          # SiteHeader, PageShell
│   │   ├── ui/              # Small genuinely reused primitives
│   │   └── lib/             # Pure helpers only
│   ├── data/                # Mock product fixtures
│   └── main.tsx
├── docs/
│   ├── architecture.md
│   ├── tradeoffs.md
│   └── ai-collaboration.md
├── AGENTS.md
├── README.md
└── package.json
```

Dependency direction: `app/pages → features/entities/shared`; `features → entities/shared`; `entities → shared` (if needed); `shared` must not import from higher layers. Avoid duplicating the product domain in home and search.

### Data contract and state

```ts
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl?: string; // use only safe local or clearly permitted assets
  tags?: string[];
}

export interface ProductRepository {
  listFeatured(): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
}
```

- Export one repository instance from a composition boundary. Views consume via a hook/service; they do not import fixture arrays directly.
- URL path is the canonical search keyword. Form input is temporary local state; never maintain a second global copy of the keyword.
- Search requests must guard against stale updates after a keyword change/unmount (effect cleanup or equivalent).
- A tiny `useEffect` + state is acceptable; introduce TanStack Query only when caching/retries/invalidation actually justify it.
- Use CSS Modules and responsive CSS; avoid unnecessary UI framework setup.

## 4. Tradeoffs to document

| Decision | Chosen | Alternative | Why now / trigger to revisit |
|---|---|---|---|
| Repo layout | Single app, feature folders | Nx/pnpm workspace monorepo | Lower setup/maintenance cost; revisit for multiple independently deployed apps or shared packages |
| State | URL + local React state | Redux Toolkit/Zustand | No meaningful cross-feature mutable state yet; revisit for cart/auth/session |
| Data | Async mock repository | MSW / real API | Contract allows replacement; revisit when HTTP contract exists; never call momo API in this assignment |
| Rendering | Vite SPA | Next.js SSR | Small prototype, no SEO requirement; revisit for production discovery/SEO |
| Styles | CSS Modules | Tailwind/UI kit | Isolation and low configuration; revisit for design system scale |
| Tests | Pure unit + key UI states | Extensive E2E | Optimize coverage of architectural seams within time budget |
| Fidelity | Core states and layout | Pixel-perfect clone | Evaluation explicitly prioritizes engineering judgment |

Document both consequences and *reversal cost*, not only benefits.

## 5. Work plan and timeboxes

### Phase 1 — planning (~60 min; before first implementation commit)
- 0–15m: read assignment, fix scope and acceptance criteria.
- 15–35m: define domain model, route behavior, dependency boundaries and mock strategy.
- 35–50m: write tradeoffs, tests, and explicit exclusions.
- 50–60m: review with agent, freeze P0; record decisions in docs.

### Phase 2 — implementation (target ≤120 min from first commit)
- 0–15m: scaffold Vite/TS, router, scripts, basic README. Commit 1.
- 15–40m: product contract + fixtures + mock repository + tests. Commit 2.
- 40–70m: shared shell, home and search flow. Commit 3.
- 70–95m: loading/empty/error states, responsive styling, UI tests. Commit 4.
- 95–110m: validation (`lint`, `test`, `build`), fix critical issues. Commit 5.
- 110–120m: update README, gaps, tradeoffs, AI log, retrospective. Final commit.

If running late, cut P1 before P0. Never fabricate test outcomes or commit chronology.

## 6. Verification plan

- Unit: `search('asics')` returns fixtures; `search('ascis')` empty; case-insensitive match; empty/whitespace query behavior documented; stable ID uniqueness.
- UI: search submission navigates; direct URL `/search/asics` renders results; `/search/ascis` shows empty state; loading/error/success states distinguishable.
- Accessibility basics: input has accessible label, button is keyboard operable, images have alt or are decorative, loading/empty status is readable.
- Delivery: clean install, production build, refresh/deep-link behavior in dev, no external momo requests, no secrets, meaningful commit history.
- Keep a short manual comparison matrix: home header/layout, search input, results card, empty state; mark `approximate`, `missing`, or `intentional divergence` against reference, not unverified claims of parity.

## 7. Human–agent workflow and audit trail

Human approves architecture, scope, external dependencies, and final acceptance. Codex implements small reviewable increments, runs checks, reports results and uncertainties. For each substantial iteration, append to `docs/ai-collaboration.md`:

```md
### YYYY-MM-DD HH:mm +08:00 — Iteration N
- Human request / objective:
- Agent proposal and affected files:
- Human decision / corrections:
- Tools/commands and actual results:
- Tradeoff or issue discovered:
- Commit hash (if committed):
- Next step:
```

Use truthful Git authorship. For agent-assisted commits, append a trailer **only if the commit was genuinely co-authored and an accurate agent identity/email is known**; otherwise write `Agent-assisted: Codex CLI` in the commit body and record details in the log. Do not invent `Co-authored-by` addresses or claim all code was generated by AI.

Suggested conventional commit sequence: `chore: bootstrap frontend workspace`; `feat(product): add typed mock repository`; `feat(search): implement URL-driven search`; `test: cover search and UI states`; `docs: record tradeoffs and agent collaboration`.

## 8. Future evolution (not required now)

1. Replace mock repository with a real **authorized** API adapter and contract tests; preserve product-facing interface.
2. Add pagination/filter/sort in URL and shared query parsing, with explicit backend semantics.
3. Introduce TanStack Query for caching/retries and telemetry for request latency/errors.
4. Add visual regression, accessibility checks and deployment CI.
5. Split into pnpm workspace/Nx only when multiple apps or independently versioned packages justify it.

## 9. Definition of done / handoff

A reviewer can clone the repository, install and run it with documented commands, navigate home/results/empty states, find tests for core behavior, inspect meaningful commit history and actual AI-assisted decision logs, and understand what is intentionally omitted and how to extend it.

**First instruction to Codex:** Read `IMPLEMENTATION_PLAN.md` and `AGENTS.md`, summarize any ambiguity, then implement P0 in the proposed order. Do not begin by expanding scope or installing a monorepo.
