'use client';

import { useState } from 'react';
import { validateSpecStructure, type Spec } from '@/lib/validate-spec';

interface SpecFormProps {
  onResult: (spec: Spec) => void;
  onStreamingChange?: (streaming: boolean) => void;
}

const MAX_CHARS = 2000;
const MIN_CHARS_FOR_GREEN = 100;

export default function SpecForm({ onResult, onStreamingChange }: SpecFormProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'An unexpected error occurred. Please try again.');
        return;
      }

      if (!res.body) {
        setError('An unexpected error occurred. Please try again.');
        return;
      }

      onStreamingChange?.(true);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
        }
      } catch {
        onStreamingChange?.(false);
        setError('La conexión se interrumpió. Por favor, intenta de nuevo.');
        return;
      }

      onStreamingChange?.(false);

      // Check for server-side error signal embedded in the stream
      if (accumulated.includes('\n\n__ERROR__:')) {
        setError('No se pudo generar la especificación. Por favor, intenta de nuevo.');
        return;
      }

      // Parse and validate the accumulated JSON
      let rawText = accumulated.trim();
      if (rawText.startsWith('```')) {
        rawText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        setError('No se pudo generar la especificación. Por favor, intenta de nuevo.');
        return;
      }

      if (!validateSpecStructure(parsed)) {
        setError('No se pudo generar la especificación. Por favor, intenta de nuevo.');
        return;
      }

      onResult(parsed);
    } catch {
      onStreamingChange?.(false);
      setError('Could not connect to the server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  const charCount = description.length;
  const counterColor =
    charCount >= MIN_CHARS_FOR_GREEN ? 'text-emerald-600 font-medium' : 'text-gray-400';

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="product-description"
            className="text-sm font-semibold text-gray-700"
          >
            Product description
          </label>
          <span className={`text-xs tabular-nums transition-colors ${counterColor}`}>
            {charCount} / {MAX_CHARS}
          </span>
        </div>
        <textarea
          id="product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          maxLength={MAX_CHARS}
          placeholder="Describe your product idea… e.g. an app for freelancers to manage their invoices and track payments"
          rows={6}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !description.trim()}
        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {loading ? (
          <>
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generating…
          </>
        ) : (
          'Generate specification'
        )}
      </button>

      {loading && (
        <p className="text-center text-sm text-gray-500 animate-pulse">
          Claude is analyzing your idea and building the spec. This may take a few seconds…
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}
