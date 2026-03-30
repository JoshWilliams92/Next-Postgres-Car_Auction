import { sql } from '@/app/lib/db';
import type {
  AuctionListItem,
  AuctionDetail,
  BidWithUser,
  AuctionFilters,
  DashboardStats,
  UserProfile,
  UserBid,
  WatchlistItem,
  Car,
} from './definitions';

const ITEMS_PER_PAGE = 12;

function buildAuctionWhereClause(filters: AuctionFilters = {}) {
  const conditions: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values: any[] = [];
  let idx = 0;

  if (filters.query?.trim()) {
    const queryIndex = ++idx;
    values.push(`%${filters.query.trim()}%`);
    conditions.push(`(
      cars.make ILIKE $${queryIndex} OR
      cars.model ILIKE $${queryIndex} OR
      cars.year::text ILIKE $${queryIndex} OR
      COALESCE(cars.condition, '') ILIKE $${queryIndex} OR
      COALESCE(cars.body_type, '') ILIKE $${queryIndex} OR
      COALESCE(cars.location, '') ILIKE $${queryIndex} OR
      COALESCE(cars.description, '') ILIKE $${queryIndex} OR
      COALESCE(cars.color, '') ILIKE $${queryIndex} OR
      auctions.status ILIKE $${queryIndex} OR
      auctions.current_price::text ILIKE $${queryIndex}
    )`);
  }

  if (filters.status) {
    conditions.push(`auctions.status = $${++idx}`);
    values.push(filters.status);
  }
  if (filters.minPrice != null) {
    conditions.push(`auctions.current_price >= $${++idx}`);
    values.push(filters.minPrice);
  }
  if (filters.maxPrice != null) {
    conditions.push(`auctions.current_price <= $${++idx}`);
    values.push(filters.maxPrice);
  }
  if (filters.makes && filters.makes.length > 0) {
    conditions.push(`cars.make = ANY($${++idx})`);
    values.push(filters.makes);
  }
  if (filters.minYear != null) {
    conditions.push(`cars.year >= $${++idx}`);
    values.push(filters.minYear);
  }
  if (filters.maxYear != null) {
    conditions.push(`cars.year <= $${++idx}`);
    values.push(filters.maxYear);
  }
  if (filters.minMileage != null) {
    conditions.push(`cars.mileage >= $${++idx}`);
    values.push(filters.minMileage);
  }
  if (filters.maxMileage != null) {
    conditions.push(`cars.mileage <= $${++idx}`);
    values.push(filters.maxMileage);
  }
  if (filters.conditions && filters.conditions.length > 0) {
    conditions.push(`cars.condition = ANY($${++idx})`);
    values.push(filters.conditions);
  }
  if (filters.bodyTypes && filters.bodyTypes.length > 0) {
    conditions.push(`cars.body_type = ANY($${++idx})`);
    values.push(filters.bodyTypes);
  }
  if (filters.location) {
    conditions.push(`cars.location ILIKE $${++idx}`);
    values.push(`%${filters.location}%`);
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    values,
  };
}

// ── Auctions ────────────────────────────────────────────────

