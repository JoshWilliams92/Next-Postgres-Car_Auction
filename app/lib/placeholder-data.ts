// Comprehensive seed data for the Car Auction platform.
// Users, cars, auctions, bids, and watchlist entries.

// ── Users ───────────────────────────────────────────────────
// All passwords are '123456' (hashed at seed time)
const users = [
  {
    avatar_url: null,
    bio: 'Luxury car dealer with 15 years in the business.',
    email: 'seller@auction.com',
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    location: 'Los Angeles, CA',
    name: 'Marcus Chen',
    password: '123456',
  },
  {
    avatar_url: null,
    bio: 'Classic car enthusiast and restorer.',
    email: 'sarah@auction.com',
    id: '51a5b22c-1d6f-4f2e-a4b3-dce3a1b2f3a4',
    location: 'Austin, TX',
    name: 'Sarah Mitchell',
    password: '123456',
  },
  {
    avatar_url: null,
    bio: 'Always looking for the next great deal.',
    email: 'bidder1@auction.com',
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    location: 'Miami, FL',
    name: 'James Rivera',
    password: '123456',
  },
  {
    avatar_url: null,
    bio: 'Weekend racer and car collector.',
    email: 'bidder2@auction.com',
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    location: 'Denver, CO',
    name: 'Emily Watson',
    password: '123456',
  },
  {
    avatar_url: null,
    bio: 'Seller and buyer — I flip project cars.',
    email: 'david@auction.com',
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    location: 'Seattle, WA',
    name: 'David Park',
    password: '123456',
  },
  {
    avatar_url: null,
    bio: 'First-time buyer, exploring the market.',
    email: 'lisa@auction.com',
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    location: 'Chicago, IL',
    name: 'Lisa Nguyen',
    password: '123456',
  },
  {
    avatar_url: null,
    bio: 'Sports car specialist and racing instructor.',
    email: 'robert@auction.com',
    id: 'c3d4e5f6-a7b8-4012-8def-123456789012',
    location: 'Phoenix, AZ',
    name: 'Robert Taylor',
    password: '123456',
  },
  {
    avatar_url: null,
    bio: 'Platform administrator.',
    email: 'admin@auction.com',
    id: 'd4e5f6a7-b8c9-4123-8efa-234567890123',
    location: 'New York, NY',
    name: 'Admin User',
    password: '123456',
  },
];

