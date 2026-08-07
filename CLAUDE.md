# AI Spec Builder

## Vision

AI Spec Builder converts any product idea into a complete technical specification in minutes, so entrepreneurs can start development without spending weeks on documentation.

## Tech Stack

- **Frontend**: Next.js 16 + React + Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: Anthropic SDK (Claude)
- **Auth**: Clerk (`@clerk/nextjs`) — Google sign-in, enabled from the Clerk dashboard
- **Deploy**: Vercel

## Key Constraints

- **Auth is required** — every route is protected except `/`, `/sign-in` and `/sign-up`.
  `/` is the public landing page; the generator lives at `/generator` behind a session.
- No database — spec history is kept in `localStorage`, anonymous per device.
  Do not introduce a DB or per-user storage without an explicit spec.
- All code is written in English (variable names, comments, functions, files)

## Project Structure

Standard Next.js App Router layout:

```
middleware.ts       # Clerk route protection (clerkMiddleware + createRouteMatcher)
app/
  page.tsx          # Public landing page — redirects to /generator when signed in
  generator/        # The spec generator itself (protected)
  sign-in/          # Clerk <SignIn />
  sign-up/          # Clerk <SignUp />
  layout.tsx        # Root layout — wrapped in <ClerkProvider>
  api/              # API routes (backend logic)
components/         # Reusable React components
lib/                # Utilities and helpers (e.g., Anthropic client)
specs/              # One Feature*.md per mini-spec — the record of every decision
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
ANTHROPIC_API_KEY=                    # Required — Anthropic API key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=    # Required — from the Clerk dashboard
CLERK_SECRET_KEY=                     # Required — from the Clerk dashboard
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

Set in `.env.local` for local development and in Vercel project settings for production.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```
