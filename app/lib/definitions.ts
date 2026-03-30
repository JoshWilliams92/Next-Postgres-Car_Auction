export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  created_at: string;
};

export type Car = {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
  body_type: string | null;
  location: string | null;
  description: string | null;
  image_url: string | null;
  color: string | null;
  vin: string | null;
  created_at: string;
};

export type Auction = {
  id: string;
  car_id: string;
  starting_price: number;
  current_price: number;
  reserve_price: number | null;
  buy_now_price: number | null;
  auction_start_date: string;
  auction_end_date: string;
  status: 'draft' | 'live' | 'ended';
  created_at: string;
};

export type Bid = {
  id: string;
  auction_id: string;
  user_id: string;
  bid_amount: number;
  created_at: string;
};

export type BidWithUser = {
  id: string;
  bid_amount: number;
  created_at: string;
  bidder_name: string;
  bidder_email: string;
};

export type AuctionWithCar = Auction & {
  car: Car;
};

export type AuctionListItem = {
  id: string;
  starting_price: number;
  current_price: number;
  reserve_price: number | null;
  buy_now_price: number | null;
  auction_start_date: string;
  auction_end_date: string;
  status: string;
  bid_count: number;
  car: {
    make: string;
    model: string;
    year: number;
    mileage: number | null;
    condition: string | null;
    body_type: string | null;
    location: string | null;
    image_url: string | null;
    color: string | null;
  };
};

export type AuctionDetail = AuctionListItem & {
  bid_count: number;
  bidder_count: number;
  seller: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    location: string | null;
  };
  car: AuctionListItem['car'] & {
    id: string;
    description: string | null;
    vin: string | null;
  };
};

export type WatchlistItem = {
  id: string;
  auction_id: string;
  created_at: string;
  auction: AuctionListItem;
};

export type DashboardStats = {
  activeAuctions: number;
  totalBids: number;
  avgPrice: number;
  trendingMake: string;
};

export type AuctionFilters = {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  makes?: string[];
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  conditions?: string[];
  bodyTypes?: string[];
  location?: string;
  status?: string;
};

export type UserProfile = Omit<User, 'password'> & {
  cars_count: number;
  active_listings: number;
  bids_placed: number;
  watchlist_count: number;
};

export type UserBid = {
  id: string;
  bid_amount: number;
  created_at: string;
  auction_id: string;
  car_make: string;
  car_model: string;
  car_year: number;
  auction_current_price: number;
  auction_end_date: string;
  auction_status: string;
  is_winning: boolean;
};
