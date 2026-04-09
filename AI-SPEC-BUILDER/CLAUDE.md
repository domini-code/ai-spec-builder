# AI-SPEC-BUILDER Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-06

## Active Technologies

- Next.js 16 App Router, React 19, TypeScript 5 (001-copy-spec-clipboard)
- Tailwind CSS utility classes only (001-copy-spec-clipboard)
- Browser Clipboard API — `navigator.clipboard.writeText` (001-copy-spec-clipboard)

## Project Structure

```text
components/
└── SpecOutput.tsx     # Spec display + CopyButton, ExportButton, ExportPDFButton

app/
└── generator/
    └── page.tsx       # Main generator page; owns isStreaming + spec state
```

## Commands

```bash
npm run dev    # Start dev server at http://localhost:3000
npm run build  # Production build
npm run lint   # ESLint check
```

## Code Style

TypeScript: Follow existing patterns in `components/SpecOutput.tsx`.
- Inline SVG icon components as named functions (no external icon library)
- `useState` + `useRef` for component state; no external state management
- Tailwind utility classes exclusively; no custom CSS

## Recent Changes

- 001-copy-spec-clipboard: CopyButton updated — labels "Copiar spec"/"¡Copiado!",
  disabled prop, error handling; SpecOutput gets isStreaming prop; page.tsx wires it

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
