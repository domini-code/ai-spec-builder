# Feature Spec: Export Spec as Markdown

---

**Qué hace**
Añade un botón "Export .md" que descarga la spec generada como archivo Markdown en el navegador del usuario, sin ninguna llamada al servidor.

---

**Por qué**
La spec vive en el navegador pero el usuario necesita llevarla a GitHub, Notion, o compartirla con su equipo. Sin exportación, tiene que copiar manualmente el texto y re-formatear.

---

**Criterios de aceptación**

- [ ] El botón "Export .md" aparece solo cuando hay una spec generada (no antes)
- [ ] Al hacer clic se descarga un archivo `.md` con el nombre `spec-[slug-del-título].md`
- [ ] El contenido del archivo es Markdown válido que renderiza correctamente en GitHub
- [ ] Los headings, listas y código de la spec se preservan sin pérdida de formato
- [ ] La descarga ocurre 100% en el cliente (sin round-trip al servidor)
- [ ] El botón muestra feedback visual durante la descarga (estado "Exporting...")

---

**No incluye**

- Exportación a PDF, DOCX u otros formatos
- Subida automática a GitHub, Notion, Google Docs u otras plataformas
- Configuración del formato o template del Markdown exportado
- Previsualización del Markdown antes de descargar
- Historial de exportaciones o cualquier forma de persistencia
