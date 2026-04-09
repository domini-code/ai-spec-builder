# UI Contracts: Copy Spec to Clipboard

**Branch**: `001-copy-spec-clipboard`
**Date**: 2026-04-06

## CopyButton Component Contract

**Location**: `components/SpecOutput.tsx` (internal component, not exported)

### Props

| Prop       | Type      | Required | Description |
|------------|-----------|----------|-------------|
| `spec`     | `Spec`    | Yes      | The generated spec; used to build clipboard payload via `buildPlainText(spec)` |
| `disabled` | `boolean` | Yes      | When `true`, button is non-interactive and visually dimmed |

### Behavior Contract

| Condition | Button label | Clickable | Side effect |
|-----------|-------------|-----------|-------------|
| `disabled=true` | "Copiar spec" | No | None |
| `disabled=false, copied=false` | "Copiar spec" | Yes | Triggers clipboard write |
| `disabled=false, copied=true` | "¡Copiado!" | Yes | Triggers clipboard write + resets 2s timer |
| Clipboard write fails | "Copiar spec" | Yes | No label change; error swallowed |

### Visual States

- **Enabled default**: standard border/bg-white button styling (matches sibling export buttons)
- **Disabled**: `disabled:opacity-60 disabled:cursor-not-allowed` (matches existing pattern)
- **Copied**: checkmark icon + green-colored text (matches current "Copied!" style)

---

## SpecOutput Component Contract (updated)

**Location**: `components/SpecOutput.tsx` (default export)

### Props (updated)

| Prop          | Type         | Required | Description |
|---------------|--------------|----------|-------------|
| `spec`        | `Spec`       | Yes      | The fully generated spec object |
| `isStreaming`  | `boolean`    | Yes      | Passed through to `CopyButton` as `disabled` |
| `onReset`     | `() => void` | Yes      | Resets page to form state |

### Caller: `app/generator/page.tsx`

```
<SpecOutput
  spec={spec}
  isStreaming={isStreaming}
  onReset={handleReset}
/>
```
