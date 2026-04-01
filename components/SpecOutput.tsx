'use client';

import { useState, useEffect } from 'react';
import { downloadMarkdown } from '@/lib/markdown-export';
import { downloadPDF } from '@/lib/pdf-export';

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

interface SpecOutputProps {
  spec: Spec;
  onReset: () => void;
}

// Icons as inline SVG components
function IconVision() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconFeatures() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

function IconFlows() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function IconArchitecture() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function IconRequirements() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconDocument() {
  return (
    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function SectionHeader({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div className={`flex items-center gap-2 mb-4 ${color}`}>
      {icon}
      <h3 className="text-sm font-semibold uppercase tracking-widest">{label}</h3>
    </div>
  );
}

// Split features by user-facing vs system-facing
function groupFeatures(features: string[]) {
  const user = features.filter((f) => f.toLowerCase().startsWith('el usuario'));
  const system = features.filter((f) => !f.toLowerCase().startsWith('el usuario'));
  return { user, system };
}

// Split requirement sentences into included / excluded heuristically
function splitRequirements(requirements: string) {
  const sentences = requirements
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const excluded: string[] = [];
  const included: string[] = [];

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    if (
      lower.includes('no ') ||
      lower.includes('sin ') ||
      lower.includes('exclu') ||
      lower.includes('fuera del alcance') ||
      lower.includes('out of scope') ||
      lower.includes('not ')
    ) {
      excluded.push(sentence);
    } else {
      included.push(sentence);
    }
  }

  return { included, excluded };
}

// Build plain text for clipboard
function buildPlainText(spec: Spec): string {
  const lines: string[] = [];

  lines.push('=== TECHNICAL SPECIFICATION ===\n');

  lines.push('--- VISION ---');
  lines.push(spec.vision);
  lines.push('');

  lines.push('--- TARGET USERS ---');
  lines.push(spec.users);
  lines.push('');

  lines.push('--- FEATURES ---');
  spec.features.forEach((f, i) => lines.push(`${i + 1}. ${f}`));
  lines.push('');

  lines.push('--- USER FLOWS ---');
  spec.flows.forEach((flow, i) => {
    lines.push(`\nFlow ${i + 1}: ${flow.name}`);
    flow.steps.forEach((step, j) => lines.push(`  ${j + 1}. ${step}`));
    lines.push(`  Error: ${flow.error_path}`);
  });
  lines.push('');

  lines.push('--- ARCHITECTURE ---');
  lines.push(spec.architecture);
  lines.push('');

  lines.push('--- REQUIREMENTS ---');
  lines.push(spec.requirements);

  return lines.join('\n');
}

function ExportButton({ spec }: { spec: Spec }) {
  const [exporting, setExporting] = useState(false);

  function handleExport() {
    setExporting(true);
    downloadMarkdown(spec);
    setTimeout(() => setExporting(false), 1500);
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition disabled:opacity-60"
    >
      {exporting ? (
        <>
          <svg className="h-4 w-4 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
          </svg>
          Exporting...
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export .md
        </>
      )}
    </button>
  );
}

function ExportPDFButton({ spec }: { spec: Spec }) {
  const [exporting, setExporting] = useState(false);

  function handleExport() {
    setExporting(true);
    downloadPDF(spec);
    setTimeout(() => setExporting(false), 1500);
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition disabled:opacity-60"
    >
      {exporting ? (
        <>
          <svg className="h-4 w-4 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
          </svg>
          Exporting...
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export .pdf
        </>
      )}
    </button>
  );
}

function CopyButton({ spec }: { spec: Spec }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(buildPlainText(spec));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
    >
      {copied ? (
        <>
          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function SpecOutput({ spec, onReset }: SpecOutputProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const { user: userFeatures, system: systemFeatures } = groupFeatures(spec.features);
  const { included, excluded } = splitRequirements(spec.requirements);

  return (
    <div
      className={`flex flex-col gap-6 transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Output header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <IconDocument />
          <h2 className="text-xl font-bold text-gray-900">Technical Specification</h2>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton spec={spec} />
          <ExportPDFButton spec={spec} />
          <CopyButton spec={spec} />
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0a8 8 0 01-8 8 8 8 0 01-8-8 8 8 0 018-8 8 8 0 018 8z" />
            </svg>
            New spec
          </button>
        </div>
      </div>

      {/* 1. Vision — consistent card with indigo tint */}
      <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 shadow-sm">
        <SectionHeader icon={<IconVision />} label="Vision" color="text-indigo-600" />
        <p className="text-lg leading-relaxed font-medium text-indigo-900">{spec.vision}</p>
      </section>

      {/* 2. Users — card */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <SectionHeader icon={<IconUsers />} label="Target Users" color="text-sky-600" />
        <div className="rounded-xl bg-sky-50 border border-sky-100 p-4">
          <p className="text-gray-700 leading-relaxed">{spec.users}</p>
        </div>
      </section>

      {/* 3. Features — grouped list */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <SectionHeader icon={<IconFeatures />} label="Features" color="text-emerald-600" />
        <div className="flex flex-col gap-4">
          {userFeatures.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500 mb-2">
                User capabilities
              </p>
              <ul className="flex flex-col gap-2">
                {userFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {systemFeatures.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400 mb-2">
                System behaviors
              </p>
              <ul className="flex flex-col gap-2">
                {systemFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-300" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 4. Flows — numbered steps + error path */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <SectionHeader icon={<IconFlows />} label="User Flows" color="text-amber-600" />
        <div className="flex flex-col gap-5">
          {spec.flows.map((flow, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                  {i + 1}
                </span>
                <p className="font-semibold text-gray-900">{flow.name}</p>
                <span className="ml-auto text-xs font-medium rounded-full bg-green-100 text-green-700 px-2 py-0.5">
                  Happy path
                </span>
              </div>
              <ol className="mb-3 flex flex-col gap-1.5 pl-2">
                {flow.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-xs font-semibold text-amber-800">
                      {j + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                <span className="text-xs font-semibold rounded-full bg-red-100 text-red-600 px-2 py-0.5 flex-shrink-0 mt-0.5">
                  Error path
                </span>
                <p className="text-sm text-red-700">{flow.error_path}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Architecture */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <SectionHeader icon={<IconArchitecture />} label="Architecture" color="text-violet-600" />
        <div className="rounded-xl bg-violet-50 border border-violet-100 p-4">
          <p className="text-gray-700 leading-relaxed">{spec.architecture}</p>
        </div>
      </section>

      {/* 6. Requirements — included / excluded */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <SectionHeader icon={<IconRequirements />} label="Requirements" color="text-rose-600" />
        <div className="flex flex-col gap-4">
          {included.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-green-600 mb-2">
                Included
              </p>
              <ul className="flex flex-col gap-2">
                {included.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {excluded.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-500 mb-2">
                Out of scope
              </p>
              <ul className="flex flex-col gap-2">
                {excluded.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {included.length === 0 && excluded.length === 0 && (
            <p className="text-gray-700 leading-relaxed">{spec.requirements}</p>
          )}
        </div>
      </section>
    </div>
  );
}
