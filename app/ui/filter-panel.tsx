'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import {
  ChevronDownIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useDebouncedCallback } from 'use-debounce';

const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor'] as const;
const BODY_TYPES = [
  'Sedan',
  'SUV',
  'Coupe',
  'Truck',
  'Van',
  'Convertible',
  'Hatchback',
  'Wagon',
  'Sports',
] as const;

export default function FilterPanel({ 
  makes, 
  layout = 'vertical',
  onClose,
}: { 
  makes: string[];
  layout?: 'horizontal' | 'vertical';
  onClose?: () => void;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const toggleArrayParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    const current = params.get(key)?.split(',').filter(Boolean) ?? [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    if (updated.length > 0) {
      params.set(key, updated.join(','));
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    replace(pathname);
  };

  const debouncedSet = useDebouncedCallback(
    (key: string, value: string) => setParam(key, value),
    300,
  );

  const selectedConditions =
    searchParams.get('conditions')?.split(',').filter(Boolean) ?? [];
  const selectedBodyTypes =
    searchParams.get('bodyTypes')?.split(',').filter(Boolean) ?? [];
  const selectedMakes =
    searchParams.get('makes')?.split(',').filter(Boolean) ?? [];
  const hasFilters =
    selectedConditions.length > 0 ||
    selectedBodyTypes.length > 0 ||
    selectedMakes.length > 0 ||
    searchParams.has('minPrice') ||
    searchParams.has('maxPrice') ||
    searchParams.has('minYear') ||
    searchParams.has('maxYear') ||
    searchParams.has('location');

  const sectionClass = layout === 'horizontal' 
    ? 'flex items-center gap-2'
    : 'rounded-xl border border-gray-200 bg-gray-50 px-3';

  if (layout === 'horizontal') {
    return (
      <div className="w-full">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            {/* Price Range */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Price
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 transition-colors hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  defaultValue={searchParams.get('minPrice') ?? ''}
                  onChange={(e) => debouncedSet('minPrice', e.target.value)}
                />
                <span className="text-xs font-medium text-gray-400">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 transition-colors hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  defaultValue={searchParams.get('maxPrice') ?? ''}
                  onChange={(e) => debouncedSet('maxPrice', e.target.value)}
                />
              </div>
            </div>

            {/* Year Range */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Year
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="From"
                  className="w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 transition-colors hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  defaultValue={searchParams.get('minYear') ?? ''}
                  onChange={(e) => debouncedSet('minYear', e.target.value)}
                />
                <span className="text-xs font-medium text-gray-400">to</span>
                <input
                  type="number"
                  placeholder="To"
                  className="w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 transition-colors hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  defaultValue={searchParams.get('maxYear') ?? ''}
                  onChange={(e) => debouncedSet('maxYear', e.target.value)}
                />
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Location
              </label>
              <input
                type="text"
                placeholder="City or state"
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 transition-colors hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                defaultValue={searchParams.get('location') ?? ''}
                onChange={(e) => debouncedSet('location', e.target.value)}
              />
            </div>

            {/* Make */}
            {makes.length > 0 && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Make
                </label>
                <select
                  multiple
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  defaultValue={selectedMakes}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                    if (selected.length > 0) {
                      setParam('makes', selected.join(','));
                    } else {
                      setParam('makes', '');
                    }
                  }}
                  size={1}
                >
                  <option value="">All Makes</option>
                  {makes.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Condition */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Condition
              </label>
              <select
                multiple
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                defaultValue={selectedConditions}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                  if (selected.length > 0) {
                    setParam('conditions', selected.join(','));
                  } else {
                    setParam('conditions', '');
                  }
                }}
                size={1}
              >
                <option value="">All Conditions</option>
                {CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            {/* Body Type */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Body Type
              </label>
              <select
                multiple
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                defaultValue={selectedBodyTypes}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                  if (selected.length > 0) {
                    setParam('bodyTypes', selected.join(','));
                  } else {
                    setParam('bodyTypes', '');
                  }
                }}
                size={1}
              >
                <option value="">All Types</option>
                {BODY_TYPES.map((bodyType) => (
                  <option key={bodyType} value={bodyType}>
                    {bodyType}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                <XMarkIcon className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vertical layout (for aside/mobile)
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FunnelIcon className="h-4 w-4" />
          Filters
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-3 w-3" />
              Clear all
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {/* Price Range */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Price
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 transition-colors hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              defaultValue={searchParams.get('minPrice') ?? ''}
              onChange={(e) => debouncedSet('minPrice', e.target.value)}
            />
            <span className="text-xs font-medium text-gray-400">to</span>
            <input
              type="number"
              placeholder="Max"
              className="w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 transition-colors hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              defaultValue={searchParams.get('maxPrice') ?? ''}
              onChange={(e) => debouncedSet('maxPrice', e.target.value)}
            />
          </div>
        </div>

        {/* Make */}
        {makes.length > 0 && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Make
            </label>
            <div className="flex flex-wrap gap-2">
              {makes.map((make) => (
                <label key={make} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedMakes.includes(make)}
                    onChange={() => toggleArrayParam('makes', make)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                  />
                  {make}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Year Range */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Year
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="From"
              className="w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 transition-colors hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              defaultValue={searchParams.get('minYear') ?? ''}
              onChange={(e) => debouncedSet('minYear', e.target.value)}
            />
            <span className="text-xs font-medium text-gray-400">to</span>
            <input
              type="number"
              placeholder="To"
              className="w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 transition-colors hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              defaultValue={searchParams.get('maxYear') ?? ''}
              onChange={(e) => debouncedSet('maxYear', e.target.value)}
            />
          </div>
        </div>

        {/* Condition */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Condition
          </label>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedConditions.includes(c)}
                  onChange={() => toggleArrayParam('conditions', c)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        {/* Body Type */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Body Type
          </label>
          <div className="flex flex-wrap gap-2">
            {BODY_TYPES.map((bt) => (
              <label key={bt} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedBodyTypes.includes(bt)}
                  onChange={() => toggleArrayParam('bodyTypes', bt)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                />
                {bt}
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Location
          </label>
          <input
            type="text"
            placeholder="City or state"
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 transition-colors hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            defaultValue={searchParams.get('location') ?? ''}
            onChange={(e) => debouncedSet('location', e.target.value)}
          />
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="mt-2 flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <XMarkIcon className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
