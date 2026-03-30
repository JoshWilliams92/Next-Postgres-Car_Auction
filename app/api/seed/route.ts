import bcrypt from 'bcrypt';
import { sql } from '@/app/lib/db';
import { users, cars, auctions, bids, watchlist } from '@/app/lib/placeholder-data';

async function dropTables() {
  await sql`DROP TABLE IF EXISTS messages CASCADE`;
  await sql`DROP TABLE IF EXISTS conversations CASCADE`;
  await sql`DROP TABLE IF EXISTS watchlist CASCADE`;
  await sql`DROP TABLE IF EXISTS bids CASCADE`;
  await sql`DROP TABLE IF EXISTS auctions CASCADE`;
  await sql`DROP TABLE IF EXISTS cars CASCADE`;
  await sql`DROP TABLE IF EXISTS users CASCADE`;
}

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      email      TEXT NOT NULL UNIQUE,
      password   TEXT NOT NULL,
      avatar_url VARCHAR(500),
      bio        TEXT,
      location   VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await sql`
      INSERT INTO users (id, name, email, password, avatar_url, bio, location)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.avatar_url}, ${user.bio}, ${user.location})
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

async function seedCars() {
  await sql`
    CREATE TABLE IF NOT EXISTS cars (
      id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
      make        VARCHAR(255) NOT NULL,
      model       VARCHAR(255) NOT NULL,
      year        INT NOT NULL,
      mileage     INT,
      condition   VARCHAR(20),
      body_type   VARCHAR(30),
      location    VARCHAR(255),
      description TEXT,
      image_url   VARCHAR(500),
      color       VARCHAR(50),
      vin         VARCHAR(17),
      created_at  TIMESTAMP DEFAULT NOW()
    )
  `;

  for (const car of cars) {
    await sql`
      INSERT INTO cars (id, user_id, make, model, year, mileage, condition, body_type, location, description, image_url, color, vin)
      VALUES (${car.id}, ${car.user_id}, ${car.make}, ${car.model}, ${car.year}, ${car.mileage}, ${car.condition}, ${car.body_type}, ${car.location}, ${car.description}, ${car.image_url}, ${car.color}, ${car.vin})
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

async function seedAuctions() {
  await sql`
    CREATE TABLE IF NOT EXISTS auctions (
      id                 UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      car_id             UUID REFERENCES cars(id) ON DELETE CASCADE,
      starting_price     INT NOT NULL,
      current_price      INT NOT NULL,
      reserve_price      INT,
      buy_now_price      INT,
      auction_start_date DATE NOT NULL,
      auction_end_date   DATE NOT NULL,
      status             VARCHAR(20) NOT NULL DEFAULT 'live',
      search_vector      tsvector,
      created_at         TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_auctions_search ON auctions USING GIN(search_vector)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_auctions_end_date ON auctions(auction_end_date)`;

  // Create the search vector trigger
  await sql`
    CREATE OR REPLACE FUNCTION auctions_search_vector_update() RETURNS trigger AS $$
    DECLARE
      car_record RECORD;
    BEGIN
      SELECT make, model, year, description, color, body_type, location
        INTO car_record
        FROM cars WHERE id = NEW.car_id;

      NEW.search_vector := to_tsvector('english',
        coalesce(car_record.make, '') || ' ' ||
        coalesce(car_record.model, '') || ' ' ||
        coalesce(car_record.year::text, '') || ' ' ||
        coalesce(car_record.description, '') || ' ' ||
        coalesce(car_record.color, '') || ' ' ||
        coalesce(car_record.body_type, '') || ' ' ||
        coalesce(car_record.location, '')
      );
      RETURN NEW;
    END
    $$ LANGUAGE plpgsql
  `;

  await sql`DROP TRIGGER IF EXISTS tsvectorupdate ON auctions`;
  await sql`
    CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON auctions
    FOR EACH ROW EXECUTE PROCEDURE auctions_search_vector_update()
  `;

  for (const auction of auctions) {
    await sql`
      INSERT INTO auctions (id, car_id, starting_price, current_price, reserve_price, buy_now_price, auction_start_date, auction_end_date, status)
      VALUES (${auction.id}, ${auction.car_id}, ${auction.starting_price}, ${auction.current_price}, ${auction.reserve_price}, ${auction.buy_now_price}, ${auction.auction_start_date}, ${auction.auction_end_date}, ${auction.status})
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

async function seedBids() {
  await sql`
    CREATE TABLE IF NOT EXISTS bids (
      id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
      user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
      bid_amount INT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_bids_auction ON bids(auction_id)`;

  for (const bid of bids) {
    await sql`
      INSERT INTO bids (auction_id, user_id, bid_amount, created_at)
      VALUES (${bid.auction_id}, ${bid.user_id}, ${bid.bid_amount}, ${bid.created_at})
    `;
  }
}

async function seedWatchlist() {
  await sql`
    CREATE TABLE IF NOT EXISTS watchlist (
      id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
      auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, auction_id)
    )
  `;

  for (const item of watchlist) {
    await sql`
      INSERT INTO watchlist (user_id, auction_id)
      VALUES (${item.user_id}, ${item.auction_id})
      ON CONFLICT (user_id, auction_id) DO NOTHING
    `;
  }
}

export async function GET() {
  try {
    await dropTables();
    await seedUsers();
    await seedCars();
    await seedAuctions();
    await seedBids();
    await seedWatchlist();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

