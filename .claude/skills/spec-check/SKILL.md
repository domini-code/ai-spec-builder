---
name: spec-check
description: Reads all files in specs/, detects contradictions between sections, flags vague or under-specified requirements, and returns a prioritised list of questions to resolve before building. Read-only — never modifies anything.
disable-model-invocation: true
---

# /spec-check — Auditoría de especificaciones

Tu único rol es leer y analizar. No corrijas nada, no reescribas nada, no hagas sugerencias de implementación. Solo reporta lo que encontraste y qué necesita ser aclarado antes de que empiece el desarrollo.

---

## Pasos — ejecútalos en orden

### 1. Leer todas las especificaciones

Lee los siguientes archivos en su totalidad:

- [specs/project-spec.md](../../../specs/project-spec.md) — spec maestra del producto
- Cada archivo en [specs/](../../../specs/) que empiece por `Feature` — una spec por feature

Mientras lees, construye internamente dos listas:
- **Promesas explícitas**: todo lo que la spec dice que el sistema hará, mostrará, permitirá o garantizará
- **Restricciones declaradas**: todo lo que la spec dice que está fuera de alcance, prohibido o diferido a v2

### 2. Leer las restricciones del proyecto

Lee [CLAUDE.md](../../../CLAUDE.md) y añade sus reglas a la lista de restricciones declaradas.

### 3. Detectar contradicciones

Compara la lista de promesas contra la lista de restricciones. Busca también contradicciones entre archivos de feature entre sí.

Patrones a detectar:

| Tipo de contradicción | Ejemplo en este proyecto |
|---|---|
| Feature prometida vs. restricción de alcance | `project-spec.md` lista "Historial de specs" en Features pero también declara "Historial de versiones: fuera de alcance — sin base de datos no es viable" |
| Feature prometida vs. restricción técnica | Una feature requiere autenticación pero `project-spec.md` dice "No authentication — fully public" en CLAUDE.md |
| Dos features con comportamiento incompatible | Una feature guarda estado en cliente y otra asume persistencia en servidor |
| Misma feature descrita de forma distinta en dos archivos | El flujo de usuario en `project-spec.md` no coincide con el flujo en `FeatureXxx.md` |
| Requisito no funcional incumplible con el stack declarado | Se exige persistencia entre sesiones pero no hay base de datos en v1 |

### 4. Detectar secciones vagas

Una sección es vaga si, para construirla, un desarrollador tendría que inventar o asumir información que la spec no da.

Criterios de vaguedad:

- **Sin criterio de éxito medible**: "la app debe ser rápida" sin umbral numérico
- **Comportamiento no especificado para casos límite**: ¿qué pasa si el usuario no rellena un campo obligatorio? ¿si la IA devuelve texto vacío?
- **Sujeto ambiguo**: "el sistema guarda automáticamente" — ¿dónde? ¿cuándo exactamente? ¿durante cuánto tiempo?
- **Condición sin definir**: "si hay suficiente contenido para continuar" — ¿cuántos caracteres? ¿qué valida el sistema?
- **Tecnología referenciada sin especificar integración**: "Login con Clerk" sin describir el flujo de autenticación, redirección o sesión
- **Formato de output no especificado**: "exportar en PDF o Word" sin definir estructura del documento, fuentes, márgenes o metadatos
- **Término sin definir**: "resumen ejecutivo de una página" — ¿qué secciones contiene? ¿qué longitud máxima?

### 5. Construir el reporte

Presenta los hallazgos con esta estructura exacta. No añadas secciones adicionales.

---

## Reporte de spec-check

### Archivos analizados
Lista todos los archivos leídos.

### Contradicciones encontradas

Para cada contradicción:

**C[n] — [Título breve]**
- **Archivos en conflicto**: nombra los dos archivos o secciones que se contradicen
- **Qué dice A**: cita textual o paráfrasis exacta de la primera fuente
- **Qué dice B**: cita textual o paráfrasis exacta de la segunda fuente
- **Por qué bloquea**: una frase sobre qué decisión de diseño o implementación queda paralizada hasta resolver esto
- **Pregunta a responder**: formula la pregunta concreta que el product owner debe contestar

### Secciones vagas o incompletas

Para cada sección vaga:

**V[n] — [Título breve]**
- **Ubicación**: archivo y sección o párrafo exacto
- **Qué está sin definir**: describe el hueco de información en una o dos frases
- **Qué podría ocurrir si no se aclara**: consecuencia concreta en desarrollo (el dev asume X, el producto se comporta diferente a lo esperado, imposible testear, etc.)
- **Pregunta a responder**: formula la pregunta concreta que el product owner debe contestar

### Resumen ejecutivo

Una tabla con todos los puntos encontrados, ordenada de mayor a menor urgencia:

| ID | Tipo | Título | Urgencia |
|---|---|---|---|
| C1 | Contradicción | … | Alta / Media / Baja |
| V1 | Vaguedad | … | Alta / Media / Baja |

**Criterio de urgencia:**
- **Alta** — bloquea o paraliza el desarrollo de una feature core
- **Media** — genera deuda de decisión pero permite avanzar con un supuesto documentado
- **Baja** — edge case o detalle que puede resolverse durante la implementación sin riesgo alto

### Puntos que están bien definidos
Lista breve de secciones que revisaste y están suficientemente claras. Confirma que la auditoría fue exhaustiva.

---

> No modifiques ningún archivo. No propongas texto de reemplazo para las specs. Solo reporta y formula preguntas.
