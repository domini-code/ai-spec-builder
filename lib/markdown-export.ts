interface Flow {
  name: string;
  steps: string[];
  error_path: string;
}

interface Spec {
  vision: string;
  users: string;
  features: string[];
  flows: Flow[];
  architecture: string;
  requirements: string;
}

export function buildMarkdown(spec: Spec): string {
  const lines: string[] = [];

  lines.push('# Technical Specification\n');

  lines.push('## Vision\n');
  lines.push(spec.vision);
  lines.push('');

  lines.push('## Target Users\n');
  lines.push(spec.users);
  lines.push('');

  lines.push('## Features\n');
  spec.features.forEach((f) => lines.push(`- ${f}`));
  lines.push('');

  lines.push('## User Flows\n');
  spec.flows.forEach((flow, i) => {
    lines.push(`### Flow ${i + 1}: ${flow.name}\n`);
    lines.push('**Happy path**\n');
    flow.steps.forEach((step, j) => lines.push(`${j + 1}. ${step}`));
    lines.push('');
    lines.push(`**Error path:** ${flow.error_path}`);
    lines.push('');
  });

  lines.push('## Architecture\n');
  lines.push(spec.architecture);
  lines.push('');

  lines.push('## Requirements\n');
  lines.push(spec.requirements);

  return lines.join('\n');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50);
}

export function downloadMarkdown(spec: Spec): void {
  const content = buildMarkdown(spec);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const filename = spec.vision ? `spec-${slugify(spec.vision)}.md` : 'spec.md';

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}
