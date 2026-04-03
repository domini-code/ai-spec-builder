# Feature: Home Page pública + protección del generador

## Qué hace

Añade una landing page pública en `/` visible para usuarios no autenticados que presenta la app, comunica su valor y dirige al usuario al login de Clerk. Si el usuario ya tiene sesión activa y visita `/`, se le redirige automáticamente al generador de specs. El generador permanece en su ruta actual y queda inaccesible sin sesión.

---

## Por qué

Ahora mismo un usuario sin contexto llega directamente al formulario de Clerk sin saber qué es la app ni por qué debería registrarse. Eso genera abandono. La home page cierra esa brecha: primero convence, luego autentica.

---

## Criterios de aceptación

- [ ] `/` es una ruta pública — accesible sin sesión (el middleware no la protege)
- [ ] La home muestra: nombre de la app, descripción de una línea, tres beneficios clave y un botón CTA "Empezar"
- [ ] El botón "Empezar" redirige a `/sign-in`
- [ ] El diseño usa Tailwind y es visualmente coherente con el resto de la app (mismos colores, tipografía y espaciado)
- [ ] Un usuario autenticado que visita `/` es redirigido automáticamente al generador sin ver la landing
- [ ] El generador de specs solo es accesible con sesión activa — sin sesión redirige a `/sign-in`
- [ ] El generador se mueve a `/generator` — `app/generator/page.tsx`

---

## No incluye

- Cambios en la lógica o UI del generador de specs (solo se mueve de ruta)
- Página de precios, FAQ, términos o política de privacidad
- Animaciones, carruseles o elementos interactivos más allá del botón CTA
- Internacionalización ni versión en otro idioma
- Header de navegación persistente ni footer
- Métricas de conversión ni analytics sobre la landing
