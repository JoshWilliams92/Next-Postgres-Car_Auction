import { Suspense } from 'react';
import {
  fetchDashboardStats,
  fetchRecentAuctions,
  fetchBidActivity,
} from '@/app/lib/data';
import { sql } from '@/app/lib/db';
import StatCards from '@/app/ui/dashboard/stat-cards';
import BidActivityChart from '@/app/ui/dashboard/bid-activity-chart';
import MakeDistributionChart from '@/app/ui/dashboard/make-distribution-chart';
import { AuctionGrid } from '@/app/ui/auctions/auction-card';
import { CardsSkeleton, AuctionGridSkeleton } from '@/app/ui/skeletons';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard',
};

async function fetchMakeDistribution() {
  const data = await sql.unsafe(
    'SELECT cars.make AS name, COUNT(*)::int AS value FROM auctions JOIN cars ON auctions.car_id = cars.id WHERE auctions.status = \'live\' GROUP BY cars.make ORDER BY value DESC LIMIT 8'
  );
  return data.map((row) => ({ name: row.name as string, value: row.value as number }));
}

export default async function DashboardPage() {
  const [stats, recentAuctions, bidActivity, makeDistribution] =
    await Promise.all([
      fetchDashboardStats(),
      fetchRecentAuctions(6),
      fetchBidActivity(),
      fetchMakeDistribution(),
    ]);

  return (
    <main>
      <h1 className="mb-4 text-xl font-bold md:text-2xl">Dashboard</h1>

      <Suspense fallback={<CardsSkeleton />}>
        <StatCards stats={stats} />
      </Suspense>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-medium">
            Bid Activity (Last 30 Days)
          </h2>
          <div className="h-[300px] w-full">
            <BidActivityChart data={bidActivity} />
          </div>
        </div>
        <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-medium">
            Make Distribution (Live Auctions)
          </h2>
          <div className="h-[300px] w-full">
            <MakeDistributionChart data={makeDistribution} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Recent Auctions</h2>
        <Suspense fallback={<AuctionGridSkeleton />}>
          <AuctionGrid auctions={recentAuctions} />
        </Suspense>
      </div>
    </main>
  );
}
