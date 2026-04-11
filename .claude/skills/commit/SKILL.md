---
name: commit
description: Reviews staged changes with git diff --staged, infers the Conventional Commits type, and creates a commit with a message written in Spanish. Must be invoked explicitly by the developer.
disable-model-invocation: true
---

# /commit — Conventional Commits en español

Vas a preparar y ejecutar un commit con un mensaje que sigue la especificación **Conventional Commits**, con la descripción escrita en **español**.

No modifiques ningún archivo fuente. Tu único efecto sobre el repositorio es el commit mismo.

---

## Pasos — ejecútalos en orden

### 1. Verificar que hay cambios preparados

Ejecuta:

```bash
git diff --staged --stat
```

Si la salida está vacía, detente y avisa:

> No hay cambios en el staging area. Usa `git add <archivos>` antes de invocar /commit.

No continúes hasta que haya al menos un archivo staged.

### 2. Leer el diff completo

Ejecuta:

```bash
git diff --staged
```

Lee el diff en su totalidad. Presta atención a:

- Qué archivos cambiaron y en qué directorios viven (`app/`, `components/`, `lib/`, `specs/`, `.claude/`, config, etc.)
- Si se añaden, eliminan o modifican funcionalidades
- Si el cambio es de código, documentación, configuración, tests, refactor o estilo

### 3. Consultar commits recientes para mantener coherencia de estilo

Ejecuta:

```bash
git log --oneline -10
```

Observa el patrón de mensajes ya usado en el proyecto (longitud, idioma de la descripción, uso de scope, etc.) y adáptate si hay convenciones establecidas que no contradigan las reglas de esta skill.

### 4. Determinar el tipo Conventional Commits

Elige **un solo tipo** de esta tabla:

| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Nueva funcionalidad visible para el usuario o para la API pública |
| `fix` | Corrección de un bug |
| `docs` | Cambios solo en documentación (README, specs, CLAUDE.md, comentarios) |
| `style` | Formato, espaciado, punto y coma — sin cambio de lógica |
| `refactor` | Reestructuración de código que no añade funcionalidad ni corrige un bug |
| `perf` | Mejora de rendimiento |
| `test` | Añadir o corregir tests |
| `chore` | Tareas de mantenimiento: dependencias, config, scripts de build, skills |
| `ci` | Cambios en pipelines de CI/CD |
| `revert` | Reversión de un commit anterior |

**Regla de desempate:** si el diff mezcla tipos, elige el de mayor impacto. Si hay un `feat` y un `style` en el mismo diff, el tipo es `feat`.

### 5. Determinar el scope (opcional pero recomendado)

El scope va entre paréntesis después del tipo: `feat(api)`, `fix(streaming)`, `chore(skills)`.

Usa el nombre del módulo, directorio o feature afectada. Ejemplos:

- Cambios en `app/api/` → scope `api`
- Cambios en `components/` → scope `ui` o el nombre del componente
- Cambios en `lib/` → scope `lib`
- Cambios en `specs/` → scope `specs`
- Cambios en `.claude/skills/` → scope `skills`
- Cambios en configuración raíz → scope `config`

Omite el scope solo si el cambio es verdaderamente transversal.

### 6. Redactar el mensaje

Formato obligatorio:

```
<tipo>(<scope>): <descripción en español en imperativo presente>

[cuerpo opcional — solo si el cambio necesita contexto adicional]

[pie opcional — referencias a issues, breaking changes]
```

Reglas para la descripción:

- **Imperativo presente**: "añade", "corrige", "elimina", "extrae", "actualiza" — no "añadido", "corrigiendo"
- **Minúscula** al inicio, sin punto final
- **Máximo 72 caracteres** en la primera línea (tipo + scope + descripción)
- **En español** — la descripción y el cuerpo van en español; el tipo y el scope van en inglés (son palabras clave de la especificación)

Si hay un breaking change, añade `!` tras el scope y una sección `BREAKING CHANGE:` en el pie:

```
feat(api)!: cambia el contrato de respuesta del endpoint de specs

BREAKING CHANGE: el campo `spec` pasa a llamarse `content` en todos los consumers.
```

### 7. Mostrar el mensaje antes de hacer el commit

Muestra el mensaje completo al desarrollador y pide confirmación explícita:

```
Mensaje de commit preparado:

──────────────────────────────────────────
<tipo>(<scope>): <descripción>

<cuerpo si aplica>
──────────────────────────────────────────

¿Procedo con el commit? (responde "sí" para confirmar o indícame qué cambiar)
```

**No ejecutes el commit hasta recibir confirmación.**

### 8. Ejecutar el commit

Solo tras confirmación explícita, ejecuta:

```bash
git commit -m "$(cat <<'EOF'
<tipo>(<scope>): <descripción>

<cuerpo si aplica>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

### 9. Confirmar resultado

Ejecuta `git log --oneline -1` y muestra la línea resultante al desarrollador para que pueda verificar que el commit quedó registrado correctamente.

---

> Recuerda: nunca uses `--no-verify`, nunca modifiques archivos fuente, y nunca hagas push salvo que el desarrollador lo pida explícitamente después del commit.
