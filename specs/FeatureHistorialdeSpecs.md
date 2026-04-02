# Feature: Historial de Specs (localStorage)

## Objetivo

Persistir cada spec generada en localStorage para que el usuario pueda recuperar specs anteriores sin regenerarlas.

---

## 1. Esquema de datos en localStorage

**Clave:** `"spec-history"`
**Valor:** Array JSON de `SpecEntry[]`

```typescript
interface SpecEntry {
  id: string;          // crypto.randomUUID()
  projectName: string; // Primeros ~60 chars de spec.vision (truncado + "...")
  createdAt: string;   // ISO 8601, ej: "2026-04-02T15:30:00.000Z"
  spec: Spec;          // El objeto Spec completo tal como llega de la API
}
```

- `projectName` se deriva automáticamente de `spec.vision` al guardar.
- Límite: **20 entradas** (FIFO — se descarta la más antigua si se supera).

---

## 2. Funciones de acceso — `lib/spec-history.ts`

| Función | Firma | Descripción |
|---|---|---|
| `saveSpec` | `(spec: Spec) => SpecEntry` | Crea entrada, prepend al array, aplica límite de 20, persiste. Devuelve la entrada creada. |
| `listSpecs` | `() => SpecEntry[]` | Lee y parsea localStorage. Devuelve `[]` si vacío o corrupto. |
| `getSpec` | `(id: string) => SpecEntry \| null` | Busca por id. |
| `renameSpec` | `(id: string, name: string) => void` | Muta `projectName` y persiste. |
| `deleteSpec` | `(id: string) => void` | Filtra la entrada y persiste. |

Todas las funciones verifican `typeof window !== 'undefined'` (SSR-safe).

---

## 3. Punto de guardado

En `page.tsx`, dentro de `handleResult(s: Spec)`, justo antes de `setSpec(s)`:

```
handleResult(s) {
  const entry = saveSpec(s)      // nuevo
  setCurrentSpecId(entry.id)     // nuevo
  setSpec(s)
  setIsStreaming(false)
}
```

No se guarda durante el streaming (la spec no está validada hasta que `handleResult` es llamado).

---

## 4. Nuevo componente: `SpecHistoryPanel`

**Archivo:** `components/SpecHistoryPanel.tsx`

**Props:**
```typescript
interface SpecHistoryPanelProps {
  currentId: string | null;
  refreshKey: number;
  onSelect: (entry: SpecEntry) => void;
  onDelete: (id: string) => void;
}
```

**Comportamiento:**
- Lee historial con `listSpecs()` al montar y cuando `refreshKey` cambia.
- Panel lateral izquierdo colapsable (~260px).
- Cada entrada muestra: nombre del proyecto, fecha relativa, botón de eliminar.
- Resalta con borde la entrada con `id === currentId`.
- Estado vacío si no hay entradas.

---

## 5. Componentes modificados

| Componente | Cambios |
|---|---|
| `app/page.tsx` | Añade estado `currentSpecId` y `historyRefresh`. Llama `saveSpec` en `handleResult`. Añade handlers `handleSelectHistory` y `handleDeleteHistory`. Añade `SpecHistoryPanel` al layout. |
| `app/layout.tsx` | Sin cambios (el layout flex se gestiona en `page.tsx`). |

`SpecOutput`, `SpecForm`, `SpecSkeleton` y `lib/*` **no se modifican**.

---

## 6. Garantía de restauración de estado

```
handleSelectHistory(entry: SpecEntry) {
  setSpec(entry.spec)        // mismo objeto Spec original
  setCurrentSpecId(entry.id)
  setIsStreaming(false)      // garantiza que SpecOutput se muestra
}
```

Los botones de exportar (`ExportButton`, `ExportPDFButton`, `CopyButton`) leen `spec` directamente en tiempo de ejecución — restaurar `spec` restaura exactamente lo que exportarían.
