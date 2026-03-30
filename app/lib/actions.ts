'use server';

import { z } from 'zod/v4';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { auth } from '@/auth';
import { sql } from '@/app/lib/db';

// ── Action State Types ──────────────────────────────────────

export type ActionState = {
  errors?: Record<string, string[]>;
  message?: string | null;
};

const PostgresUuidSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    'Invalid UUID',
  );

// ── Schemas ─────────────────────────────────────────────────

const CarSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.coerce.number().min(0).optional(),
  condition: z.enum(['Excellent', 'Good', 'Fair', 'Poor']).optional(),
  bodyType: z
    .enum([
      'Sedan',
      'SUV',
      'Coupe',
      'Truck',
      'Van',
      'Convertible',
      'Hatchback',
      'Wagon',
      'Sports',
    ])
    .optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  vin: z.string().max(17).optional(),
});

const AuctionSchema = z.object({
  startingPrice: z.coerce.number().gt(0, 'Starting price must be greater than $0'),
  reservePrice: z.coerce.number().optional(),
  buyNowPrice: z.coerce.number().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

const AtomicAuctionSchema = CarSchema.and(AuctionSchema);

const BidSchema = z.object({
  auctionId: PostgresUuidSchema,
  bidAmount: z.coerce.number().gt(0, 'Bid must be greater than $0'),
});

// ── Create Car ──────────────────────────────────────────────

export async function createCar(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: 'You must be logged in.' };
  }

  const parsed = CarSchema.safeParse({
    make: formData.get('make'),
    model: formData.get('model'),
    year: formData.get('year'),
    mileage: formData.get('mileage') || undefined,
    condition: formData.get('condition') || undefined,
    bodyType: formData.get('bodyType') || undefined,
    location: formData.get('location') || undefined,
    description: formData.get('description') || undefined,
    color: formData.get('color') || undefined,
    vin: formData.get('vin') || undefined,
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: 'Invalid car data.',
    };
  }

  const d = parsed.data;

  await sql`
    INSERT INTO cars (user_id, make, model, year, mileage, condition, body_type, location, description, color, vin)
    VALUES (${session.user.id}, ${d.make}, ${d.model}, ${d.year},
            ${d.mileage ?? null}, ${d.condition ?? null}, ${d.bodyType ?? null},
            ${d.location ?? null}, ${d.description ?? null}, ${d.color ?? null},
            ${d.vin ?? null})
  `;

  revalidatePath('/dashboard/cars');
  redirect('/dashboard/cars');
}

// ── Create Auction (atomic — car + auction in one) ──────────

export async function createAuction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: 'You must be logged in.' };
  }

  const parsed = AtomicAuctionSchema.safeParse({
    make: formData.get('make'),
    model: formData.get('model'),
    year: formData.get('year'),
    mileage: formData.get('mileage') || undefined,
    condition: formData.get('condition') || undefined,
    bodyType: formData.get('bodyType') || undefined,
    location: formData.get('location') || undefined,
    description: formData.get('description') || undefined,
    color: formData.get('color') || undefined,
    vin: formData.get('vin') || undefined,
    startingPrice: formData.get('startingPrice'),
    reservePrice: formData.get('reservePrice') || undefined,
    buyNowPrice: formData.get('buyNowPrice') || undefined,
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: 'Invalid form data.',
    };
  }

  const d = parsed.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await sql.begin(async (tx: any) => {
    const [car] = await tx`
      INSERT INTO cars (user_id, make, model, year, mileage, condition, body_type, location, description, color, vin)
      VALUES (${session.user.id}, ${d.make}, ${d.model}, ${d.year},
              ${d.mileage ?? null}, ${d.condition ?? null}, ${d.bodyType ?? null},
              ${d.location ?? null}, ${d.description ?? null}, ${d.color ?? null},
              ${d.vin ?? null})
      RETURNING id
    `;

    await tx`
      INSERT INTO auctions (car_id, starting_price, current_price, reserve_price, buy_now_price, auction_start_date, auction_end_date, status)
      VALUES (${car.id}, ${d.startingPrice}, ${d.startingPrice},
              ${d.reservePrice ?? null}, ${d.buyNowPrice ?? null},
              ${d.startDate}, ${d.endDate}, 'live')
    `;
  });

  revalidatePath('/dashboard/auctions');
  redirect('/dashboard/auctions');
}

