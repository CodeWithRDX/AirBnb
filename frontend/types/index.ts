export type UserRole = 'GUEST' | 'HOST' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profile_image?: string | null;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface ListingImage {
  id: string;
  image_url: string;
  display_order: number;
}

export interface Listing {
  id: string;
  host: User;
  title: string;
  description: string;
  property_type: string;
  location: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number;
  review_count: number;
  images: ListingImage[];
  amenities?: Amenity[];
  is_favorite?: boolean;
  created_at: string;
  updated_at?: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  listing: Listing;
  guest: User;
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
  subtotal: number;
  cleaning_fee: number;
  service_fee: number;
  total_price: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  listing: string;
  user: User;
  booking: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  listing: Listing;
  created_at: string;
}

export interface SearchFilters {
  search?: string;
  location?: string;
  city?: string;
  country?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  min_price?: number;
  max_price?: number;
  property_type?: string;
  amenities?: string;
  min_rating?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface HostStats {
  total_listings: number;
  total_bookings: number;
  confirmed_bookings: number;
  estimated_revenue: number;
  average_rating: number;
}
