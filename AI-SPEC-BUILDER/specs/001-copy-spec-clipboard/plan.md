# Implementation Plan: Copy Spec to Clipboard

**Branch**: `001-copy-spec-clipboard` | **Date**: 2026-04-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-copy-spec-clipboard/spec.md`

## Summary

Add a "Copiar spec" copy-to-clipboard button to the spec results view. The existing
`CopyButton` component in `components/SpecOutput.tsx` already implements the clipboard
write and 2-second label revert pattern; this plan updates it with the correct Spanish
labels, adds error handling (no false "¡Copiado!" on failure), and adds a `disabled`
prop wired to a new `isStreaming` prop on `SpecOutput`. The caller
`app/generator/page.tsx` passes the existing `isStreaming` state to `SpecOutput`.
No backend changes. No new dependencies.

## Technical Context

**Language/Version**: TypeScript 5 / React 19 (Next.js 16 App Router)
**Primary Dependencies**: React `useState`, browser Clipboard API (`navigator.clipboard`)
**Storage**: N/A
**Testing**: Manual E2E via `npm run dev` (see `quickstart.md`)
**Target Platform**: Modern browsers (Chromium, Firefox, Safari) on HTTPS or localhost
**Project Type**: Web application (Next.js)
**Performance Goals**: Clipboard write + UI feedback within 500 ms of click
**Constraints**: Browser-only; no server round-trip; no new npm dependencies
**Scale/Scope**: 2 files modified, ~15 lines changed

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Public-First, Zero Auth | ✅ PASS | No auth gate added; button is in the public generator view |
| II. Stateless & No Persistence | ✅ PASS | `copied` boolean is transient React state; no storage |
| III. Streaming AI Responses | ✅ PASS | No changes to streaming path; button is disabled during it |
| IV. Simplicity & YAGNI | ✅ PASS | Modifying existing component; no new abstractions; 2 files |
| V. English-Only Codebase | ✅ PASS | Labels "Copiar spec" / "¡Copiado!" are UI copy (user-facing text), not code identifiers |

**Post-design re-check**: All gates still pass. No complexity violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-copy-spec-clipboard/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── ui-contracts.md  # Phase 1 output
├── checklists/
│   └── requirements.md  # Spec quality checklist (from /speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root — two files modified)

```text
components/
└── SpecOutput.tsx     # CopyButton: labels, disabled prop, error handling
                       # SpecOutput: add isStreaming prop

app/
└── generator/
    └── page.tsx       # Pass isStreaming={isStreaming} to <SpecOutput>
```

**Structure Decision**: Single Next.js project; no new directories needed. Both
modified files are in their existing locations per the App Router convention.

## Phase 0: Research

See [research.md](./research.md) for full findings. Summary:

- **Existing component**: `CopyButton` at `components/SpecOutput.tsx:222–253` already
  handles clipboard write and revert timer. Labels and error handling only need updating.
- **Architecture**: `SpecOutput` is only rendered after `isStreaming=false` in the
  current page, so the disabled state is enforced architecturally today — but adding
  the explicit prop satisfies FR-005 and future-proofs the component.
- **Error handling**: `try/catch` around `navigator.clipboard.writeText`; do not set
  `copied=true` on catch.
- **No new dependencies**: Browser Clipboard API is already used in the current
  `CopyButton`.

## Phase 1: Design & Contracts

See [data-model.md](./data-model.md), [contracts/ui-contracts.md](./contracts/ui-contracts.md),
and [quickstart.md](./quickstart.md).

Key design decisions:
1. `CopyButton` receives `disabled: boolean` prop (not `isStreaming`) — keeps the
   component generic and reusable.
2. `SpecOutput` receives `isStreaming: boolean` and passes it as `disabled` to
   `CopyButton`.
3. Timer reset on double-click: clear and restart with `clearTimeout` on each click
   invocation, or use the existing pattern of calling `setCopied(true)` again (React
   state update resets nothing). Add an explicit `timeoutRef` via `useRef` to allow
   `clearTimeout` + `setTimeout` on each click.
4. Error handling: wrap clipboard write in async try/catch; only call `setCopied(true)`
   in the `try` block.
