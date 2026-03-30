import { Suspense } from 'react';
import { fetchAuctions, fetchAuctionsPages, fetchDistinctMakes } from '@/app/lib/data';
import { AuctionGrid } from '@/app/ui/auctions/auction-card';

export const dynamic = 'force-dynamic';
import { AuctionGridSkeleton } from '@/app/ui/skeletons';
import Search from '@/app/ui/search';
import Pagination from '@/app/ui/pagination';
import FilterPanel from '@/app/ui/filter-panel';
import FilterToggle from '@/app/ui/filter-toggle';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { AuctionFilters } from '@/app/lib/definitions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Auctions',
};

export default async function AuctionsPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const query = (searchParams?.query as string) ?? '';
  const currentPage = Number(searchParams?.page) || 1;

  const filters: AuctionFilters = {
    query: query || undefined,
    minPrice: searchParams?.minPrice
      ? Number(searchParams.minPrice) * 100
      : undefined,
    maxPrice: searchParams?.maxPrice
      ? Number(searchParams.maxPrice) * 100
      : undefined,
    makes: searchParams?.makes
      ? (searchParams.makes as string).split(',')
      : undefined,
    minYear: searchParams?.minYear ? Number(searchParams.minYear) : undefined,
    maxYear: searchParams?.maxYear ? Number(searchParams.maxYear) : undefined,
    conditions: searchParams?.conditions
      ? (searchParams.conditions as string).split(',')
      : undefined,
    bodyTypes: searchParams?.bodyTypes
      ? (searchParams.bodyTypes as string).split(',')
      : undefined,
    location: (searchParams?.location as string) || undefined,
    status: (searchParams?.status as string) || undefined,
  };

  const [auctions, totalPages, makes] = await Promise.all([
    fetchAuctions(filters, currentPage),
    fetchAuctionsPages(filters),
    fetchDistinctMakes(),
  ]);

  return (
    <div className="w-full space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Auctions</h1>
        <Link
          href="/dashboard/auctions/create"
          className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          <span className="hidden md:block">Create Auction</span>
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Search placeholder="Search auctions..." />
      </div>

      {/* Horizontal Filter Panel (Desktop) */}
      <div className="hidden lg:block">
        <FilterPanel makes={makes} layout="horizontal" />
      </div>

      {/* Filter Toggle (Mobile) */}
      <div className="lg:hidden">
        <FilterToggle makes={makes} />
      </div>

      {/* Auctions Grid */}
      <Suspense fallback={<AuctionGridSkeleton />}>
        <AuctionGrid auctions={auctions} />
      </Suspense>
      <div className="mt-6 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
