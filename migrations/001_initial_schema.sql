-- Car Auction Platform: Initial Schema
-- Neon Postgres (requires uuid-ossp extension)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,
  avatar_url VARCHAR(500),
  bio        TEXT,
  location   VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- CARS
-- ============================================================
CREATE TABLE IF NOT EXISTS cars (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  make        VARCHAR(255) NOT NULL,
  model       VARCHAR(255) NOT NULL,
  year        INT NOT NULL,
  mileage     INT,
  condition   VARCHAR(20) CHECK (condition IN ('Excellent','Good','Fair','Poor')),
  body_type   VARCHAR(30) CHECK (body_type IN ('Sedan','SUV','Coupe','Truck','Van','Convertible','Hatchback','Wagon','Sports')),
  location    VARCHAR(255),
  description TEXT,
  image_url   VARCHAR(500),
  color       VARCHAR(50),
  vin         VARCHAR(17),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- AUCTIONS
-- ============================================================
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
);

CREATE INDEX IF NOT EXISTS idx_auctions_search ON auctions USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_end_date ON auctions(auction_end_date);

-- Trigger: auto-update search_vector when auction is inserted/updated
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
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tsvectorupdate ON auctions;
CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON auctions
FOR EACH ROW EXECUTE PROCEDURE auctions_search_vector_update();

-- ============================================================
-- BIDS
-- ============================================================
CREATE TABLE IF NOT EXISTS bids (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  bid_amount INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bids_auction ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_user ON bids(user_id);

-- ============================================================
-- WATCHLIST
-- ============================================================
CREATE TABLE IF NOT EXISTS watchlist (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, auction_id)
);
