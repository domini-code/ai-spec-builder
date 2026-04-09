'use client';

import { useState, useRef, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';
import SpecForm from '@/components/SpecForm';
import SpecOutput from '@/components/SpecOutput';
import SpecSkeleton from '@/components/SpecSkeleton';
import SpecHistoryPanel from '@/components/SpecHistoryPanel';
import { saveSpec } from '@/lib/spec-history';
import type { Spec } from '@/lib/validate-spec';
import type { SpecEntry } from '@/lib/spec-history';

export default function Home() {
  const [spec, setSpec] = useState<Spec | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentSpecId, setCurrentSpecId] = useState<string | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ((isStreaming || spec) && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isStreaming, spec]);

  function handleResult(s: Spec) {
    const entry = saveSpec(s);
    setCurrentSpecId(entry.id);
    setHistoryRefresh((v) => v + 1);
    setIsStreaming(false);
    setSpec(s);
  }

  function handleReset() {
    setSpec(null);
    setIsStreaming(false);
    setCurrentSpecId(null);
  }

  function handleSelectHistory(entry: SpecEntry) {
    setSpec(entry.spec);
    setCurrentSpecId(entry.id);
    setIsStreaming(false);
  }

  function handleDeleteHistory(id: string) {
    setHistoryRefresh((v) => v + 1);
    if (currentSpecId === id) {
      setSpec(null);
      setCurrentSpecId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SpecHistoryPanel
        currentId={currentSpecId}
        refreshKey={historyRefresh}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
      />

      <main className="flex-1 px-4 py-16 overflow-y-auto">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-10 text-center relative">
            <div className="absolute right-0 top-0">
              <UserButton />
            </div>
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
              <SpecOutput spec={spec} isStreaming={isStreaming} onReset={handleReset} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
