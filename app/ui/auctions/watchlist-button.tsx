'use client';

import { useState, useTransition } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { toggleWatchlist } from '@/app/lib/actions';

export default function WatchlistButton({
  auctionId,
  initialWatched,
}: {
  auctionId: string;
  initialWatched: boolean;
}) {
  const [watched, setWatched] = useState(initialWatched);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleWatchlist(auctionId);
      setWatched(result);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="rounded-full p-2 text-gray-400 transition hover:text-red-500 disabled:opacity-50"
      aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {watched ? (
        <HeartSolidIcon className="h-6 w-6 text-red-500" />
      ) : (
        <HeartIcon className="h-6 w-6" />
      )}
    </button>
  );
}
