# Research: Copy Spec to Clipboard

**Branch**: `001-copy-spec-clipboard`
**Date**: 2026-04-06

## Summary

No NEEDS CLARIFICATION items from the spec. All decisions below are derived directly
from codebase inspection.

---

## Decision 1: Existing CopyButton Component

**Decision**: Modify the existing `CopyButton` component in `components/SpecOutput.tsx`
(lines 222–253) rather than creating a new component.

**Rationale**: The component already implements the core clipboard write and 2-second
revert timer pattern. Only three changes are needed: (1) update labels, (2) add a
`disabled` prop, (3) wrap the clipboard write in try/catch for error handling.

**Alternatives considered**:
- Create a new standalone component — rejected: adds duplication, no benefit.
- Extract to `lib/` hook — rejected: overkill for a 30-line component; violates YAGNI.

---

## Decision 2: Disabled State Architecture

**Decision**: Add an `isStreaming` prop to `SpecOutput` and thread it down to
`CopyButton` as `disabled`.

**Rationale**: In the current page architecture (`app/generator/page.tsx`), `SpecOutput`
is only rendered after streaming ends, so the button is never visible during generation.
Adding the explicit `disabled` prop makes the contract clear and protects against future
rendering changes (e.g., showing partial spec output during streaming).

**Alternatives considered**:
- Rely on existing architecture (button not rendered during streaming) — rejected: doesn't
  satisfy FR-005 explicitly; fragile if parent changes.
- Pass `disabled` directly to `SpecOutput` without `isStreaming` rename — valid; using
  `isStreaming` is more descriptive of the reason.

---

## Decision 3: Clipboard Error Handling

**Decision**: Wrap `navigator.clipboard.writeText` in a try/catch. On failure, do not
set `copied = true` (no "¡Copiado!" shown). Button returns to enabled "Copiar spec" state.

**Rationale**: FR-007 explicitly requires no false confirmation on failure. The browser
Clipboard API can throw if permissions are denied or if called outside a secure context.

**Alternatives considered**:
- Show an error state/icon — deferred: spec does not require it; YAGNI.
- Silently ignore — rejected: risks misleading the user if we incorrectly set "¡Copiado!".

---

## Decision 4: Label Scope

**Decision**: The labels "Copiar spec" and "¡Copiado!" are product copy decisions and
are hardcoded into the component. No i18n infrastructure is needed.

**Rationale**: Spec assumptions explicitly state: "No i18n requirements at this stage."
The existing codebase already mixes English and Spanish UI text (e.g., `SpecOutput`
renders section headers in English while spec data is in Spanish).

---

## Files Affected

| File | Change |
|------|--------|
| `components/SpecOutput.tsx` | Update `CopyButton` (labels, disabled, error handling); add `isStreaming` prop to `SpecOutput` |
| `app/generator/page.tsx` | Pass `isStreaming` to `SpecOutput` |

No new files. No backend changes.