export async function fetchAuctions(
  filters: AuctionFilters = {},
  page = 1,
): Promise<AuctionListItem[]> {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const { whereClause, values } = buildAuctionWhereClause(filters);

  const data = await sql.unsafe(
    `SELECT
      auctions.id,
      auctions.starting_price,
      auctions.current_price,
      auctions.reserve_price,
      auctions.buy_now_price,
      auctions.auction_start_date,
      auctions.auction_end_date,
      auctions.status,
      COUNT(bids.id) AS bid_count,
      cars.make,
      cars.model,
      cars.year,
      cars.mileage,
      cars.condition,
      cars.body_type,
      cars.location AS car_location,
      cars.image_url,
      cars.color
    FROM auctions
    JOIN cars ON auctions.car_id = cars.id
    LEFT JOIN bids ON bids.auction_id = auctions.id
    ${whereClause}
    GROUP BY auctions.id, cars.make, cars.model, cars.year,
             cars.mileage, cars.condition, cars.body_type,
             cars.location, cars.image_url, cars.color
    ORDER BY auctions.auction_end_date ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
    values,
  );

  return data.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    starting_price: row.starting_price as number,
    current_price: row.current_price as number,
    reserve_price: row.reserve_price as number | null,
    buy_now_price: row.buy_now_price as number | null,
    auction_start_date: String(row.auction_start_date),
    auction_end_date: String(row.auction_end_date),
    status: row.status as string,
    bid_count: Number(row.bid_count),
    car: {
      make: row.make as string,
      model: row.model as string,
      year: row.year as number,
      mileage: row.mileage as number | null,
      condition: row.condition as string | null,
      body_type: row.body_type as string | null,
      location: row.car_location as string | null,
      image_url: row.image_url as string | null,
      color: row.color as string | null,
    },
  }));
}

export async function fetchAuctionsPages(
  filters: AuctionFilters = {},
): Promise<number> {
  const { whereClause, values } = buildAuctionWhereClause(filters);

  const data = await sql.unsafe(
    `SELECT COUNT(*) FROM auctions
     JOIN cars ON auctions.car_id = cars.id
     ${whereClause}`,
    values,
  );

  return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
}

// ── Full-text Search ────────────────────────────────────────

export async function searchAuctions(
  query: string,
  page = 1,
): Promise<AuctionListItem[]> {
  return fetchAuctions({ query }, page);
}

export async function searchAuctionsPages(query: string): Promise<number> {
  return fetchAuctionsPages({ query });
}

// ── Single Auction ──────────────────────────────────────────

export async function fetchAuctionById(
  id: string,
): Promise<AuctionDetail | null> {
  const data = await sql`
    SELECT
      auctions.id,
      auctions.starting_price,
      auctions.current_price,
      auctions.reserve_price,
      auctions.buy_now_price,
      auctions.auction_start_date,
      auctions.auction_end_date,
      auctions.status,
      COUNT(bids.id) AS bid_count,
      COUNT(DISTINCT bids.user_id) AS bidder_count,
      cars.id AS car_id,
      cars.make,
      cars.model,
      cars.year,
      cars.mileage,
      cars.condition,
      cars.body_type,
      cars.location AS car_location,
      cars.description AS car_description,
      cars.image_url,
      cars.color,
      cars.vin,
      seller.id AS seller_id,
      seller.name AS seller_name,
      seller.email AS seller_email,
      seller.avatar_url AS seller_avatar,
      seller.location AS seller_location
    FROM auctions
    JOIN cars ON auctions.car_id = cars.id
    JOIN users AS seller ON cars.user_id = seller.id
    LEFT JOIN bids ON bids.auction_id = auctions.id
    WHERE auctions.id = ${id}
    GROUP BY
      auctions.id, cars.id,
      seller.id, seller.name, seller.email,
      seller.avatar_url, seller.location
  `;

  if (data.length === 0) return null;

  const row = data[0];
  return {
    id: row.id,
    starting_price: row.starting_price,
    current_price: row.current_price,
    reserve_price: row.reserve_price,
    buy_now_price: row.buy_now_price,
    auction_start_date: String(row.auction_start_date),
    auction_end_date: String(row.auction_end_date),
    status: row.status,
    bid_count: Number(row.bid_count),
    bidder_count: Number(row.bidder_count),
    car: {
      id: row.car_id,
      make: row.make,
      model: row.model,
      year: row.year,
      mileage: row.mileage,
      condition: row.condition,
      body_type: row.body_type,
      location: row.car_location,
      image_url: row.image_url,
      color: row.color,
      description: row.car_description,
      vin: row.vin,
    },
    seller: {
      id: row.seller_id,
      name: row.seller_name,
      email: row.seller_email,
      avatar_url: row.seller_avatar,
      location: row.seller_location,
    },
  };
}

// ── Bids ────────────────────────────────────────────────────

export async function fetchBidsByAuctionId(
  auctionId: string,
): Promise<BidWithUser[]> {
  const data = await sql`
    SELECT
      bids.id,
      bids.bid_amount,
      bids.created_at,
      users.name AS bidder_name,
      users.email AS bidder_email
    FROM bids
    JOIN users ON bids.user_id = users.id
    WHERE bids.auction_id = ${auctionId}
    ORDER BY bids.bid_amount DESC
  `;

  return data.map((row) => ({
    id: row.id,
    bid_amount: row.bid_amount,
    created_at: String(row.created_at),
    bidder_name: row.bidder_name,
    bidder_email: row.bidder_email,
  }));
}

// ── Cars ────────────────────────────────────────────────────

export async function fetchCars(userId?: string): Promise<Car[]> {
  if (userId) {
    return sql<Car[]>`
      SELECT * FROM cars
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
  }
  return sql<Car[]>`
    SELECT * FROM cars
    ORDER BY make ASC, model ASC
  `;
}

export async function fetchCarById(id: string): Promise<Car | null> {
  const data = await sql<Car[]>`
    SELECT * FROM cars WHERE id = ${id}
  `;
  return data[0] ?? null;
}

// ── User Profile ────────────────────────────────────────────

