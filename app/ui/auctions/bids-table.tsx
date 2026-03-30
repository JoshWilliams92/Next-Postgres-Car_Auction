import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import type { BidWithUser } from '@/app/lib/definitions';

export default function BidsTable({ bids }: { bids: BidWithUser[] }) {
  if (bids.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-500">No bids yet.</p>
    );
  }

  return (
    <div className="mt-4 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile */}
          <div className="md:hidden">
            {bids.map((bid) => (
              <div
                key={bid.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-sm font-medium">{bid.bidder_name}</p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(bid.bid_amount)}
                  </p>
                </div>
                <p className="pt-2 text-xs text-gray-500">
                  {formatDateToLocal(bid.created_at)}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium">
                  Bidder
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {bids.map((bid) => (
                <tr
                  key={bid.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    {bid.bidder_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-medium">
                    {formatCurrency(bid.bid_amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-500">
                    {formatDateToLocal(bid.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
