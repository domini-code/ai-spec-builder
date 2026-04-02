# Feature: Autenticación con Clerk

## Objetivo

Proteger la aplicación con autenticación mediante Clerk, requiriendo que el usuario inicie sesión antes de acceder a la app y al API de generación de specs. El historial en localStorage no se modifica — sigue siendo anónimo por device.

---

## Decisiones de diseño

- **Proveedor**: Clerk (`@clerk/nextjs`)
- **Scope**: Solo autenticación — sin DB, sin user data, sin historial por usuario
- **Historial**: Permanece en localStorage sin cambios
- **Rutas públicas**: `/sign-in` y `/sign-up` (el resto requiere sesión)

---

## 1. Variables de entorno — `.env.local`

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

---

## 2. Middleware — `middleware.ts` (raíz del proyecto)

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};
```

Clerk intercepta cada request. Si no hay sesión activa en rutas protegidas, redirige a `/sign-in`.

---

## 3. `app/layout.tsx`

Envolver el árbol de children con `<ClerkProvider>`:

```typescript
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" ...>
        <body ...>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

---

## 4. Páginas de autenticación

### `app/sign-in/[[...sign-in]]/page.tsx`
```typescript
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn />
    </div>
  );
}
```

### `app/sign-up/[[...sign-up]]/page.tsx`
```typescript
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUp />
    </div>
  );
}
```

---

## 5. `app/page.tsx` — añadir `<UserButton>`

Añadir un header fijo en la parte superior del `<main>` con el `<UserButton />` de Clerk (avatar + menú de cierre de sesión):

```typescript
import { UserButton } from '@clerk/nextjs';

// Dentro del JSX, encima del título:
<div className="flex justify-end mb-4">
  <UserButton afterSignOutUrl="/sign-in" />
</div>
```

---

## 6. `app/api/generate-spec/route.ts` — proteger el endpoint

Verificación de sesión server-side al inicio del handler como defensa en profundidad (el middleware ya bloquea, pero es buena práctica):

```typescript
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... resto del handler sin cambios
}
```

---

## 7. Archivos modificados

| Archivo | Acción |
|---|---|
| `middleware.ts` | Crear (nuevo) |
| `app/layout.tsx` | Editar — envolver con `ClerkProvider` |
| `app/sign-in/[[...sign-in]]/page.tsx` | Crear (nuevo) |
| `app/sign-up/[[...sign-up]]/page.tsx` | Crear (nuevo) |
| `app/page.tsx` | Editar — añadir `UserButton` en header |
| `app/api/generate-spec/route.ts` | Editar — añadir verificación `auth()` |
| `.env.local` | Editar — añadir variables de Clerk |

---

## 8. Lo que NO cambia

- `lib/spec-history.ts` — sin cambios
- `components/SpecHistoryPanel.tsx` — sin cambios
- Todos los demás componentes — sin cambios
- El historial en localStorage sigue siendo anónimo por device