export async function fetchUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  const data = await sql`
    SELECT
      u.id, u.name, u.email, u.avatar_url, u.bio, u.location, u.created_at,
      (SELECT COUNT(*) FROM cars WHERE user_id = u.id) AS cars_count,
      (SELECT COUNT(*) FROM auctions a JOIN cars c ON a.car_id = c.id
       WHERE c.user_id = u.id AND a.status = 'live') AS active_listings,
      (SELECT COUNT(*) FROM bids WHERE user_id = u.id) AS bids_placed,
      (SELECT COUNT(*) FROM watchlist WHERE user_id = u.id) AS watchlist_count
    FROM users u
    WHERE u.id = ${userId}
  `;

  if (data.length === 0) return null;

  const row = data[0];
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar_url: row.avatar_url,
    bio: row.bio,
    location: row.location,
    created_at: String(row.created_at),
    cars_count: Number(row.cars_count),
    active_listings: Number(row.active_listings),
    bids_placed: Number(row.bids_placed),
    watchlist_count: Number(row.watchlist_count),
  };
}

export async function fetchUserListings(
  userId: string,
): Promise<AuctionListItem[]> {
  const data = await sql`
    SELECT
      auctions.id,
      auctions.starting_price,
      auctions.current_price,
      auctions.reserve_price,
      auctions.buy_now_price,
      auctions.auction_start_date,
      auctions.auction_end_date,
      auctions.status,
      COUNT(bids.id) AS bid_count,
      cars.make,
      cars.model,
      cars.year,
      cars.mileage,
      cars.condition,
      cars.body_type,
      cars.location AS car_location,
      cars.image_url,
      cars.color
    FROM auctions
    JOIN cars ON auctions.car_id = cars.id
    LEFT JOIN bids ON bids.auction_id = auctions.id
    WHERE cars.user_id = ${userId}
    GROUP BY auctions.id, cars.make, cars.model, cars.year,
             cars.mileage, cars.condition, cars.body_type,
             cars.location, cars.image_url, cars.color
    ORDER BY auctions.created_at DESC
  `;

  return data.map((row) => ({
    id: row.id,
    starting_price: row.starting_price,
    current_price: row.current_price,
    reserve_price: row.reserve_price,
    buy_now_price: row.buy_now_price,
    auction_start_date: String(row.auction_start_date),
    auction_end_date: String(row.auction_end_date),
    status: row.status,
    bid_count: Number(row.bid_count),
    car: {
      make: row.make,
      model: row.model,
      year: row.year,
      mileage: row.mileage,
      condition: row.condition,
      body_type: row.body_type,
      location: row.car_location,
      image_url: row.image_url,
      color: row.color,
    },
  }));
}

export async function fetchUserBids(userId: string): Promise<UserBid[]> {
  const data = await sql`
    SELECT
      bids.id,
      bids.bid_amount,
      bids.created_at,
      auctions.id AS auction_id,
      auctions.current_price AS auction_current_price,
      auctions.auction_end_date,
      auctions.status AS auction_status,
      cars.make AS car_make,
      cars.model AS car_model,
      cars.year AS car_year,
      (bids.bid_amount = auctions.current_price) AS is_winning
    FROM bids
    JOIN auctions ON bids.auction_id = auctions.id
    JOIN cars ON auctions.car_id = cars.id
    WHERE bids.user_id = ${userId}
    ORDER BY bids.created_at DESC
  `;

  return data.map((row) => ({
    id: row.id,
    bid_amount: row.bid_amount,
    created_at: String(row.created_at),
    auction_id: row.auction_id,
    car_make: row.car_make,
    car_model: row.car_model,
    car_year: row.car_year,
    auction_current_price: row.auction_current_price,
    auction_end_date: String(row.auction_end_date),
    auction_status: row.auction_status,
    is_winning: row.is_winning,
  }));
}

// ── Watchlist ───────────────────────────────────────────────

