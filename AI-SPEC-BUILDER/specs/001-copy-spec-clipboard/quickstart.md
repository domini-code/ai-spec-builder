# Quickstart: Copy Spec to Clipboard

**Branch**: `001-copy-spec-clipboard`
**Date**: 2026-04-06

## Prerequisites

- Node.js installed
- `.env.local` with a valid `ANTHROPIC_API_KEY`
- `npm install` run at repo root

## Run the app

```bash
npm run dev
# Open http://localhost:3000/generator
```

## Manual Validation Checklist

### User Story 1 — Copy Generated Spec

1. Navigate to `/generator`.
2. Enter any product idea in the form and submit.
3. Wait for spec generation to complete (skeleton disappears, spec cards appear).
4. Locate the "Copiar spec" button in the header bar next to the export buttons.
5. Click "Copiar spec".
6. **Verify**: Button label changes to "¡Copiado!" immediately.
7. Open any text editor and paste (Ctrl+V / Cmd+V).
8. **Verify**: Full spec content is present — Vision, Target Users, Features, User Flows,
   Architecture, Requirements sections all appear.
9. Wait 2 seconds.
10. **Verify**: Button label reverts to "Copiar spec".

### User Story 2 — Disabled During Generation

1. Navigate to `/generator`.
2. Submit the form to start generation.
3. While the skeleton is loading (generation in progress):
   - **Verify**: The "Copiar spec" button is either not visible or visually disabled
     (dimmed/cursor-not-allowed).
4. Once generation completes:
   - **Verify**: Button is enabled and clickable.

### Edge Case — Rapid Double-Click

1. Generate a spec and click "Copiar spec".
2. While "¡Copiado!" is showing, click the button again immediately.
3. **Verify**: The label stays "¡Copiado!" and the 2-second timer resets (does not
   revert immediately on the second click).

### Edge Case — Clipboard Permission Denied (if testable)

1. In browser devtools, revoke clipboard-write permission for localhost.
2. Generate a spec and click "Copiar spec".
3. **Verify**: Button label does NOT change to "¡Copiado!"; stays "Copiar spec".
