'use client';

import { useActionState } from 'react';
import { createBid, type ActionState } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function BidForm({
  auctionId,
  currentPrice,
}: {
  auctionId: string;
  currentPrice: number;
}) {
  const initialState: ActionState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(
    createBid,
    initialState,
  );

  const isSuccess = state.message === 'Bid placed successfully!';

  return (
    <form action={formAction}>
      <input type="hidden" name="auctionId" value={auctionId} />
      <div>
        <label
          htmlFor="bidAmount"
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          Your Bid (min: ${((currentPrice + 100) / 100).toFixed(2)})
        </label>
        <div className="relative">
          <input
            id="bidAmount"
            name="bidAmount"
            type="number"
            step="100"
            min={currentPrice + 100}
            placeholder="Enter bid amount in cents"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
          <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
        {state.errors?.bidAmount && (
          <p className="mt-1 text-sm text-red-500">
            {state.errors.bidAmount[0]}
          </p>
        )}
      </div>
      <Button className="mt-3 w-full" aria-disabled={isPending}>
        {isPending ? 'Placing Bid...' : 'Place Bid'}
      </Button>
      {state.message && (
        <p
          className={`mt-2 text-sm ${isSuccess ? 'text-green-600' : 'text-red-500'}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
