# Data Model: Copy Spec to Clipboard

**Branch**: `001-copy-spec-clipboard`
**Date**: 2026-04-06

## UI State Model

This feature is purely client-side UI state — no persistent data, no new entities.

### CopyButton Local State

| State field | Type    | Initial value | Transitions |
|-------------|---------|---------------|-------------|
| `copied`    | boolean | `false`       | `false → true` on successful clipboard write; `true → false` after 2 000 ms |

### SpecOutput Props (updated interface)

```
SpecOutputProps {
  spec:        Spec       // The fully generated spec (required)
  isStreaming: boolean    // True while generation is in progress (required)
  onReset:     () => void // Callback to clear spec and return to form (required)
}
```

### CopyButton Props (updated interface)

```
CopyButtonProps {
  spec:     Spec     // Used to build the plain-text payload for clipboard
  disabled: boolean  // True when spec generation is in progress
}
```

## State Transitions

```
Generation in progress:
  isStreaming=true → CopyButton disabled=true
    └─ click → no-op

Generation complete:
  isStreaming=false → CopyButton disabled=false
    └─ click (success) → copied=true → [2s timer] → copied=false
    └─ click (failure) → copied stays false

"¡Copiado!" active + second click:
  → clipboard write executes again
  → timer resets to 2s from moment of second click
```

## No Persistent Entities

This feature introduces no database records, localStorage entries, or any other
persistent storage. The `copied` boolean lives only in React component state and
is discarded when the component unmounts.
