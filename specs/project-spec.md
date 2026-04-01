# AI Spec Builder

## Especificación Técnica de Producto

_Basado en la Plantilla Spec-First para Claude_
_Créditos: dominicode | Construye con IA: De la Idea al Producto con Claude y Specs_

---

## Sección 1 — Visión del producto

AI Spec Builder convierte cualquier idea de producto en una especificación técnica completa en minutos, para que los emprendedores lleguen al desarrollo sin perder semanas en documentación.

---

## Sección 2 — Usuarios y casos de uso

**Usuario principal:** emprendedor no técnico con una idea de producto

**Casos de uso:**

- **Describir una idea en lenguaje natural:** y recibir una spec técnica estructurada lista para compartir con un desarrollador o agencia.
- **Pedir presupuesto a freelancers:** con un documento claro que evita malentendidos y cotizaciones vagas.
- **Iterar sobre la idea:** ajustar el alcance, añadir o quitar features, y regenerar la spec al instante.
- **Validar la viabilidad técnica:** antes de invertir en desarrollo, entendiendo qué implica construir lo que tienen en mente.

---

## Sección 3 — Funcionalidades

### Input

- El usuario puede describir su idea de producto en lenguaje natural, sin jerga técnica.
- El usuario puede responder preguntas guiadas para afinar el alcance (tipo de app, plataforma, usuarios, integraciones).
- El usuario puede indicar su presupuesto o plazo estimado para ajustar la spec.
- El sistema permite subir referencias o documentos de inspiración como contexto adicional.

### Output

- El sistema genera una especificación técnica estructurada con stack sugerido, arquitectura, features priorizadas y estimación de tiempos.
- El usuario puede descargar la spec en PDF o Word lista para compartir con desarrolladores o agencias.
- El usuario puede copiar la spec como texto para pegarla directamente en un correo o plataforma de freelancers.
- El sistema genera automáticamente un resumen ejecutivo de una página para validar la viabilidad antes de contratar.
- El usuario puede iterar sobre la spec regenerando secciones específicas sin empezar desde cero.

### Estados

- El usuario puede guardar borradores y retomar la spec en cualquier momento.
- El sistema permite gestionar múltiples proyectos o ideas en paralelo.
- El usuario puede ver un historial de versiones para comparar iteraciones anteriores.
- El sistema indica el estado de cada spec: borrador, completa o compartida.

---

## Sección 4 — Flujos de usuario

### Camino feliz — generación de spec completa

1. El usuario abre la app y ve una pantalla de bienvenida con un único campo de texto y la pregunta: "¿Qué quieres construir?"
2. El usuario escribe su idea en lenguaje natural. El sistema valida que haya suficiente contenido para continuar.
3. El sistema lanza entre 3 y 5 preguntas guiadas para afinar el alcance: plataforma, usuarios objetivo, integraciones clave, presupuesto estimado.
4. El sistema procesa las respuestas y genera la especificación técnica completa con indicador de progreso en tiempo real.
5. El usuario visualiza la spec estructurada por secciones y puede regenerar secciones específicas o ajustar parámetros.
6. El usuario descarga la spec en PDF o Word, o la copia como texto plano. El sistema guarda automáticamente una versión.

### Flujos de error

| Situación                                 | Qué hace el sistema                                                                                |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Descripción inicial demasiado vaga        | Pide al usuario que amplíe con un ejemplo concreto antes de continuar                              |
| Fallo en la generación de la spec         | Muestra mensaje claro, conserva las respuestas del usuario y ofrece reintentar sin perder contexto |
| Pérdida de conexión durante la generación | Guarda el progreso parcial y permite retomar cuando se restaure la conexión                        |
| Error en la exportación                   | Ofrece formato alternativo y permite copiar el contenido como texto plano                          |
| Timeout por respuesta lenta de la IA      | Notifica al usuario, genera una versión simplificada y ofrece completar en segundo plano           |

---

## Sección 5 — Arquitectura

### Stack tecnológico

| Capa     | Tecnología                        | Rol                                     |
| -------- | --------------------------------- | --------------------------------------- |
| Frontend | Next.js 16 + React + Tailwind CSS | UI y experiencia del usuario            |
| Backend  | API Routes de Next.js             | Lógica de negocio y comunicación con IA |
| IA       | Anthropic SDK (Claude)            | Generación de la especificación         |
| Deploy   | Vercel                            | Hosting, CI/CD y variables de entorno   |

### Decisiones clave

- **API Routes como backend:** evita la necesidad de un servidor separado. Toda la lógica vive en el mismo repositorio.
- **Streaming de respuesta:** desde Claude hacia el frontend para mostrar la spec generándose en tiempo real.
- **Sin base de datos en v1:** el estado de la sesión se gestiona en el cliente. La persistencia puede añadirse en v2 con Supabase.
- **Variables de entorno en Vercel:** para proteger la API key de Anthropic, nunca expuesta al cliente.

---

## Sección 6 — Requisitos no funcionales

### Rendimiento

- La spec debe comenzar a aparecer en pantalla en menos de 3 segundos desde el envío del formulario.
- El tiempo total de generación no debe superar los 45 segundos en condiciones normales.
- La app debe ser funcional en conexiones móviles estándar (4G).
- Las páginas deben cargar en menos de 2 segundos en primera visita.

### Seguridad

- La API key de Anthropic vive exclusivamente en variables de entorno de Vercel, nunca en el cliente.
- Todas las llamadas a la API Route van sobre HTTPS, gestionado automáticamente por Vercel.
- Se aplica rate limiting básico en la API Route para evitar abuso y costes inesperados.
- No se almacena ningún dato del usuario en base de datos en v1.
- Las entradas del usuario se sanitizan antes de construir el prompt para evitar prompt injection.

### Accesibilidad

- La interfaz cumple WCAG 2.1 nivel AA como mínimo.
- Todos los elementos interactivos son navegables por teclado.
- Los contrastes de color cumplen el ratio mínimo de 4.5:1 para texto normal.
- Los mensajes de error y estado son legibles por lectores de pantalla mediante atributos ARIA.

### Fuera del alcance — v1

| Fuera de alcance                      | Motivo                                                                             |
| ------------------------------------- | ---------------------------------------------------------------------------------- |
| Autenticación y cuentas de usuario    | Añade complejidad de backend significativa. Estado en cliente en v1.               |
| Base de datos y persistencia          | Sin cuentas no hay necesidad de persistir. Se puede añadir en v2 con Supabase.     |
| Planes de pago o suscripción          | Requiere integración con Stripe, lógica de billing y soporte.                      |
| Colaboración en tiempo real           | Edición simultánea tipo Notion/Figma. Fuera de alcance por complejidad.            |
| Integración con Jira, Linear o GitHub | Exportar tareas automáticamente queda para iteraciones futuras.                    |
| App móvil nativa                      | La web responsive cubre el caso de uso en v1.                                      |
| Soporte multiidioma (i18n)            | El producto se lanza en un solo idioma.                                            |
| Editor de spec enriquecido (WYSIWYG)  | En v1 el output es texto estructurado. Un editor complejo no aporta en esta etapa. |
| Historial de versiones                | Sin base de datos no es viable. Candidato natural para v2.                         |
| Estimaciones económicas de desarrollo | Calcular costes de desarrollo requiere datos de mercado y lógica compleja.         |

---
