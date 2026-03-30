'use client';

import { useState } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import FilterPanel from './filter-panel';

export default function FilterToggle({ makes }: { makes: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <FunnelIcon className="h-4 w-4" />
        Open Filters
      </button>

      {/* Mobile Filter Aside */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          {/* Aside Panel */}
          <aside className="fixed right-0 top-0 z-50 h-screen w-full overflow-y-auto bg-white shadow-lg sm:w-96 lg:hidden">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-4">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterPanel
                makes={makes}
                layout="vertical"
                onClose={() => setIsOpen(false)}
              />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
