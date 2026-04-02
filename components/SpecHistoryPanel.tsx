'use client';

import { useEffect, useState } from 'react';
import { listSpecs, deleteSpec } from '@/lib/spec-history';
import type { SpecEntry } from '@/lib/spec-history';

interface SpecHistoryPanelProps {
  currentId: string | null;
  refreshKey: number;
  onSelect: (entry: SpecEntry) => void;
  onDelete: (id: string) => void;
}

function formatRelativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function SpecHistoryPanel({
  currentId,
  refreshKey,
  onSelect,
  onDelete,
}: SpecHistoryPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [entries, setEntries] = useState<SpecEntry[]>([]);

  useEffect(() => {
    setEntries(listSpecs());
  }, [refreshKey]);

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    deleteSpec(id);
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    onDelete(id);
  }

  return (
    <aside
      className={`flex flex-col shrink-0 border-r border-gray-200 bg-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-10'
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center justify-center h-10 w-10 shrink-0 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        title={isOpen ? 'Collapse history' : 'Expand history'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="px-4 pb-3 border-b border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Spec History
            </p>
          </div>

          <ul className="flex-1 overflow-y-auto py-2">
            {entries.length === 0 ? (
              <li className="px-4 py-6 text-center">
                <p className="text-xs text-gray-400 leading-relaxed">
                  No specs yet.
                  <br />
                  Generate one to get started.
                </p>
              </li>
            ) : (
              entries.map((entry) => {
                const isActive = entry.id === currentId;
                return (
                  <li key={entry.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelect(entry)}
                      onKeyDown={(e) => e.key === 'Enter' && onSelect(entry)}
                      className={`group w-full text-left px-4 py-3 flex flex-col gap-0.5 transition-colors hover:bg-gray-50 cursor-pointer ${
                        isActive ? 'bg-indigo-50 border-l-2 border-indigo-500' : 'border-l-2 border-transparent'
                      }`}
                    >
                      <span
                        className={`text-xs font-medium leading-snug line-clamp-2 ${
                          isActive ? 'text-indigo-700' : 'text-gray-700'
                        }`}
                      >
                        {entry.projectName}
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-gray-400">
                          {formatRelativeDate(entry.createdAt)}
                        </span>
                        <button
                          onClick={(e) => handleDelete(e, entry.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-opacity p-0.5 rounded"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </>
      )}
    </aside>
  );
}