// ── Cars ────────────────────────────────────────────────────
const cars = [
  {
    id: 'a1111111-1111-1111-8111-111111111111',
    user_id: users[0].id, // Marcus (seller)
    make: 'Porsche',
    model: '911 Turbo S',
    year: 2021,
    mileage: 12000,
    condition: 'Excellent',
    body_type: 'Sports',
    location: 'Los Angeles, CA',
    description: 'Pristine 911 Turbo S with sport exhaust, PDK transmission, and full leather interior. One owner, garage kept.',
    image_url: 'https://placehold.co/600x400',
    color: 'GT Silver Metallic',
    vin: 'WP0AD2A91MS25',
  },
  {
    id: 'a2222222-2222-2222-8222-222222222222',
    user_id: users[0].id, // Marcus (seller)
    make: 'Lamborghini',
    model: 'Urus',
    year: 2022,
    mileage: 8500,
    condition: 'Excellent',
    body_type: 'SUV',
    location: 'Los Angeles, CA',
    description: 'Pearl capsule edition with full carbon fiber package. Bang & Olufsen sound, panoramic roof.',
    image_url: 'https://placehold.co/600x400',
    color: 'Bianco Monocerus',
    vin: 'ZPBUA1ZL9NLA1',
  },
  {
    id: 'a3333333-3333-3333-8333-333333333333',
    user_id: users[1].id, // Sarah (seller)
    make: 'Ford',
    model: 'Mustang GT',
    year: 2020,
    mileage: 25000,
    condition: 'Good',
    body_type: 'Coupe',
    location: 'Austin, TX',
    description: 'V8 5.0L with performance pack, Brembo brakes, and active exhaust. Clean title.',
    image_url: 'https://placehold.co/600x400',
    color: 'Velocity Blue',
    vin: '1FA6P8CF0L55',
  },
  {
    id: 'a4444444-4444-4444-8444-444444444444',
    user_id: users[1].id, // Sarah (seller)
    make: 'BMW',
    model: 'M3 Competition',
    year: 2023,
    mileage: 5200,
    condition: 'Excellent',
    body_type: 'Sedan',
    location: 'Austin, TX',
    description: 'G80 M3 Competition with M xDrive. Carbon bucket seats, head-up display, Harman Kardon.',
    image_url: 'https://placehold.co/600x400',
    color: 'Isle of Man Green',
    vin: 'WBS43AY08PFN',
  },
  {
    id: 'a5555555-5555-5555-8555-555555555555',
    user_id: users[4].id, // David (both)
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2023,
    mileage: 11000,
    condition: 'Excellent',
    body_type: 'Sedan',
    location: 'Seattle, WA',
    description: 'Tri-motor all-wheel drive. Full self-driving capability, white interior, carbon fiber spoiler.',
    image_url: 'https://placehold.co/600x400',
    color: 'Midnight Silver',
    vin: '5YJSA1E66PF4',
  },
  {
    id: 'a6666666-6666-6666-8666-666666666666',
    user_id: users[4].id, // David (both)
    make: 'Toyota',
    model: 'Supra GR',
    year: 2022,
    mileage: 18000,
    condition: 'Good',
    body_type: 'Coupe',
    location: 'Seattle, WA',
    description: 'A91-CF edition with carbon fiber body kit. 6-speed manual, limited slip diff.',
    image_url: 'https://placehold.co/600x400',
    color: 'Absolute Zero White',
    vin: 'WZ1DB4C05NW0',
  },
  {
    id: 'a7777777-7777-7777-8777-777777777777',
    user_id: users[6].id, // Robert (both)
    make: 'Mercedes-Benz',
    model: 'AMG GT',
    year: 2021,
    mileage: 15000,
    condition: 'Good',
    body_type: 'Coupe',
    location: 'Phoenix, AZ',
    description: 'Handcrafted AMG 4.0L V8 biturbo. AMG Performance exhaust, night package, Burmester audio.',
    image_url: 'https://placehold.co/600x400',
    color: 'Selenite Grey',
    vin: 'W1K7X6BA6MA0',
  },
  {
    id: 'a8888888-8888-8888-8888-888888888888',
    user_id: users[6].id, // Robert (both)
    make: 'Honda',
    model: 'Civic Type R',
    year: 2024,
    mileage: 3200,
    condition: 'Excellent',
    body_type: 'Hatchback',
    location: 'Phoenix, AZ',
    description: 'FL5 generation. 315hp turbo, limited slip diff, adaptive dampers. Track-ready hot hatch.',
    image_url: 'https://placehold.co/600x400',
    color: 'Championship White',
    vin: '2HGFE1F90RW0',
  },
  {
    id: 'a9999999-9999-9999-8999-999999999999',
    user_id: users[0].id, // Marcus (seller)
    make: 'Audi',
    model: 'RS6 Avant',
    year: 2022,
    mileage: 22000,
    condition: 'Good',
    body_type: 'Wagon',
    location: 'Los Angeles, CA',
    description: 'Performance wagon with 591hp twin-turbo V8. Dynamic ride control, B&O 3D sound.',
    image_url: 'https://placehold.co/600x400',
    color: 'Nardo Grey',
    vin: 'WUAEBCF26NN0',
  },
  {
    id: 'aa111111-aaaa-1111-aaaa-111111111111',
    user_id: users[1].id, // Sarah (seller)
    make: 'Chevrolet',
    model: 'Corvette C8',
    year: 2023,
    mileage: 7500,
    condition: 'Excellent',
    body_type: 'Convertible',
    location: 'Austin, TX',
    description: 'Mid-engine Stingray convertible with Z51 performance package. Magnetic ride, front lift.',
    image_url: 'https://placehold.co/600x400',
    color: 'Torch Red',
    vin: '1G1YB3D41P51',
  },
  {
    id: 'aa222222-bbbb-2222-bbbb-222222222222',
    user_id: users[4].id, // David (both)
    make: 'Nissan',
    model: 'GT-R NISMO',
    year: 2021,
    mileage: 9800,
    condition: 'Excellent',
    body_type: 'Coupe',
    location: 'Seattle, WA',
    description: 'Hand-assembled VR38 engine by Takumi craftsmen. NISMO-tuned suspension and aero package.',
    image_url: 'https://placehold.co/600x400',
    color: 'Brilliant White Pearl',
    vin: 'JN1TBNT36Z00',
  },
  {
    id: 'aa333333-cccc-3333-8ccc-333333333333',
    user_id: users[6].id, // Robert (both)
    make: 'Dodge',
    model: 'Challenger SRT Hellcat',
    year: 2023,
    mileage: 4100,
    condition: 'Excellent',
    body_type: 'Coupe',
    location: 'Phoenix, AZ',
    description: 'Supercharged 6.2L HEMI V8 producing 717hp. Widebody with 20-inch wheels.',
    image_url: 'https://placehold.co/600x400',
    color: 'Frostbite Blue',
    vin: '2C3CDZL99PH5',
  },
];

