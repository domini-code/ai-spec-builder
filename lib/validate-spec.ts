export interface Flow {
  name: string;
  steps: string[];
  error_path: string;
}

export interface Spec {
  vision: string;
  users: string;
  features: string[];
  flows: Flow[];
  architecture: string;
  requirements: string;
}

const REQUIRED_KEYS = ['vision', 'users', 'features', 'flows', 'architecture', 'requirements'] as const;

export function validateSpecStructure(obj: unknown): obj is Spec {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return false;
  const record = obj as Record<string, unknown>;
  if (!REQUIRED_KEYS.every((key) => key in record)) return false;
  if (typeof record.vision !== 'string' || record.vision.trim() === '') return false;
  if (typeof record.users !== 'string' || record.users.trim() === '') return false;
  if (typeof record.architecture !== 'string' || record.architecture.trim() === '') return false;
  if (typeof record.requirements !== 'string' || record.requirements.trim() === '') return false;
  if (!Array.isArray(record.features) || record.features.length < 5 || record.features.length > 8) return false;
  if (!Array.isArray(record.flows) || record.flows.length < 3 || record.flows.length > 5) return false;
  const validFlows = (record.flows as unknown[]).every(
    (f) =>
      typeof f === 'object' &&
      f !== null &&
      typeof (f as Record<string, unknown>).name === 'string' &&
      Array.isArray((f as Record<string, unknown>).steps) &&
      typeof (f as Record<string, unknown>).error_path === 'string',
  );
  return validFlows;
}