// ── Create Auction from Existing Car ────────────────────────

export async function createAuctionFromCar(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: 'You must be logged in.' };
  }

  const carId = formData.get('carId') as string;
  if (!carId) {
    return { message: 'Car selection is required.' };
  }

  // Verify ownership
  const car = await sql`
    SELECT id FROM cars WHERE id = ${carId} AND user_id = ${session.user.id}
  `;
  if (car.length === 0) {
    return { message: 'Car not found or not owned by you.' };
  }

  const parsed = AuctionSchema.safeParse({
    startingPrice: formData.get('startingPrice'),
    reservePrice: formData.get('reservePrice') || undefined,
    buyNowPrice: formData.get('buyNowPrice') || undefined,
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: 'Invalid auction data.',
    };
  }

  const d = parsed.data;

  await sql`
    INSERT INTO auctions (car_id, starting_price, current_price, reserve_price, buy_now_price, auction_start_date, auction_end_date, status)
    VALUES (${carId}, ${d.startingPrice}, ${d.startingPrice},
            ${d.reservePrice ?? null}, ${d.buyNowPrice ?? null},
            ${d.startDate}, ${d.endDate}, 'live')
  `;

  revalidatePath('/dashboard/auctions');
  redirect('/dashboard/auctions');
}

// ── Create Bid ──────────────────────────────────────────────

export async function createBid(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: 'You must be logged in to bid.' };
  }

  const parsed = BidSchema.safeParse({
    auctionId: formData.get('auctionId'),
    bidAmount: formData.get('bidAmount'),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: 'Invalid bid.',
    };
  }

  const { auctionId, bidAmount } = parsed.data;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await sql.begin(async (tx: any) => {
      // Lock auction row to prevent race conditions
      const [auction] = await tx`
        SELECT current_price, status
        FROM auctions
        WHERE id = ${auctionId}
        FOR UPDATE
      `;

      if (!auction) throw new Error('Auction not found.');
      if (auction.status !== 'live') throw new Error('Auction is not active.');
      if (bidAmount <= auction.current_price)
        throw new Error('Bid must be higher than the current price.');

      await tx`
        INSERT INTO bids (auction_id, user_id, bid_amount)
        VALUES (${auctionId}, ${session.user.id}, ${bidAmount})
      `;

      await tx`
        UPDATE auctions SET current_price = ${bidAmount}
        WHERE id = ${auctionId}
      `;
    });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : 'Failed to place bid.';
    return { message: msg };
  }

  revalidatePath(`/dashboard/auctions/${auctionId}`);
  return { message: 'Bid placed successfully!' };
}

// ── Toggle Watchlist ────────────────────────────────────────

export async function toggleWatchlist(auctionId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const existing = await sql`
    SELECT id FROM watchlist
    WHERE user_id = ${session.user.id} AND auction_id = ${auctionId}
  `;

  if (existing.length > 0) {
    await sql`
      DELETE FROM watchlist
      WHERE user_id = ${session.user.id} AND auction_id = ${auctionId}
    `;
    revalidatePath(`/dashboard/auctions/${auctionId}`);
    return false; // removed
  }

  await sql`
    INSERT INTO watchlist (user_id, auction_id)
    VALUES (${session.user.id}, ${auctionId})
  `;
  revalidatePath(`/dashboard/auctions/${auctionId}`);
  return true; // added
}

// ── Authentication ──────────────────────────────────────────

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
