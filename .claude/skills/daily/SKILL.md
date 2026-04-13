---
name: daily
description: Resume el trabajo del día según git log y CLAUDE.md
argument-hint: [proyecto]
---

Genera el resumen de hoy para $ARGUMENTS[0].
Lee el git log de las últimas 8 horas y el CLAUDE.md.
Escribe: qué se hizo, qué falta, próximo paso.
