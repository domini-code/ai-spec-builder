# AI Spec Builder

Herramienta web que genera especificaciones técnicas completas a partir de una descripción breve de tu idea de producto. Construida con Next.js y Claude (Anthropic).

**Proyecto del curso [Construye con IA: De la Idea al Producto con Claude](https://www.udemy.com/course/construye-con-ia-de-la-idea-al-producto-con-claude-code/?referralCode=AECD9EA3796054DEDD5D) — DominiCode / Bezael Pérez**

---

## ¿Qué hace?

Describes tu idea en lenguaje natural. El AI Spec Builder la convierte en una especificación técnica estructurada con 6 secciones:

1. Visión del producto
2. Usuarios y casos de uso
3. Funcionalidades
4. Flujos de usuario
5. Arquitectura
6. Requisitos no funcionales

El resultado lo puedes copiar directamente y usarlo como punto de partida con Claude Code.

---

## Stack

| Componente | Tecnología                        |
| ---------- | --------------------------------- |
| Frontend   | Next.js 16 + React + Tailwind CSS |
| Backend    | API Route de Next.js (Node.js)    |
| IA         | Anthropic SDK → Claude            |
| Deploy     | Vercel                            |

---

## Requisitos

- Node.js 18 o superior
- API key de Anthropic — [console.anthropic.com](https://console.anthropic.com)

---

## Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/ai-spec-builder.git
cd ai-spec-builder

# 2. Instala las dependencias
npm install

# 3. Configura las variables de entorno
cp .env.example .env.local
# Edita .env.local y añade tu API key de Anthropic

# 4. Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Variables de entorno

```env
ANTHROPIC_API_KEY=tu-api-key-aqui
```

La API key **nunca se sube a GitHub**. El archivo `.env.local` está incluido en `.gitignore`.

Consigue tu API key en [console.anthropic.com](https://console.anthropic.com) → API Keys.

---

## Cómo funciona

```
Usuario → textarea (descripción de la idea)
       → Next.js frontend
       → API Route /api/generate
       → Anthropic SDK → Claude
       → spec estructurada (6 secciones)
       → renderizado en la interfaz
       → copiar al portapapeles / exportar .md
```

El prompt del sistema instruye a Claude para generar siempre la misma estructura, asegurando un output consistente y usable.

---

## Estructura del proyecto

```
ai-spec-builder/
├── app/
│   ├── page.tsx              — Página principal (formulario + resultados)
│   ├── layout.tsx            — Layout global
│   └── api/
│       └── generate/
│           └── route.ts      — API Route: llama a Claude y devuelve la spec
├── components/
│   ├── SpecForm.tsx          — Formulario de entrada
│   └── SpecOutput.tsx        — Visualización de la spec generada
├── lib/
│   └── anthropic.ts          — Cliente de Anthropic SDK
├── .env.example              — Variables de entorno requeridas
├── CLAUDE.md                 — Contexto del proyecto para Claude Code
└── README.md
```

---

## Deploy en Vercel

1. Sube el proyecto a GitHub
2. Importa el repo en [vercel.com](https://vercel.com)
3. Añade `ANTHROPIC_API_KEY` en Settings → Environment Variables
4. Vercel detecta Next.js automáticamente — haz clic en Deploy

Cada push a `main` dispara un nuevo deploy automáticamente.

---

## CLAUDE.md

El proyecto incluye un `CLAUDE.md` con el contexto completo del producto. Si continúas el desarrollo con Claude Code, ese archivo le da a Claude todo el contexto necesario para entender el proyecto y hacer cambios coherentes.

---

## Recursos del curso

- [Repo de recursos](https://github.com/domini-code/construye-con-ia-recursos) — Plantillas, ejercicios y cheatsheets del curso
- [Plantilla Spec-First](https://dominicode.com/spec-driven-development) — Recurso gratuito
- [DominiCode](https://dominicode.com)

---

## El libro del método

**Spec-Driven Development** — el libro que va más allá del curso.

Si el curso te enseña a construir un producto de cero con IA, el libro te da el método completo para trabajar así en cualquier proyecto: desde la feature que te pide tu jefe hasta la app que llevas meses queriendo sacar.

Sin método, la IA te produce código. Con método, te produce el software que necesitas.

[→ Consigue el libro](https://leanpub.com/sdd-spec-driven-development)

---

## Curso en Udemy

[Construye con IA: De la Idea al Producto con Claude Code](https://www.udemy.com/course/construye-con-ia-de-la-idea-al-producto-con-claude-code/?referralCode=AECD9EA3796054DEDD5D)

---

## Herramienta bonus: AI Workflow Kit

**AI Workflow Kit** — skills, agentes y hooks para trabajar con IA de forma consistente y profesional.

Lo instalas una vez con `npx ai-workflow-kit` y tienes disponible en Claude Code:

- `/ak:commit` — genera mensajes de commit semánticos leyendo el diff real
- `/ak:pr` — crea PRs con descripción, test plan y checklist
- `/ak:plan` — planifica antes de ejecutar tareas complejas
- `/ak:review` — revisa código con criterios reales de ingeniería
- `/ak:debug` — diagnóstico estructurado antes de proponer fixes
- `/ak:vibe-audit` — auditoría completa de apps generadas con vibe coding

También incluye hooks automáticos: bloqueo de comandos destructivos, detección de API keys antes de hacer commit, formateo automático tras cada edición.

Compatible con Claude Code, Cursor y GitHub Copilot.

[→ Ver repositorio](https://github.com/bezael/ai-workflow-kit)

---
