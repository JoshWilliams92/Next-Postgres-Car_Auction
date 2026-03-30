import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
import {
  fetchUserProfile,
  fetchUserListings,
  fetchUserBids,
  fetchWatchlist,
  fetchCars,
} from '@/app/lib/data';
import { AuctionGrid } from '@/app/ui/auctions/auction-card';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import {
  UserCircleIcon,
  MapPinIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const userId = session.user.id;
  const [profile, listings, bids, watchlist, cars] = await Promise.all([
    fetchUserProfile(userId),
    fetchUserListings(userId),
    fetchUserBids(userId),
    fetchWatchlist(userId),
    fetchCars(userId),
  ]);

  if (!profile) redirect('/login');

  return (
    <div className="w-full space-y-8">
      {/* Profile Header */}
      <div className="flex items-start gap-4 rounded-xl bg-gray-50 p-6">
        <UserCircleIcon className="h-16 w-16 text-gray-300" />
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm text-gray-500">{profile.email}</p>
          {profile.location && (
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <MapPinIcon className="h-4 w-4" />
              {profile.location}
            </p>
          )}
          {profile.bio && <p className="mt-2 text-gray-600">{profile.bio}</p>}
          <div className="mt-3 flex gap-4 text-sm text-gray-500">
            <span>{profile.cars_count} cars</span>
            <span>{profile.active_listings} active listings</span>
            <span>{profile.bids_placed} bids placed</span>
          </div>
        </div>
      </div>

      {/* My Cars */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Cars ({cars.length})</h2>
          <Link
            href="/dashboard/auctions/create"
            className="text-sm text-indigo-600 hover:underline"
          >
            + List a new car
          </Link>
        </div>
        {cars.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <div
                key={car.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <h3 className="font-medium">
                  {car.year} {car.make} {car.model}
                </h3>
                <div className="mt-1 text-sm text-gray-500">
                  {car.mileage != null && (
                    <span>{car.mileage.toLocaleString()} mi</span>
                  )}
                  {car.condition && <span> · {car.condition}</span>}
                  {car.color && <span> · {car.color}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">No cars yet.</p>
        )}
      </section>

      {/* My Listings */}
      <section>
        <h2 className="text-lg font-semibold">
          My Listings ({listings.length})
        </h2>
        <div className="mt-4">
          <AuctionGrid auctions={listings} />
        </div>
      </section>

      {/* My Bids */}
      <section>
        <h2 className="text-lg font-semibold">My Bids ({bids.length})</h2>
        {bids.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-medium">Car</th>
                  <th className="pb-2 pr-4 font-medium">My Bid</th>
                  <th className="pb-2 pr-4 font-medium">Current Price</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid) => (
                  <tr key={bid.id} className="border-b">
                    <td className="py-3 pr-4">
                      <Link
                        href={`/dashboard/auctions/${bid.auction_id}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {bid.car_year} {bid.car_make} {bid.car_model}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-medium">
                      {formatCurrency(bid.bid_amount)}
                    </td>
                    <td className="py-3 pr-4">
                      {formatCurrency(bid.auction_current_price)}
                    </td>
                    <td className="py-3 pr-4">
                      {bid.is_winning ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                          Winning
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                          Outbid
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-gray-500">
                      {formatDateToLocal(bid.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">No bids placed yet.</p>
        )}
      </section>

      {/* Watchlist */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <HeartIcon className="h-5 w-5" />
          Watchlist ({watchlist.length})
        </h2>
        <div className="mt-4">
          <AuctionGrid auctions={watchlist.map((w) => w.auction)} />
        </div>
      </section>
    </div>
  );
}
