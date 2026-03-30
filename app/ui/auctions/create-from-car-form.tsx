'use client';

import { useActionState } from 'react';
import { createAuctionFromCar, type ActionState } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import type { Car } from '@/app/lib/definitions';

export default function CreateAuctionFromCarForm({
  cars,
}: {
  cars: Car[];
}) {
  const initialState: ActionState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(
    createAuctionFromCar,
    initialState,
  );

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <h2 className="mb-4 text-lg font-semibold">Select Your Car</h2>
        <div>
          <select
            id="carId"
            name="carId"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            required
          >
            <option value="">Choose a car</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.year} {car.make} {car.model}
                {car.color ? ` — ${car.color}` : ''}
              </option>
            ))}
          </select>
        </div>

        <h2 className="mt-8 mb-4 text-lg font-semibold">Auction Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="startingPrice" className="mb-2 block text-sm font-medium">
              Starting Price (cents)
            </label>
            <input
              id="startingPrice"
              name="startingPrice"
              type="number"
              min="1"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="reservePrice" className="mb-2 block text-sm font-medium">
              Reserve Price (optional, cents)
            </label>
            <input
              id="reservePrice"
              name="reservePrice"
              type="number"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="buyNowPrice" className="mb-2 block text-sm font-medium">
              Buy Now Price (optional, cents)
            </label>
            <input
              id="buyNowPrice"
              name="buyNowPrice"
              type="number"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            />
          </div>
          <div />
          <div>
            <label htmlFor="startDate" className="mb-2 block text-sm font-medium">
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="mb-2 block text-sm font-medium">
              End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              required
            />
          </div>
        </div>

        {state.message && (
          <p className="mt-4 text-sm text-red-500">{state.message}</p>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/auctions"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" aria-disabled={isPending}>
          Create Auction
        </Button>
      </div>
    </form>
  );
}