export async function fetchWatchlist(
  userId: string,
): Promise<WatchlistItem[]> {
  const data = await sql`
    SELECT
      watchlist.id,
      watchlist.auction_id,
      watchlist.created_at AS watchlist_created_at,
      auctions.starting_price,
      auctions.current_price,
      auctions.reserve_price,
      auctions.buy_now_price,
      auctions.auction_start_date,
      auctions.auction_end_date,
      auctions.status,
      COUNT(bids.id) AS bid_count,
      cars.make,
      cars.model,
      cars.year,
      cars.mileage,
      cars.condition,
      cars.body_type,
      cars.location AS car_location,
      cars.image_url,
      cars.color
    FROM watchlist
    JOIN auctions ON watchlist.auction_id = auctions.id
    JOIN cars ON auctions.car_id = cars.id
    LEFT JOIN bids ON bids.auction_id = auctions.id
    WHERE watchlist.user_id = ${userId}
    GROUP BY watchlist.id, auctions.id,
             cars.make, cars.model, cars.year,
             cars.mileage, cars.condition, cars.body_type,
             cars.location, cars.image_url, cars.color
    ORDER BY watchlist.created_at DESC
  `;

  return data.map((row) => ({
    id: row.id,
    auction_id: row.auction_id,
    created_at: String(row.watchlist_created_at),
    auction: {
      id: row.auction_id,
      starting_price: row.starting_price,
      current_price: row.current_price,
      reserve_price: row.reserve_price,
      buy_now_price: row.buy_now_price,
      auction_start_date: String(row.auction_start_date),
      auction_end_date: String(row.auction_end_date),
      status: row.status,
      bid_count: Number(row.bid_count),
      car: {
        make: row.make,
        model: row.model,
        year: row.year,
        mileage: row.mileage,
        condition: row.condition,
        body_type: row.body_type,
        location: row.car_location,
        image_url: row.image_url,
        color: row.color,
      },
    },
  }));
}

export async function isOnWatchlist(
  userId: string,
  auctionId: string,
): Promise<boolean> {
  const data = await sql`
    SELECT 1 FROM watchlist
    WHERE user_id = ${userId} AND auction_id = ${auctionId}
    LIMIT 1
  `;
  return data.length > 0;
}

// ── Dashboard / Homepage ────────────────────────────────────

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [activeRes, bidsRes, avgRes, makeRes] = await Promise.all([
    sql.unsafe('SELECT COUNT(*) FROM auctions WHERE status = \'live\''),
    sql.unsafe('SELECT COUNT(*) FROM bids'),
    sql.unsafe('SELECT AVG(current_price) FROM auctions WHERE status = \'live\''),
    sql.unsafe(
      'SELECT cars.make, COUNT(*) AS cnt FROM auctions JOIN cars ON auctions.car_id = cars.id WHERE auctions.status = \'live\' GROUP BY cars.make ORDER BY cnt DESC LIMIT 1'
    ),
  ]);

  return {
    activeAuctions: Number(activeRes[0].count),
    totalBids: Number(bidsRes[0].count),
    avgPrice: Number(avgRes[0].avg ?? 0),
    trendingMake: makeRes[0]?.make ?? 'N/A',
  };
}

export async function fetchRecentAuctions(
  limit = 6,
): Promise<AuctionListItem[]> {
  const data = await sql`
    SELECT
      auctions.id,
      auctions.starting_price,
      auctions.current_price,
      auctions.reserve_price,
      auctions.buy_now_price,
      auctions.auction_start_date,
      auctions.auction_end_date,
      auctions.status,
      COUNT(bids.id) AS bid_count,
      cars.make,
      cars.model,
      cars.year,
      cars.mileage,
      cars.condition,
      cars.body_type,
      cars.location AS car_location,
      cars.image_url,
      cars.color
    FROM auctions
    JOIN cars ON auctions.car_id = cars.id
    LEFT JOIN bids ON bids.auction_id = auctions.id
    WHERE auctions.status = 'live'
    GROUP BY auctions.id, cars.make, cars.model, cars.year,
             cars.mileage, cars.condition, cars.body_type,
             cars.location, cars.image_url, cars.color
    ORDER BY auctions.created_at DESC
    LIMIT ${limit}
  `;

  return data.map((row) => ({
    id: row.id,
    starting_price: row.starting_price,
    current_price: row.current_price,
    reserve_price: row.reserve_price,
    buy_now_price: row.buy_now_price,
    auction_start_date: String(row.auction_start_date),
    auction_end_date: String(row.auction_end_date),
    status: row.status,
    bid_count: Number(row.bid_count),
    car: {
      make: row.make,
      model: row.model,
      year: row.year,
      mileage: row.mileage,
      condition: row.condition,
      body_type: row.body_type,
      location: row.car_location,
      image_url: row.image_url,
      color: row.color,
    },
  }));
}

export async function fetchDistinctMakes(): Promise<string[]> {
  const data = await sql`
    SELECT DISTINCT make FROM cars ORDER BY make ASC
  `;
  return data.map((row) => row.make);
}

export async function fetchBidActivity(): Promise<
  { date: string; count: number }[]
> {
  const data = await sql`
    SELECT
      TO_CHAR(created_at, 'YYYY-MM-DD') AS date,
      COUNT(*) AS count
    FROM bids
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY date
    ORDER BY date ASC
  `;
  return data.map((row) => ({
    date: row.date,
    count: Number(row.count),
  }));
}
