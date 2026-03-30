import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { fetchAuctionById, fetchBidsByAuctionId, isOnWatchlist } from '@/app/lib/data';

export const dynamic = 'force-dynamic';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import { auth } from '@/auth';
import BidForm from '@/app/ui/auctions/bid-form';
import BidsTable from '@/app/ui/auctions/bids-table';
import { BidsTableSkeleton } from '@/app/ui/skeletons';
import WatchlistButton from '@/app/ui/auctions/watchlist-button';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import type { Metadata } from 'next';
import AuctionImage from '@/app/ui/auctions/auction-image';
import LiveCountdown from '@/app/ui/auctions/live-countdown';

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const auction = await fetchAuctionById(id);
  if (!auction) return { title: 'Auction Not Found' };
  return {
    title: `${auction.car.year} ${auction.car.make} ${auction.car.model}`,
  };
}

export default async function AuctionDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const [auction, bids, session] = await Promise.all([
    fetchAuctionById(id),
    fetchBidsByAuctionId(id),
    auth(),
  ]);

  if (!auction) notFound();

  const isLive = auction.status === 'live';
  const userId = session?.user?.id;
  const isSeller = userId === auction.seller.id;
  const watched = userId ? await isOnWatchlist(userId, id) : false;

  return (
    <div className="w-full">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left: Image + Details */}
        <div className="col-span-2 space-y-6">
          {/* Image */}
          <div className="h-64 overflow-hidden rounded-xl bg-gray-100 md:h-96">
            <AuctionImage
              imageUrl={auction.car.image_url}
              alt={`${auction.car.year} ${auction.car.make} ${auction.car.model}`}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Car Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {auction.car.year} {auction.car.make} {auction.car.model}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              {auction.car.condition && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {auction.car.condition}
                </span>
              )}
              {auction.car.body_type && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {auction.car.body_type}
                </span>
              )}
              {auction.car.color && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {auction.car.color}
                </span>
              )}
              {auction.car.mileage != null && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {auction.car.mileage.toLocaleString()} miles
                </span>
              )}
            </div>
            {auction.car.description && (
              <p className="mt-4 text-gray-600">{auction.car.description}</p>
            )}
            {auction.car.vin && (
              <p className="mt-2 text-sm text-gray-400">VIN: {auction.car.vin}</p>
            )}
          </div>

          {/* Seller */}
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <UserIcon className="h-8 w-8 text-gray-400" />
            <div>
              <p className="font-medium">{auction.seller.name}</p>
              {auction.seller.location && (
                <p className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPinIcon className="h-4 w-4" />
                  {auction.seller.location}
                </p>
              )}
            </div>
          </div>

          {/* Bids Table */}
          <div>
            <h2 className="text-lg font-semibold">
              Bids ({auction.bid_count})
            </h2>
            <Suspense fallback={<BidsTableSkeleton />}>
              <BidsTable bids={bids} />
            </Suspense>
          </div>
        </div>

        {/* Right: Pricing + Actions */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isLive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {isLive ? 'Live' : 'Ended'}
              </span>
              {userId && <WatchlistButton auctionId={id} initialWatched={watched} />}
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">Current Price</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(auction.current_price)}
              </p>
            </div>

            {isLive && (
              <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-emerald-900">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Time Remaining
                </p>
                <div className="mt-2 flex items-center gap-2 text-lg font-semibold">
                  <ClockIcon className="h-5 w-5" />
                  <LiveCountdown endDate={auction.auction_end_date} />
                </div>
              </div>
            )}

            {auction.reserve_price && (
              <p className="mt-1 text-sm text-gray-500">
                Reserve: {formatCurrency(auction.reserve_price)}
                {auction.current_price >= auction.reserve_price ? (
                  <span className="ml-1 text-green-600">Met</span>
                ) : (
                  <span className="ml-1 text-amber-600">Not met</span>
                )}
              </p>
            )}

            {auction.buy_now_price && (
              <p className="mt-1 text-sm text-gray-500">
                Buy Now: {formatCurrency(auction.buy_now_price)}
              </p>
            )}

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  Ends {formatDateToLocal(auction.auction_end_date)}
                </span>
              </div>
              {isLive && (
                <div className="flex items-center gap-2 text-emerald-700">
                  <ClockIcon className="h-4 w-4" />
                  <LiveCountdown endDate={auction.auction_end_date} withLabel />
                </div>
              )}
              <p>{auction.bid_count} bids · {auction.bidder_count} bidders</p>
            </div>

            {isLive && userId && !isSeller && (
              <div className="mt-6 border-t pt-4">
                <BidForm
                  auctionId={id}
                  currentPrice={auction.current_price}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
