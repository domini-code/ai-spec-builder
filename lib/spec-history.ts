import type { Spec } from '@/lib/validate-spec';

export interface SpecEntry {
  id: string;
  projectName: string;
  createdAt: string;
  spec: Spec;
}

const STORAGE_KEY = 'spec-history';
const MAX_ENTRIES = 20;

function deriveProjectName(vision: string): string {
  const clean = vision.trim().replace(/\s+/g, ' ');
  if (clean.length <= 60) return clean;
  return clean.slice(0, 60).trimEnd() + '…';
}

function readStorage(): SpecEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(entries: SpecEntry[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function saveSpec(spec: Spec): SpecEntry {
  const entry: SpecEntry = {
    id: crypto.randomUUID(),
    projectName: deriveProjectName(spec.vision),
    createdAt: new Date().toISOString(),
    spec,
  };
  const existing = readStorage();
  const updated = [entry, ...existing].slice(0, MAX_ENTRIES);
  writeStorage(updated);
  return entry;
}

export function listSpecs(): SpecEntry[] {
  return readStorage();
}

export function getSpec(id: string): SpecEntry | null {
  return readStorage().find((e) => e.id === id) ?? null;
}

export function renameSpec(id: string, name: string): void {
  const entries = readStorage().map((e) =>
    e.id === id ? { ...e, projectName: name } : e,
  );
  writeStorage(entries);
}

export function deleteSpec(id: string): void {
  writeStorage(readStorage().filter((e) => e.id !== id));
}
