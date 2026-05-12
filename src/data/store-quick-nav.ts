/**
 * Quick links for /stores — query keys match StoresListing + StoreSidebar
 * (`highlight`, `specialty`).
 */
export const storeQuickNavItems: { label: string; href: string }[] = [
  { label: "All stores", href: "/stores" },
  /** Sellers tagged with this specialty in metadata; adjust label/data if your catalog differs */
  { label: "Local", href: "/stores?specialty=local" },
  { label: "Popular", href: "/stores?highlight=popular" },
  { label: "New", href: "/stores?highlight=new" },
  { label: "Organic", href: "/stores?highlight=organic" },
  { label: "Best pick", href: "/stores?highlight=best_pick" },
  { label: "Premium", href: "/stores?highlight=premium" },
]
