import { Product } from "./product";

export type Highlight = "best_pick" | "popular" | "new" | "organic" | "premium";

export type SellerAddress = {
  address_line?: string;
  city?: string;
  country_code?: string;
  postal_code?: string;
};

export type SellerProps = SellerAddress & {
  id: string;
  name: string;
  handle: string;
  description: string;
  photo: string;
  tax_id: string;
  created_at: string;
  reviews?: any[];
  products?: Product[];
  email?: string;
  is_premium?: boolean;
  metadata?: Record<string, unknown> | null;
  address?: SellerAddress;
  specialties?: string[];
  highlights?: Highlight[];
  store_status?: "ACTIVE" | "SUSPENDED" | "INACTIVE";
};
