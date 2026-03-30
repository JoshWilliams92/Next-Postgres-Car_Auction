import CreateAuctionForm from '@/app/ui/auctions/create-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Auction',
};

export default async function CreateAuctionPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">Create New Auction</h1>
      <p className="mt-1 text-sm text-gray-500">
        Fill in the car details and auction parameters below.
      </p>
      <div className="mt-6">
        <CreateAuctionForm />
      </div>
    </div>
  );
}
