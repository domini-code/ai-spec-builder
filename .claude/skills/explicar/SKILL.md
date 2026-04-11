---
name: explicar
description: Lists files modified in the current session and explains in plain, non-technical language what changed and why it matters for the product. No jargon. Fits in one screen.
disable-model-invocation: true
---

# /explicar — ¿Qué cambió y por qué importa?

Tu objetivo es explicar los cambios recientes a alguien que conoce el producto pero no sabe programar. Sin jerga. Sin nombres de archivos ni comandos. Máximo una pantalla de texto.

---

## Pasos

### 1. Obtener los archivos modificados

Ejecuta en orden hasta obtener resultados:

```bash
# Cambios con respecto al último commit
git diff --name-only HEAD
```

Si no hay nada, prueba con cambios de los últimos commits de la sesión:

```bash
git diff --name-only HEAD~5 HEAD
```

### 2. Leer el contenido de los cambios

```bash
git diff HEAD
```

Lee el diff. No te interesa la sintaxis: interesa **qué hace diferente el producto ahora**.

### 3. Leer el contexto del producto

Lee [CLAUDE.md](../../../CLAUDE.md) para recordar para qué sirve esta aplicación y qué problema resuelve.

### 4. Redactar la explicación

Escribe la respuesta siguiendo esta estructura exacta. Máximo 300 palabras en total.

---

## ¿Qué cambió hoy?

**En pocas palabras:** [una sola frase que resuma todo el trabajo de la sesión]

### Lo que se hizo

Para cada cambio relevante, escribe un bloque así — sin mencionar nombres de archivos ni términos técnicos:

- **Qué:** describe la mejora o corrección en términos de experiencia de usuario o comportamiento visible del producto
- **Por qué importa:** explica el beneficio concreto para quien usa la aplicación

Agrupa cambios relacionados en un solo punto si tiene sentido. Ignora cambios menores de formato o configuración interna que no afectan la experiencia.

### Lo que el usuario nota ahora

Lista de 2 a 4 bullets con lo que alguien usando la app notaría diferente hoy respecto a ayer. Usa lenguaje de usuario: "ahora puedes…", "ya no ocurre que…", "la app es más rápida cuando…"

### Lo que no cambió

Una línea tranquilizadora si aplica: qué partes importantes del producto siguen igual y funcionando.

---

## Reglas de escritura

- Habla siempre desde la perspectiva del usuario o del producto, nunca del código
- Sustituye términos técnicos por equivalentes en español llano:
  - "endpoint" → "punto de conexión" o simplemente omítelo
  - "streaming" → "la respuesta aparece palabra por palabra en tiempo real"
  - "componente" → "sección" o "bloque de pantalla"
  - "API route" → "la lógica detrás de la pantalla"
  - "refactor" → "reorganización interna sin cambios visibles"
  - "bug fix" → "corrección de un error"
- Si no hubo cambios con impacto visible para el usuario, dilo directamente: "Los cambios de hoy son internos y no afectan lo que ves en pantalla."
- No uses listas anidadas, tablas ni encabezados de más de dos niveles
- No incluyas nombres de archivos, rutas ni fragmentos de código en la respuesta final
