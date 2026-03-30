# 🚗 Car Auction Platform

A modern Next.js application for buying and selling vehicles through an online auction system. Features real-time bidding, auction management, watchlist tracking, and an interactive analytics dashboard.

## Features

- **Create & Manage Auctions** — List vehicles for auction with detailed specs and photos
- **Live Bidding System** — Place bids on active auctions with real-time countdown
- **Watchlist** — Track interesting vehicles and monitor auction progress
- **Bid History & Activity** — View all bids and auction activity in real-time
- **Analytics Dashboard** — Visual insights into auction trends, bid distribution, and performance metrics
- **User Profiles** — Seller and bidder profiles with ratings and auction history
- **Search & Filtering** — Find vehicles by make, model, price range, condition, and more
- **Secure Authentication** — Email-based login with session management

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Neon)
- **Authentication:** NextAuth.js v5
- **Charts & Visualization:** Recharts
- **Utilities:** Bcrypt, Zod, Clsx

## Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** database (local or remote, like Neon)
- **pnpm** (or npm/yarn as alternative)

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/your-username/car-auction.git
cd car-auction
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the `.env` file (already present in the repo) and verify your PostgreSQL connection settings:

```env
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_prisma_connection_string
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_connection_string
AUTH_SECRET=your_auth_secret_key
AUTH_URL=http://localhost:3000/api/auth
```

### 4. Seed the database

The application includes a seed script with pre-configured test data. Access it by visiting:

```
http://localhost:3000/api/seed
```

Or trigger it programmatically during development. This populates the database with:
- 8 test users (sellers, bidders, and admin)
- 12 pre-listed vehicles
- Sample auctions at various stages
- Bid history and watchlist data

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For production build:

```bash
pnpm build
pnpm start
```

## Project Structure

```
car-auction/
├── app/
│   ├── api/                    # API routes and seed script
│   │   └── seed/
│   │       └── route.ts        # Database seeding endpoint
│   ├── dashboard/              # Authenticated dashboard pages
│   │   ├── auctions/           # Auction browsing and creation
│   │   ├── inbox/              # Messages (sellers/bidders)
│   │   ├── profile/            # User profiles
│   │   └── settings/           # User settings
│   ├── ui/                     # Reusable components
│   │   ├── auctions/           # Auction-specific components
│   │   ├── dashboard/          # Dashboard charts & layouts
│   │   └── inbox/              # Messaging components
│   ├── lib/                    # Utilities and helpers
│   │   ├── placeholder-data.ts # Test seed data
│   │   ├── db.ts              # Database connection
│   │   ├── actions.ts         # Server actions
│   │   └── definitions.ts     # TypeScript types
│   ├── login/                  # Authentication
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── migrations/                 # Database schema (SQL)
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── auth.config.ts              # NextAuth configuration
```

## Test Accounts

**All test accounts use the password: `123456`**

Below are pre-configured users for testing both seller and bidder workflows:

| Name | Email | Role | Location |
|------|-------|------|----------|
| Marcus Chen | seller@auction.com | Seller | Los Angeles, CA |
| Sarah Mitchell | sarah@auction.com | Seller | Austin, TX |
| James Rivera | bidder1@auction.com | Bidder | Miami, FL |
| Emily Watson | bidder2@auction.com | Bidder | Denver, CO |
| David Park | david@auction.com | Seller & Bidder | Seattle, WA |
| Lisa Nguyen | lisa@auction.com | Bidder | Chicago, IL |
| Robert Taylor | robert@auction.com | Seller & Bidder | Phoenix, AZ |
| Admin User | admin@auction.com | Admin | New York, NY |

**Note:** Test data includes sample vehicles (Porsche 911, BMW M3, Tesla Model S, etc.), active auctions, and bid history for demo purposes.

## ⚠️ Important Usage Rules

### Creating Auctions
- ✅ **Any authenticated user can create an auction** by listing one of their vehicles
- ✅ You maintain full control: set starting bid, auction duration, and reserve price
- ✅ Multiple vehicles per user supported

### Bidding Rules
- ❌ **You cannot bid on auctions you created**
- ✅ Bidders can only bid on auctions created by other users
- ✅ Highest valid bid wins when auction ends
- ✅ Sellers can accept or decline final offers

### Getting Started
1. Log in with any test account above (password: `123456`)
2. Navigate to **Auctions** to browse available listings
3. To create an auction: Go to **Create Auction**, add vehicle details, and publish
4. To bid: View another user's auction and place your bid
5. Check **Inbox** for bid notifications and messages from sellers/bidders
6. Use **Watchlist** to track auctions you're interested in

## Development

### Running Tests

```bash
pnpm lint
```

### Building for Production

```bash
pnpm build
```

The application is ready to deploy on Vercel, AWS, or any Node.js hosting platform.

## License

ISC