// ── Auctions ────────────────────────────────────────────────
// Dates set relative to "now" — future end dates for live auctions.
const auctions = [
  {
    id: 'b1111111-1111-1111-8111-111111111111',
    car_id: cars[0].id, // Porsche 911
    starting_price: 7500000,    // $75,000
    current_price: 8500000,     // $85,000
    reserve_price: 9000000,     // $90,000
    buy_now_price: 12000000,    // $120,000
    auction_start_date: '2026-03-01',
    auction_end_date: '2026-11-15',
    status: 'live',
  },
  {
    id: 'b2222222-2222-2222-8222-222222222222',
    car_id: cars[1].id, // Lamborghini Urus
    starting_price: 15000000,   // $150,000
    current_price: 16500000,    // $165,000
    reserve_price: 18000000,    // $180,000
    buy_now_price: 22000000,    // $220,000
    auction_start_date: '2026-03-05',
    auction_end_date: '2027-04-20',
    status: 'live',
  },
  {
    id: 'b3333333-3333-3333-8333-333333333333',
    car_id: cars[2].id, // Ford Mustang GT
    starting_price: 3500000,    // $35,000
    current_price: 3900000,     // $39,000
    reserve_price: null,
    buy_now_price: 4500000,     // $45,000
    auction_start_date: '2026-03-10',
    auction_end_date: '2026-04-10',
    status: 'live',
  },
  {
    id: 'b4444444-4444-4444-8444-444444444444',
    car_id: cars[3].id, // BMW M3
    starting_price: 7000000,    // $70,000
    current_price: 7200000,     // $72,000
    reserve_price: 7500000,     // $75,000
    buy_now_price: null,
    auction_start_date: '2026-03-15',
    auction_end_date: '2026-04-30',
    status: 'live',
  },
  {
    id: 'b5555555-5555-5555-8555-555555555555',
    car_id: cars[4].id, // Tesla Model S Plaid
    starting_price: 8000000,    // $80,000
    current_price: 8800000,     // $88,000
    reserve_price: 9500000,     // $95,000
    buy_now_price: 11000000,    // $110,000
    auction_start_date: '2026-03-20',
    auction_end_date: '2027-05-01',
    status: 'live',
  },
  {
    id: 'b6666666-6666-6666-8666-666666666666',
    car_id: cars[5].id, // Toyota Supra GR
    starting_price: 4500000,    // $45,000
    current_price: 5200000,     // $52,000
    reserve_price: null,
    buy_now_price: 5800000,     // $58,000
    auction_start_date: '2026-02-01',
    auction_end_date: '2027-03-15',
    status: 'ended',
  },
  {
    id: 'b7777777-7777-7777-8777-777777777777',
    car_id: cars[6].id, // Mercedes AMG GT
    starting_price: 9000000,    // $90,000
    current_price: 9000000,     // $90,000 (no bids yet)
    reserve_price: 10000000,    // $100,000
    buy_now_price: 13000000,    // $130,000
    auction_start_date: '2026-04-01',
    auction_end_date: '2026-05-15',
    status: 'live',
  },
  {
    id: 'b8888888-8888-8888-8888-888888888888',
    car_id: cars[7].id, // Honda Civic Type R
    starting_price: 4200000,    // $42,000
    current_price: 4600000,     // $46,000
    reserve_price: null,
    buy_now_price: null,
    auction_start_date: '2026-01-15',
    auction_end_date: '2026-02-28',
    status: 'ended',
  },
  {
    id: 'b9999999-9999-9999-8999-999999999999',
    car_id: cars[8].id, // Audi RS6 Avant
    starting_price: 8500000,    // $85,000
    current_price: 9200000,     // $92,000
    reserve_price: 9500000,     // $95,000
    buy_now_price: 11500000,    // $115,000
    auction_start_date: '2026-03-25',
    auction_end_date: '2026-04-25',
    status: 'live',
  },
  {
    id: 'ba111111-aaaa-1111-aaaa-111111111111',
    car_id: cars[9].id, // Corvette C8
    starting_price: 6500000,    // $65,000
    current_price: 7100000,     // $71,000
    reserve_price: 7000000,     // $70,000
    buy_now_price: 8500000,     // $85,000
    auction_start_date: '2026-03-20',
    auction_end_date: '2026-04-20',
    status: 'live',
  },
];

