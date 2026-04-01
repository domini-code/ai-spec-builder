# Feature: Export Spec as PDF

## Qué hace

Añade un botón "Export .pdf" junto al botón "Export .md" existente en `SpecOutput.tsx`. Al pulsarlo, genera y descarga un PDF con la spec completa: H1 para el nombre del proyecto, H2 para cada sección, listas para features y flujos.

---

## Por qué

El caso de uso principal del AI Spec Builder es compartir la spec con desarrolladores y agencias. El PDF es el formato universal para ese intercambio — no requiere herramientas externas ni acceso a internet por parte del receptor, a diferencia del `.md`.

---

## Criterios de aceptación

- [ ] El botón "Export .pdf" aparece a la derecha del botón "Export .md", con el mismo estilo visual (mismo `className` base)
- [ ] El PDF generado tiene H1 con el título del proyecto (inferido del campo `vision`), H2 por cada sección (Vision, Target Users, Features, User Flows, Architecture, Requirements)
- [ ] Las features y los pasos de cada flow se renderizan como listas (`<ul>`/`<ol>`), no como párrafos de texto corrido
- [ ] El botón muestra estado de carga (`Exporting...` + spinner) mientras se genera, idéntico al comportamiento del botón de Markdown
- [ ] El PDF se descarga con el nombre `spec.pdf`
- [ ] La implementación usa `window.print()` con una sección oculta estilizada vía `@media print` — **sin librerías externas** (jsPDF, html2pdf, etc.). La razón: el stack ya no depende de npm adicional, Vercel no requiere cambios, y `window.print()` produce output limpio si el CSS de impresión está bien definido
- [ ] Los estilos de color/background de Tailwind se reemplazan en `@media print` por texto negro sobre blanco para garantizar imprimibilidad

---

## No incluye

- **Personalización del PDF** (fuentes, colores, logo): el formato es fijo y funcional; la customización es una feature separada
- **Preview del PDF antes de descargar**: añade complejidad de UI sin valor claro en este caso de uso
- **Soporte para navegadores sin `window.print()`**: todos los browsers modernos soportados por Next.js lo implementan
- **Generación server-side del PDF**: no hay backend que lo justifique; el PDF se genera 100% en cliente
- **Nombre de archivo dinámico basado en el proyecto**: el scope es un nombre fijo `spec.pdf`; renombrar es trivial para el usuario

---

## Decisión clave

Se usa `window.print()` en lugar de `jsPDF` o `html2pdf`. El trade-off es que el usuario ve el diálogo nativo de impresión del OS (un clic extra), pero a cambio no se añade ninguna dependencia externa, el PDF respeta las preferencias del sistema, y el mantenimiento es cero. Si el diálogo nativo resulta ser fricción real para los usuarios, migrar a `jsPDF` es un cambio de una función en `lib/`.
