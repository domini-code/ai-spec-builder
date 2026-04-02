'use client';

import { useState, useRef, useEffect } from 'react';
import SpecForm from '@/components/SpecForm';
import SpecOutput from '@/components/SpecOutput';
import SpecSkeleton from '@/components/SpecSkeleton';
import type { Spec } from '@/lib/validate-spec';

export default function Home() {
  const [spec, setSpec] = useState<Spec | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ((isStreaming || spec) && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isStreaming, spec]);

  function handleResult(s: Spec) {
    setIsStreaming(false);
    setSpec(s);
  }

  function handleReset() {
    setSpec(null);
    setIsStreaming(false);
  }

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
          <SpecForm
            onResult={handleResult}
            onStreamingChange={setIsStreaming}
          />
        </div>

        {/* Skeleton while streaming */}
        {isStreaming && !spec && (
          <div ref={outputRef} className="mt-10">
            <SpecSkeleton />
          </div>
        )}

        {/* Spec output once done */}
        {spec && (
          <div ref={outputRef} className="mt-10">
            <SpecOutput spec={spec} onReset={handleReset} />
          </div>
        )}
      </div>
    </main>
  );
}
