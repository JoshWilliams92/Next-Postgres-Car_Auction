'use client';

import { useActionState } from 'react';
import { createAuction, type ActionState } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';

const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor'] as const;
const BODY_TYPES = [
  'Sedan', 'SUV', 'Coupe', 'Truck', 'Van',
  'Convertible', 'Hatchback', 'Wagon', 'Sports',
] as const;

export default function CreateAuctionForm() {
  const initialState: ActionState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(
    createAuction,
    initialState,
  );

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Car Details Section */}
        <h2 className="mb-4 text-lg font-semibold">Car Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="make" className="mb-2 block text-sm font-medium">
              Make
            </label>
            <input
              id="make"
              name="make"
              type="text"
              placeholder="e.g. Toyota"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              required
            />
            {state.errors?.make && (
              <p className="mt-1 text-sm text-red-500">{state.errors.make[0]}</p>
            )}
          </div>
          <div>
            <label htmlFor="model" className="mb-2 block text-sm font-medium">
              Model
            </label>
            <input
              id="model"
              name="model"
              type="text"
              placeholder="e.g. Supra"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              required
            />
            {state.errors?.model && (
              <p className="mt-1 text-sm text-red-500">{state.errors.model[0]}</p>
            )}
          </div>
          <div>
            <label htmlFor="year" className="mb-2 block text-sm font-medium">
              Year
            </label>
            <input
              id="year"
              name="year"
              type="number"
              placeholder="e.g. 2023"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="mileage" className="mb-2 block text-sm font-medium">
              Mileage
            </label>
            <input
              id="mileage"
              name="mileage"
              type="number"
              placeholder="e.g. 15000"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="condition" className="mb-2 block text-sm font-medium">
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            >
              <option value="">Select condition</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="bodyType" className="mb-2 block text-sm font-medium">
              Body Type
            </label>
            <select
              id="bodyType"
              name="bodyType"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            >
              <option value="">Select body type</option>
              {BODY_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="color" className="mb-2 block text-sm font-medium">
              Color
            </label>
            <input
              id="color"
              name="color"
              type="text"
              placeholder="e.g. Silver"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="location" className="mb-2 block text-sm font-medium">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Los Angeles, CA"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="mb-2 block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Describe the vehicle..."
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="vin" className="mb-2 block text-sm font-medium">
              VIN (optional)
            </label>
            <input
              id="vin"
              name="vin"
              type="text"
              maxLength={17}
              placeholder="17-character VIN"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            />
          </div>
        </div>

        {/* Auction Details Section */}
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
              placeholder="e.g. 5000000"
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
              placeholder="e.g. 6000000"
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
              placeholder="e.g. 8000000"
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
