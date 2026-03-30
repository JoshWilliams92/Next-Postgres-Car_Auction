import { formatCurrency } from '@/app/lib/utils';
import type { DashboardStats } from '@/app/lib/definitions';
import {
  TagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

const iconMap = {
  activeAuctions: TagIcon,
  totalBids: ChartBarIcon,
  avgPrice: CurrencyDollarIcon,
  trendingMake: FireIcon,
};

export default function StatCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        title="Active Auctions"
        value={String(stats.activeAuctions)}
        icon="activeAuctions"
      />
      <Card
        title="Total Bids"
        value={String(stats.totalBids)}
        icon="totalBids"
      />
      <Card
        title="Average Price"
        value={formatCurrency(stats.avgPrice)}
        icon="avgPrice"
      />
      <Card
        title="Trending Make"
        value={stats.trendingMake}
        icon="trendingMake"
      />
    </div>
  );
}

function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: keyof typeof iconMap;
}) {
  const Icon = iconMap[icon];
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        <Icon className="h-5 w-5 text-gray-700" />
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}
