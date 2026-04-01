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

function buildPrintHTML(spec: Spec): string {
  const featuresHTML = spec.features
    .map((f) => `<li>${f}</li>`)
    .join('');

  const flowsHTML = spec.flows
    .map(
      (flow, i) => `
        <div class="flow">
          <h3>Flow ${i + 1}: ${flow.name}</h3>
          <ol>${flow.steps.map((step) => `<li>${step}</li>`).join('')}</ol>
          <p class="error-path"><strong>Error path:</strong> ${flow.error_path}</p>
        </div>`
    )
    .join('');

  return `
    <h1>Technical Specification</h1>

    <h2>Vision</h2>
    <p>${spec.vision}</p>

    <h2>Target Users</h2>
    <p>${spec.users}</p>

    <h2>Features</h2>
    <ul>${featuresHTML}</ul>

    <h2>User Flows</h2>
    ${flowsHTML}

    <h2>Architecture</h2>
    <p>${spec.architecture}</p>

    <h2>Requirements</h2>
    <p>${spec.requirements}</p>
  `;
}

export function downloadPDF(spec: Spec): void {
  const container = document.createElement('div');
  container.id = 'print-target';
  container.innerHTML = buildPrintHTML(spec);
  document.body.appendChild(container);

  window.print();

  document.body.removeChild(container);
}