// ── Bids ────────────────────────────────────────────────────
const bids = [
  // Porsche 911 — 4 bids
  { auction_id: auctions[0].id, user_id: users[2].id, bid_amount: 7800000, created_at: '2026-03-05 10:30:00' },
  { auction_id: auctions[0].id, user_id: users[3].id, bid_amount: 8000000, created_at: '2026-03-06 14:15:00' },
  { auction_id: auctions[0].id, user_id: users[5].id, bid_amount: 8200000, created_at: '2026-03-08 09:45:00' },
  { auction_id: auctions[0].id, user_id: users[2].id, bid_amount: 8500000, created_at: '2026-03-10 16:20:00' },

  // Lamborghini Urus — 3 bids
  { auction_id: auctions[1].id, user_id: users[3].id, bid_amount: 15500000, created_at: '2026-03-07 11:00:00' },
  { auction_id: auctions[1].id, user_id: users[6].id, bid_amount: 16000000, created_at: '2026-03-09 13:30:00' },
  { auction_id: auctions[1].id, user_id: users[3].id, bid_amount: 16500000, created_at: '2026-03-11 15:45:00' },

  // Ford Mustang GT — 3 bids
  { auction_id: auctions[2].id, user_id: users[2].id, bid_amount: 3600000, created_at: '2026-03-12 08:00:00' },
  { auction_id: auctions[2].id, user_id: users[5].id, bid_amount: 3750000, created_at: '2026-03-13 10:30:00' },
  { auction_id: auctions[2].id, user_id: users[2].id, bid_amount: 3900000, created_at: '2026-03-14 12:00:00' },

  // BMW M3 — 2 bids
  { auction_id: auctions[3].id, user_id: users[2].id, bid_amount: 7100000, created_at: '2026-03-16 09:00:00' },
  { auction_id: auctions[3].id, user_id: users[4].id, bid_amount: 7200000, created_at: '2026-03-17 14:00:00' },

  // Tesla Model S Plaid — 3 bids
  { auction_id: auctions[4].id, user_id: users[3].id, bid_amount: 8300000, created_at: '2026-03-21 10:00:00' },
  { auction_id: auctions[4].id, user_id: users[2].id, bid_amount: 8500000, created_at: '2026-03-22 11:30:00' },
  { auction_id: auctions[4].id, user_id: users[5].id, bid_amount: 8800000, created_at: '2026-03-23 14:15:00' },

  // Toyota Supra (ended) — 3 bids
  { auction_id: auctions[5].id, user_id: users[2].id, bid_amount: 4700000, created_at: '2026-02-05 10:00:00' },
  { auction_id: auctions[5].id, user_id: users[3].id, bid_amount: 4900000, created_at: '2026-02-10 13:00:00' },
  { auction_id: auctions[5].id, user_id: users[2].id, bid_amount: 5200000, created_at: '2026-02-14 16:30:00' },

  // Civic Type R (ended) — 2 bids
  { auction_id: auctions[7].id, user_id: users[5].id, bid_amount: 4400000, created_at: '2026-01-20 09:00:00' },
  { auction_id: auctions[7].id, user_id: users[3].id, bid_amount: 4600000, created_at: '2026-02-01 11:45:00' },

  // Audi RS6 Avant — 2 bids
  { auction_id: auctions[8].id, user_id: users[2].id, bid_amount: 8800000, created_at: '2026-03-26 08:30:00' },
  { auction_id: auctions[8].id, user_id: users[5].id, bid_amount: 9200000, created_at: '2026-03-27 09:00:00' },

  // Corvette C8 — 3 bids
  { auction_id: auctions[9].id, user_id: users[3].id, bid_amount: 6700000, created_at: '2026-03-21 12:00:00' },
  { auction_id: auctions[9].id, user_id: users[2].id, bid_amount: 6900000, created_at: '2026-03-23 15:30:00' },
  { auction_id: auctions[9].id, user_id: users[5].id, bid_amount: 7100000, created_at: '2026-03-25 10:00:00' },
];

// ── Watchlist ───────────────────────────────────────────────
const watchlist = [
  { user_id: users[2].id, auction_id: auctions[0].id }, // James watches Porsche
  { user_id: users[2].id, auction_id: auctions[1].id }, // James watches Urus
  { user_id: users[3].id, auction_id: auctions[0].id }, // Emily watches Porsche
  { user_id: users[3].id, auction_id: auctions[4].id }, // Emily watches Tesla
  { user_id: users[5].id, auction_id: auctions[2].id }, // Lisa watches Mustang
  { user_id: users[5].id, auction_id: auctions[8].id }, // Lisa watches RS6
  { user_id: users[4].id, auction_id: auctions[3].id }, // David watches M3
  { user_id: users[6].id, auction_id: auctions[1].id }, // Robert watches Urus
];

export { users, cars, auctions, bids, watchlist };
