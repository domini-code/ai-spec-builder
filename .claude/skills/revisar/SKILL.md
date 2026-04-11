---
name: revisar
description: Audits the project by cross-referencing CLAUDE.md and specs/ against recently modified source files, then surfaces inconsistencies and suggests fixes without applying them.
disable-model-invocation: true
---

# /revisar — Spec vs. Code Audit

You are performing a read-only audit. Do NOT modify any file. Your job is to surface inconsistencies and present actionable suggestions so the developer can decide what to fix.

## Steps to follow — execute them in order

### 1. Read the project contract

Read both of these files in full before doing anything else:

- [CLAUDE.md](../../../CLAUDE.md) — constraints, tech stack, architecture rules, conventions
- Every file inside [specs/](../../../specs/) — feature specs that describe intended behaviour

Take note of every explicit rule, constraint, and requirement you find.

### 2. Identify recently modified source files

Run the following command to list files changed in the last 7 days (excluding `node_modules`, `.next`, and lock files):

```bash
git diff --name-only HEAD~10 HEAD 2>/dev/null || \
  find . -not -path "*/node_modules/*" -not -path "*/.next/*" \
         -not -name "package-lock.json" -not -name "*.lock" \
         -newer CLAUDE.md -type f | sort
```

Read the files that are most relevant to the features described in the specs. Prioritise:

- `app/` — pages and API routes
- `components/` — UI components
- `lib/` — utilities and helpers
- `middleware.ts`

### 3. Cross-reference code vs. spec

For each spec file in `specs/` and each rule in `CLAUDE.md`, check whether the current code honours it.

Look for — but don't limit yourself to — these categories of inconsistency:

| Category | What to check |
|---|---|
| **Tech-stack drift** | Wrong model ID, Pages Router used instead of App Router, external CSS files instead of Tailwind |
| **Constraint violations** | Auth logic, database calls, or persistent storage introduced despite "no auth / no DB" rules |
| **Language** | Variable names, comments, or function names written in a language other than English |
| **Architecture** | Business logic inside API routes instead of `lib/`, monolithic components that should be split |
| **Feature completeness** | A spec describes behaviour (streaming, export, history…) that is absent or partially implemented |
| **State management** | External state libraries imported when `useState`/`useReducer` is required |
| **Environment variables** | Hardcoded secrets or API keys instead of `process.env.ANTHROPIC_API_KEY` |

### 4. Report your findings

Present results in this exact structure — fill each section or write "None found."

---

## Audit Report

### Files reviewed
List every file you read, one per line.

### Rules and requirements extracted
Bullet list of every constraint and requirement gathered from `CLAUDE.md` and the spec files.

### Inconsistencies found

For each inconsistency use this format:

**[CATEGORY] Short title**
- **File**: `path/to/file.ts` (line range if known)
- **Spec / rule**: quote the relevant requirement
- **Observed**: describe what the code actually does
- **Suggested fix**: one or two sentences explaining what should change — do not write the fix, only describe it

### Items that look correct
Brief bullet list of things you verified and found consistent with the spec. This confirms the audit was thorough.

### Summary
One paragraph: overall health of the codebase relative to spec, and which inconsistency is highest priority to address first.

---

> Reminder: do not edit any file. Present findings only and wait for the developer to decide what to act on.
