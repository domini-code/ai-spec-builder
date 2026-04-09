## Context

The generator page (`app/generator/page.tsx`) is already a client component with a `handleResult` callback invoked on every successful spec generation. The page's inline header renders the `UserButton` and title. There is no separate Header component and no shared state manager — all state lives in `useState` hooks within the page.

## Goals / Non-Goals

**Goals:**
- Display a live session counter ("X specs generated") in the generator page header
- Increment on every successful `handleResult` call
- Zero persistence — counter lives only in component state, resets on page reload

**Non-Goals:**
- Persisting the count across sessions (`localStorage`, `sessionStorage`, database)
- Showing the counter on any other page
- Tracking failed or partial generations

## Decisions

**1. State lives in the generator page, not a new context or store.**

`handleResult` already exists in `app/generator/page.tsx` and is the single point of success. Adding `const [sessionCount, setSessionCount] = useState(0)` there and calling `setSessionCount(c => c + 1)` inside `handleResult` is the minimal, correct location. No prop drilling needed — the counter display is also in the same file's header JSX.

Alternatives considered:
- React Context: overkill for a single integer shared within one component tree
- `sessionStorage`: the spec explicitly forbids persistence; adds complexity for no gain

**2. Counter rendered inline in the existing header `<div>`, not a new component.**

The header is a small JSX block within the page. Adding a `<span>` or badge next to the existing title/subtitle is sufficient. Extracting a `SpecCounter` component would add a file for a one-liner — avoid premature abstraction.

**3. Only increment on full success (after streaming completes).**

`handleResult` is called once streaming finishes and the spec is validated. This is the right signal — not on form submit, not mid-stream.

## Risks / Trade-offs

- **React StrictMode double-invoke**: In development, `useEffect` and state setters may run twice. The counter could show 2 after the first generation in dev. → Acceptable; behaves correctly in production.
- **No cross-tab sync**: Each tab has its own counter. → Expected per spec (no persistence).

