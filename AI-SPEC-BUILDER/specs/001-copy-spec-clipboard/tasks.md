---
description: 'Task list for Copy Spec to Clipboard feature'
---

# Tasks: Copy Spec to Clipboard

**Input**: Design documents from `/specs/001-copy-spec-clipboard/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Not requested. Manual validation via `quickstart.md`.

**Organization**: Tasks are grouped by user story. US1 (CopyButton changes) and US2
(page wiring) are independent at the file level and can be developed in parallel.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)

## Path Conventions

- Source root: `E:\proyectos\Cursos\Udemy\AI Workflow\modulos\repos\app_ai_spec_builder\`
- All paths below are relative to that root

---

## Phase 1: Setup

**Purpose**: Confirm working environment before modifying files.

- [x] T001 Verify `npm run dev` starts without errors and `/generator` page loads in browser

---

## Phase 2: Foundational

**Purpose**: No shared infrastructure changes required. This feature modifies existing
components only.

_(Empty — proceed directly to user story phases)_

---

## Phase 3: User Story 1 — Copy Generated Spec (Priority: P1) 🎯 MVP

**Goal**: The "Copiar spec" button copies the full spec text to the clipboard with
"¡Copiado!" confirmation for 2 seconds, and fails gracefully if clipboard write fails.

**Independent Test**: Generate a spec, click "Copiar spec", paste into any text editor,
verify full spec text appears. Wait 2 seconds, verify label reverts to "Copiar spec".

### Implementation for User Story 1

- [x] T002 [P] [US1] Update `CopyButton` labels in `components/SpecOutput.tsx`: change button
      text from `"Copy"` to `"Copiar spec"` and from `"Copied!"` to `"¡Copiado!"` (lines 237, 248)

- [x] T003 [P] [US1] Add `disabled` prop to `CopyButton` interface and apply it to the `<button>`
      element in `components/SpecOutput.tsx` — add `disabled={disabled}` and
      `disabled:opacity-60 disabled:cursor-not-allowed` classes

- [x] T004 [US1] Add error handling to `CopyButton.handleCopy` in `components/SpecOutput.tsx`:
      wrap `navigator.clipboard.writeText` in `try/catch`; only call `setCopied(true)` inside
      the `try` block; catch block is a no-op (button stays enabled, no label change)

- [x] T005 [US1] Add timer-reset behavior to `CopyButton` in `components/SpecOutput.tsx`:
      introduce a `timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)`,
      call `clearTimeout(timeoutRef.current)` before each `setTimeout`, and store the new
      timer handle in `timeoutRef.current` — ensures rapid double-click resets the 2-second window

- [x] T006 [US1] Add `isStreaming` prop to `SpecOutputProps` interface in
      `components/SpecOutput.tsx` and pass it as `disabled={isStreaming}` to `<CopyButton>`

**Checkpoint**: At this point, `SpecOutput` compiles with the new `isStreaming` prop,
`CopyButton` shows "Copiar spec"/"¡Copiado!", handles errors, and resets the timer on
rapid clicks. User Story 1 is fully implemented (pending US2 wire-up for the disabled
state to be activated).

---

## Phase 4: User Story 2 — Disabled During Generation (Priority: P2)

**Goal**: The "Copiar spec" button is non-interactive while the spec is being streamed,
becoming active automatically when generation completes.

**Independent Test**: Submit the form to start generation, observe the button is disabled
(dimmed, not clickable) during streaming, then confirm it becomes enabled once the spec
cards appear.

### Implementation for User Story 2

- [x] T007 [US2] Pass `isStreaming={isStreaming}` to `<SpecOutput>` in
      `app/generator/page.tsx` (line 96) — the `isStreaming` variable is already in scope
      from `useState`

**Checkpoint**: US1 and US2 are now both fully functional. Button is disabled during
streaming and copies correctly with Spanish labels after generation.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Quality gate before shipping.

- [x] T008 [P] Run `npm run lint` from repo root and fix any lint errors introduced by changes
- [x] T009 [P] Run `npm run build` from repo root and confirm zero TypeScript/build errors
- [x] T010 Manual validation per `specs/001-copy-spec-clipboard/quickstart.md`:
      verify all checklist items including US1 copy flow, US2 disabled state, rapid
      double-click timer reset, and clipboard failure edge case

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **US1 (Phase 3)**: No dependencies on Phase 2 (empty) — start after T001
- **US2 (Phase 4)**: Depends on T006 completing (SpecOutput must accept `isStreaming` prop
  before `page.tsx` can pass it) — run T007 after T006
- **Polish (Phase 5)**: Depends on T007 completing

### User Story Dependencies

- **US1 (T002–T006)**: T002, T003 can run in parallel (no inter-dependency); T004, T005
  each depend only on the existing `CopyButton` shape; T006 adds the `isStreaming` prop
  to `SpecOutput` — run last within US1 as it changes the parent component's interface
- **US2 (T007)**: Single task; depends only on T006

### Within User Story 1

- T002 and T003: parallel (both edit different lines in `CopyButton`, no conflict)
- T004: depends on `handleCopy` shape established — run after T002
- T005: independent of T002/T003/T004 (adds `useRef`) — can run in parallel with T002/T003
- T006: run last in US1 (changes `SpecOutputProps` and JSX call site)

### Parallel Opportunities

```bash
# T002, T003, T005 can be applied in one pass (same file, no ordering conflict):
- Update CopyButton labels (T002)
- Add disabled prop to CopyButton (T003)
- Add timeoutRef for timer reset (T005)

# Then sequentially:
- Add try/catch to handleCopy (T004)
- Add isStreaming prop to SpecOutput and wire to CopyButton (T006)
- Wire isStreaming in page.tsx (T007)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001: Setup
2. Complete T002–T006: User Story 1 (CopyButton + SpecOutput changes)
3. **STOP and VALIDATE**: Open dev server, generate a spec, manually test copy behavior
4. If validated, proceed to US2

### Full Delivery (Both User Stories)

1. T001 → T002–T006 (US1) → T007 (US2) → T008–T010 (Polish)
2. Each step is a complete, testable increment

---

## Notes

- [P] tasks = different logical units, no ordering conflict within the same file pass
- T002 and T003 touch different lines in the same file — commit together or apply in one edit
- `isStreaming` in the current architecture is always `false` when `SpecOutput` renders
  (it only renders after `handleResult` fires), so the disabled state is a safety belt
  rather than a visible UX change today — but FR-005 requires the prop explicitly
- No new files created; no backend changes; no new npm dependencies
