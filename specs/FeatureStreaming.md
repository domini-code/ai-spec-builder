# Streaming de respuesta — Mini-Spec

---

**Qué hace**

La API route cambia a modo streaming con `stream: true` del SDK de Anthropic y devuelve un `ReadableStream` al frontend via `StreamingTextResponse` (o `Response` con `TransformStream`). El frontend consume el stream token a token con `fetch` + `response.body.getReader()` y actualiza el estado del componente en cada chunk, mostrando el texto de forma progresiva mientras Claude lo genera.

---

**Por qué**

El usuario espera 10-15 segundos sin feedback visual. El problema no es la latencia real — es la percepción de inactividad. Mostrar texto apareciendo progresivamente elimina esa percepción y hace la app sentirse más responsiva sin cambiar el tiempo real de generación.

---

**Criterios de aceptación**

- [ ] La API route (`app/api/generate/route.ts` o similar) usa `anthropic.messages.stream()` y devuelve un `ReadableStream` con content-type `text/plain` o `text/event-stream`
- [ ] El frontend inicia el fetch antes de tener la respuesta completa y actualiza el estado con cada chunk recibido (`useState` con string acumulado)
- [ ] El texto se renderiza progresivamente en el UI — el usuario ve tokens aparecer en tiempo real
- [ ] Al finalizar el stream, el string acumulado es JSON válido parseable (`JSON.parse()` exitoso)
- [ ] Si el parse falla al finalizar, se muestra un error claro al usuario (no silencioso)
- [ ] El botón "Exportar Markdown" opera sobre el JSON ya parseado — no se activa hasta que el stream termina y el parse es exitoso
- [ ] El botón "Exportar PDF" igual: deshabilitado durante streaming, habilitado solo tras parse exitoso
- [ ] El botón "Generar spec" muestra estado de carga/deshabilitado durante el streaming
- [ ] Si el stream se interrumpe (red caída), el error se captura y se muestra al usuario

---

**No incluye**

- Cambios al prompt o a la estructura del JSON generado
- Server-Sent Events (SSE) ni WebSockets — basta con streaming via `fetch` nativo
- Animaciones o efectos visuales más allá del texto apareciendo progresivamente
- Persistencia del output (no hay base de datos)
- Cancelación del stream por parte del usuario
- Retry automático en caso de error
