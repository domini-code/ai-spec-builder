'use client';

import { useState, useRef, useEffect } from 'react';
import SpecForm from '@/components/SpecForm';
import SpecOutput from '@/components/SpecOutput';

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

export default function Home() {
  const [spec, setSpec] = useState<Spec | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (spec && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [spec]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">
            AI Spec Builder
          </h1>
          <p className="text-lg text-gray-500">
            Convert any product idea into a complete technical specification in minutes.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <SpecForm onResult={(s) => setSpec(s)} />
        </div>

        {/* Spec output */}
        {spec && (
          <div ref={outputRef} className="mt-10">
            <SpecOutput spec={spec} onReset={() => setSpec(null)} />
          </div>
        )}
      </div>
    </main>
  );
}
