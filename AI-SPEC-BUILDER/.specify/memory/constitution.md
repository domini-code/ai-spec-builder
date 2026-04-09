\*\*\*\*<!--
SYNC IMPACT REPORT
==================
Version Change: [TEMPLATE] → 1.0.0
Bump Type: MINOR (initial population — all principles and sections added from scratch)
Modified Principles: N/A (first ratification; no prior named principles)
Added Sections:

- Core Principles (I. Public-First Zero Auth, II. Stateless No Persistence,
  III. Streaming AI Responses, IV. Simplicity & YAGNI, V. English-Only Codebase)
- Tech Stack Constraints
- Development Workflow
- Governance
  Removed Sections: None (template placeholders replaced, no prior content removed)
  Templates Requiring Updates:
- .specify/templates/plan-template.md ✅ Constitution Check gates align with I–V
- .specify/templates/spec-template.md ✅ No mandatory section changes required
- .specify/templates/tasks-template.md ✅ Task phases align with stateless/streaming constraints
  Deferred TODOs: None — all placeholders resolved from project context
  -->

# AI Spec Builder Constitution

## Core Principles

### I. Public-First, Zero Auth

This application is fully public. There MUST be no authentication, authorization gates,
or login flows on any route. Every page and API endpoint MUST be accessible without
credentials. Adding any auth mechanism (tokens, sessions, OAuth, middleware guards) is a
constitutional violation and requires a MAJOR amendment.

**Rationale**: The product's core value is zero-friction access — an entrepreneur must be
able to convert a product idea into a spec in seconds, with no account creation barrier.

### II. Stateless & No Persistence

The application MUST NOT use any database, file-based server storage, or server-side
session state. All data is transient: request-scoped on the server and ephemeral on the
client (React state, or `localStorage` at most for UX convenience like spec history).
No ORM, no migration tooling, no connection pooling.

**Rationale**: Eliminating persistence removes an entire class of operational complexity,
security surface, and compliance concerns, keeping the app deployable as a pure Next.js
serverless application on Vercel with no backing services required.

### III. Streaming AI Responses (NON-NEGOTIABLE)

All calls to the Claude API MUST use streaming. Blocking or batch AI responses are
prohibited in route handlers. The UI MUST render streamed chunks incrementally so the
user sees content appear in real time.

**Rationale**: Spec generation takes 10–30 seconds. Streaming delivers immediate visual
feedback and dramatically improves perceived performance. A non-streaming implementation
would appear unresponsive or broken to end users.

### IV. Simplicity & YAGNI

Complexity MUST be justified by a concrete, present need. The following rules are
non-negotiable:

- No external state management library — React `useState`/`useReducer` is the limit.
- Components MUST be small and focused; composition is preferred over monolithic components.
- API route handlers MUST be thin; all business logic MUST live in `lib/`.
- Tailwind utility classes exclusively — no custom CSS files.
- No speculative abstractions, helper factories, or over-engineered patterns for
  hypothetical future requirements.

**Rationale**: This is a single-purpose tool. Premature complexity slows iteration and
adds maintenance burden with zero user-facing benefit.

### V. English-Only Codebase

All code artifacts MUST use English exclusively: variable names, function names, file
names, inline comments, and documentation strings. Non-English identifiers are a
constitutional violation.

**Rationale**: Ensures universal readability, consistent AI-assisted tooling behavior,
and frictionless open-source collaboration regardless of contributor locale.

## Tech Stack Constraints

The following stack is fixed and MUST NOT be substituted without a constitutional
amendment at the appropriate version level:

- **Framework**: Next.js App Router (`app/` directory). The Pages Router MUST NOT be used.
- **Styling**: Tailwind CSS utility classes only. Custom `.css` files are prohibited.
- **AI Model**: Anthropic SDK with `claude-sonnet-4-6` or `claude-opus-4-6` (latest
  available). Older model versions or non-Claude models MUST NOT be used for spec
  generation.
- **Deployment target**: Vercel. No Docker images, no self-hosted runtimes.
- **Required env var**: `ANTHROPIC_API_KEY` — in `.env.local` for local dev and in Vercel
  project settings for production. No other secrets are expected or permitted.

No additional runtime dependencies (ORMs, auth libraries, state managers, UI component
libraries beyond Tailwind) may be introduced without a Minor or Major amendment.

## Development Workflow

- **Project layout**: Standard Next.js App Router — `app/`, `components/`, `lib/`.
- **Route handlers** (`app/api/`): MUST remain thin. Validate input, call a `lib/`
  function, stream the response. No inline business logic.
- **Components**: Each component MUST have a single, clear responsibility. Prefer many
  small components over few large ones.
- **Testing**: Not mandated at this time. Manual validation against `npm run dev` is the
  acceptance gate. If tests are introduced, they MUST cover streaming behavior and are
  subject to Principle IV (no over-engineering).
- **Lint gate**: `npm run lint` MUST pass before any PR is merged. `eslint-disable`
  suppressions require documented justification in the same PR.
- **Build gate**: `npm run build` MUST succeed with zero errors before any deployment.

## Governance

This constitution supersedes all other development practices and guidelines for this
project. It is the authoritative source of non-negotiable rules.

**Amendment procedure**:

1. Propose the change in a PR description with explicit rationale and impact assessment.
2. Update `CONSTITUTION_VERSION` per semantic versioning:
   - **MAJOR**: Principle removal, redefinition, or backward-incompatible governance change.
   - **MINOR**: New principle or section added; materially expanded guidance.
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements.
3. Set `LAST_AMENDED_DATE` to the amendment date in ISO 8601 format (YYYY-MM-DD).
4. Run `/speckit-constitution` to propagate changes to dependent templates and verify
   the Sync Impact Report reflects all affected files.
5. Merge only after all flagged templates are updated and the PR is approved.

**Compliance review**: All PRs MUST be checked against this constitution before merge.
Any violation blocks the PR until resolved or a formal amendment is ratified.

Runtime development guidance for AI agents lives in `CLAUDE.md` at the repository root.

**Version**: 1.0.0 | **Ratified**: 2026-04-06 | **Last Amended**: 2026-04-06
