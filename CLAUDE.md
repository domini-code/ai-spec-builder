# AI Spec Builder

## Vision

AI Spec Builder converts any product idea into a complete technical specification in minutes, so entrepreneurs can start development without spending weeks on documentation.

## Tech Stack

- **Frontend**: Next.js 16 + React + Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: Anthropic SDK (Claude)
- **Deploy**: Vercel

## Key Constraints

- No authentication — the app is fully public
- No database — no persistent storage of any kind
- All code is written in English (variable names, comments, functions, files)

## Project Structure

Standard Next.js App Router layout:

```
app/
  page.tsx          # Main entry point
  layout.tsx        # Root layout
  api/              # API routes (backend logic)
components/         # Reusable React components
lib/                # Utilities and helpers (e.g., Anthropic client)
```

## Development Guidelines

- Use the App Router (`app/` directory), not the Pages Router
- Keep API routes thin — move business logic into `lib/`
- Use Tailwind utility classes for all styling; avoid custom CSS files
- Use the latest Claude model (`claude-sonnet-4-6` or `claude-opus-4-6`) for spec generation
- Stream Claude responses to the UI when possible for better perceived performance
- Keep components small and focused; prefer composition over large monolithic components
- No external state management library — React `useState`/`useReducer` is sufficient

## Environment Variables

```
ANTHROPIC_API_KEY=   # Required — Anthropic API key
```

Set in `.env.local` for local development and in Vercel project settings for production.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```
