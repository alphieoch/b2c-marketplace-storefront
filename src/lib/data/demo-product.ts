import type { HttpTypes } from "@medusajs/types"
import type { Product as CarouselProduct } from "@/components/ui/product-carousel"
import type { Product as LegacyProduct } from "@/types/product"
import type { SellerProps } from "@/types/seller"

function makeCalculatedPrice(amount: number, original: number) {
  return {
    id: `demo-price-${amount}`,
    calculated_amount: amount,
    calculated_amount_with_tax: amount,
    original_amount: original,
    currency_code: "usd",
  } as any
}

function makeStoreProduct(
  id: string,
  title: string,
  handle: string,
  subtitle: string,
  price: number,
  originalPrice: number,
  image: string,
  description: string,
  categoryName: string,
  categoryHandle: string,
  seller: SellerProps
): HttpTypes.StoreProduct & { seller?: SellerProps } {
  return {
    id,
    title,
    handle,
    subtitle,
    thumbnail: image,
    description,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "published",
    type_id: null,
    collection_id: null,
    tags: [{ id: "demo", value: "organic" }],
    images: [{ id: `demo-img-${id}`, url: image }],
    variants: [
      {
        id: `demo-variant-${id}`,
        title: "Standard",
        sku: `DEMO-${id.toUpperCase().replace(/-/g, "")}`,
        calculated_price: makeCalculatedPrice(price, originalPrice),
        options: [
          {
            id: `demo-opt-${id}`,
            option: { id: `opt-${id}`, title: "Size" },
            value: subtitle,
          },
        ],
        inventory_quantity: 100,
      } as any,
    ],
    options: [
      {
        id: `demo-opt-parent-${id}`,
        title: "Size",
        values: [{ id: `v-${id}`, value: subtitle }],
      },
    ],
    categories: [
      {
        id: `demo-cat-${categoryHandle}`,
        name: categoryName,
        handle: categoryHandle,
      } as any,
    ],
    type: null,
    collection: null,
    sales_channels: [],
    shipping_profile: null,
    seller,
  }
}

function makeCarouselProduct(
  id: string,
  name: string,
  quantity: string,
  price: string,
  originalPrice: string,
  discount: string,
  image: string,
  href: string
): CarouselProduct {
  return {
    id,
    name,
    quantity,
    priceLabel: price,
    originalPriceLabel: originalPrice,
    discount,
    deliveryTime: "In stock",
    imageUrl: image,
    productHref: href,
  }
}

const DEMO_SELLER: SellerProps = {
  id: "demo-seller",
  name: "Green Acres Farm",
  handle: "green-acres-farm",
  description: "Family-owned farm offering fresh organic produce and artisan goods.",
  photo:
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&auto=format&fit=crop&q=80",
  tax_id: "DEMO-TAX-001",
  created_at: new Date().toISOString(),
  country_code: "us",
  city: "Springfield",
  address_line: "123 Farm Road",
  postal_code: "62701",
  store_status: "ACTIVE",
}

const DEMO_PRODUCTS_DATA = [
  {
    id: "demo-produce",
    title: "Heirloom Tomato Mix",
    handle: "heirloom-tomato-mix",
    subtitle: "2 lb",
    price: 5.99,
    originalPrice: 8.99,
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80",
    description:
      "A colorful assortment of heirloom tomatoes freshly picked from the vine.",
    href: "/categories/produce",
    categoryName: "Produce",
    categoryHandle: "produce",
  },
  {
    id: "demo-dairy-eggs",
    title: "Farm-Fresh Brown Eggs",
    handle: "farm-fresh-brown-eggs",
    subtitle: "1 dozen",
    price: 4.49,
    originalPrice: 6.49,
    image:
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800&auto=format&fit=crop&q=80",
    description:
      "Pasture-raised brown eggs from free-range hens on local family farms.",
    href: "/categories/dairy-eggs",
    categoryName: "Dairy & Eggs",
    categoryHandle: "dairy-eggs",
  },
  {
    id: "demo-meat-poultry",
    title: "Grass-Fed Ground Beef",
    handle: "grass-fed-ground-beef",
    subtitle: "1 lb",
    price: 8.99,
    originalPrice: 12.99,
    image:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&auto=format&fit=crop&q=80",
    description:
      "Premium grass-fed ground beef, raised without antibiotics or hormones.",
    href: "/categories/meat-poultry",
    categoryName: "Meat & Poultry",
    categoryHandle: "meat-poultry",
  },
  {
    id: "demo-pantry",
    title: "Raw Wildflower Honey",
    handle: "raw-wildflower-honey",
    subtitle: "16 oz",
    price: 9.99,
    originalPrice: 14.99,
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80",
    description:
      "Unfiltered raw wildflower honey harvested from local apiaries.",
    href: "/categories/pantry",
    categoryName: "Pantry",
    categoryHandle: "pantry",
  },
  {
    id: "demo-plants-seeds",
    title: "Organic Basil Seedlings",
    handle: "organic-basil-seedlings",
    subtitle: "3 pack",
    price: 6.99,
    originalPrice: 9.99,
    image:
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&auto=format&fit=crop&q=80",
    description:
      "Fragrant organic basil seedlings ready to plant in your garden or windowsill.",
    href: "/categories/plants-seeds",
    categoryName: "Plants & Seeds",
    categoryHandle: "plants-seeds",
  },
  {
    id: "demo-machinery",
    title: "Compact Garden Tiller",
    handle: "compact-garden-tiller",
    subtitle: "1 unit",
    price: 149.99,
    originalPrice: 199.99,
    image:
      "https://images.unsplash.com/photo-1622383563227-044011358d26?w=800&auto=format&fit=crop&q=80",
    description:
      "Lightweight electric garden tiller perfect for small plots and raised beds.",
    href: "/categories/machinery",
    categoryName: "Machinery",
    categoryHandle: "machinery",
  },
  {
    id: "demo-cattle-livestock",
    title: "Nubian Dairy Goat",
    handle: "nubian-dairy-goat",
    subtitle: "1 animal",
    price: 299.99,
    originalPrice: 399.99,
    image:
      "https://images.unsplash.com/photo-1524024973431-2ad916746881?w=800&auto=format&fit=crop&q=80",
    description:
      "Healthy registered Nubian dairy goat, great for milk production and breeding.",
    href: "/categories/cattle-livestock",
    categoryName: "Cattle & Livestock",
    categoryHandle: "cattle-livestock",
  },
  {
    id: "demo-agrovet",
    title: "Organic Fertilizer Blend",
    handle: "organic-fertilizer-blend",
    subtitle: "25 lb",
    price: 18.99,
    originalPrice: 27.99,
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop&q=80",
    description:
      "All-purpose organic fertilizer blend for vegetables, fruits, and flowers.",
    href: "/categories/agrovet-supplies",
    categoryName: "Agrovet Supplies",
    categoryHandle: "agrovet-supplies",
  },
]

