import Link from 'next/link';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import type { AuctionListItem } from '@/app/lib/definitions';
import { ClockIcon } from '@heroicons/react/24/outline';
import AuctionImage from '@/app/ui/auctions/auction-image';
import LiveCountdown from '@/app/ui/auctions/live-countdown';

export function AuctionCard({ auction }: { auction: AuctionListItem }) {
  const isLive = auction.status === 'live';
  const statusLabel = `${auction.status.charAt(0).toUpperCase()}${auction.status.slice(1)}`;

  return (
    <Link
      href={`/dashboard/auctions/${auction.id}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-48 bg-slate-100">
        <AuctionImage
          imageUrl={auction.car.image_url}
          alt={`${auction.car.year} ${auction.car.make} ${auction.car.model}`}
          className="h-full w-full object-cover"
        />
        <span
          className={`absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-medium ${
            isLive
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {statusLabel}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
          {auction.car.year} {auction.car.make} {auction.car.model}
        </h3>
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          {auction.car.mileage != null && (
            <span>{auction.car.mileage.toLocaleString()} mi</span>
          )}
          {auction.car.condition && (
            <>
              <span>·</span>
              <span>{auction.car.condition}</span>
            </>
          )}
          {auction.car.location && (
            <>
              <span>·</span>
              <span>{auction.car.location}</span>
            </>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(auction.current_price)}
            </p>
            {auction.buy_now_price && (
              <p className="text-xs text-gray-500">
                Buy Now: {formatCurrency(auction.buy_now_price)}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-500">{auction.bid_count} bids</p>
        </div>
        <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
          {isLive ? (
            <div className="flex items-center gap-2 font-medium text-emerald-700">
              <ClockIcon className="h-4 w-4" />
              <LiveCountdown endDate={auction.auction_end_date} withLabel />
            </div>
          ) : (
            <p>Ended {formatDateToLocal(auction.auction_end_date)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function AuctionGrid({ auctions }: { auctions: AuctionListItem[] }) {
  if (auctions.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-gray-300 text-gray-500">
        No auctions found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  );
}