export const DEMO_CAROUSEL_PRODUCTS: CarouselProduct[] =
  DEMO_PRODUCTS_DATA.map((d) =>
    makeCarouselProduct(
      d.id,
      d.title,
      d.subtitle,
      `$${d.price.toFixed(2)}`,
      `$${d.originalPrice.toFixed(2)}`,
      `${Math.round(((d.originalPrice - d.price) / d.originalPrice) * 100)}% OFF`,
      d.image,
      d.href
    )
  )

export const DEMO_STORE_PRODUCTS: (HttpTypes.StoreProduct & {
  seller?: SellerProps
})[] = DEMO_PRODUCTS_DATA.map((d) =>
  makeStoreProduct(
    d.id,
    d.title,
    d.handle,
    d.subtitle,
    d.price,
    d.originalPrice,
    d.image,
    d.description,
    d.categoryName,
    d.categoryHandle,
    DEMO_SELLER
  )
)

export const DEMO_LEGACY_PRODUCT: LegacyProduct = {
  id: 999999,
  brand: "Demo Farm",
  handle: "organic-farm-fresh-box",
  title: "Organic Farm Fresh Box",
  size: "1 box",
  price: 12.99,
  originalPrice: 18.99,
  thumbnail:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80",
  created_at: new Date().toISOString(),
  sold: false,
}

/**
 * Generate facet counts from demo products to populate sidebar filters
 * when the search API returns empty facets.
 */
export function getDemoFacets(): Record<string, Record<string, number>> {
  const facets: Record<string, Record<string, number>> = {
    "categories.name": {},
    "seller.name": {},
    "seller.country_code": {},
    "seller.fulfillment_types": {},
    "variants.size": {},
    "variants.color": {},
    "variants.condition": {},
  }

  for (const product of DEMO_STORE_PRODUCTS) {
    // Categories
    for (const cat of product.categories || []) {
      const name = (cat as any).name || "Uncategorized"
      facets["categories.name"][name] =
        (facets["categories.name"][name] || 0) + 1
    }

    // Seller
    if (product.seller) {
      const sellerName = product.seller.name
      facets["seller.name"][sellerName] =
        (facets["seller.name"][sellerName] || 0) + 1

      const countryCode = product.seller.country_code || "us"
      facets["seller.country_code"][countryCode] =
        (facets["seller.country_code"][countryCode] || 0) + 1

      // Fulfillment types
      const fulfillmentTypes = ["delivery", "pickup"]
      for (const ft of fulfillmentTypes) {
        facets["seller.fulfillment_types"][ft] =
          (facets["seller.fulfillment_types"][ft] || 0) + 1
      }
    }

    // Variant options for Algolia-style facets
    for (const variant of product.variants || []) {
      const size = (variant as any).options?.[0]?.value || "Standard"
      facets["variants.size"][size] =
        (facets["variants.size"][size] || 0) + 1

      // Color & condition — use defaults since demo products don't have them
      facets["variants.color"]["Natural"] =
        (facets["variants.color"]["Natural"] || 0) + 1
      facets["variants.condition"]["New"] =
        (facets["variants.condition"]["New"] || 0) + 1
    }
  }

  return facets
}

export function ensureAtLeastOneProduct(
  products: CarouselProduct[]
): CarouselProduct[] {
  if (products.length === 0) {
    return DEMO_CAROUSEL_PRODUCTS
  }
  return products
}

export function ensureAtLeastOneStoreProduct(
  products: (HttpTypes.StoreProduct & { seller?: any })[]
): (HttpTypes.StoreProduct & { seller?: any })[] {
  if (products.length === 0) {
    return DEMO_STORE_PRODUCTS
  }
  return products
}
