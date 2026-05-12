"use client"

import { HttpTypes } from "@medusajs/types"
import {
  SearchProductSidebar,
  ProductListingActiveFilters,
  ProductsPagination,
} from "@/components/organisms"
import {
  ProductListingLoadingView,
  ProductListingProductsView,
} from "@/components/molecules"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { PRODUCT_LIMIT } from "@/const"
import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { useEffect, useMemo, useRef, useState } from "react"
import { searchProducts } from "@/lib/data/products"
import { ensureAtLeastOneStoreProduct, DEMO_STORE_PRODUCTS, getDemoFacets } from "@/lib/data/demo-product"
import { FacetModel } from "@/components/organisms/ProductSidebar/SearchProductSidebar"

export const SearchProductsListing = ({
  category_id,
  collection_id,
  seller_handle,
  locale = process.env.NEXT_PUBLIC_DEFAULT_REGION,
  currency_code,
}: {
  category_id?: string
  collection_id?: string
  locale?: string
  seller_handle?: string
  currency_code: string
}) => {
  const searchParams = useSearchParams()

  const query: string = searchParams.get("query") || ""
  const page: number = +(searchParams.get("page") || 1)

  const sortParam = searchParams.get("sort")
  const sort = useMemo(() => {
    const allowed = new Set([
      "relevance",
      "title_asc",
      "title_desc",
      "price_asc",
      "price_desc",
    ])
    if (!sortParam || !allowed.has(sortParam)) {
      return "relevance" as const
    }
    return sortParam as
      | "relevance"
      | "title_asc"
      | "title_desc"
      | "price_asc"
      | "price_desc"
  }, [sortParam])

  // Build structured filters from URL params
  const filters = useMemo(() => {
    const result: {
      categories?: string[]
      price_min?: number
      price_max?: number
      seller_handle?: string
      region_codes?: string[]
      fulfillment_types?: string[]
    } = {}

    // Category from prop or URL
    const categoryIds: string[] = []
    if (category_id) {
      categoryIds.push(category_id)
    }
    const urlCategory = searchParams.get("category")
    if (urlCategory) {
      categoryIds.push(...urlCategory.split(","))
    }
    if (categoryIds.length) {
      result.categories = categoryIds
    }

    // Price filters
    const minPrice = searchParams.get("min_price")
    const maxPrice = searchParams.get("max_price")
    if (minPrice) {
      result.price_min = parseInt(minPrice, 10)
    }
    if (maxPrice) {
      result.price_max = parseInt(maxPrice, 10)
    }

    // Seller handle
    if (seller_handle) {
      result.seller_handle = seller_handle
    }

    const regions = searchParams.get("region")
    if (regions) {
      result.region_codes = regions.split(",").map((value) => value.toLowerCase())
    }

    const fulfillment = searchParams.get("fulfillment")
    if (fulfillment) {
      result.fulfillment_types = fulfillment
        .split(",")
        .map((value) => value.toLowerCase())
    }

    return result
  }, [searchParams, category_id, seller_handle])

  return (
    <ProductsListing
      locale={locale}
      currency_code={currency_code}
      filters={filters}
      query={query}
      page={page}
      sort={sort}
    />
  )
}

type ListingSort = "relevance" | "title_asc" | "title_desc" | "price_asc" | "price_desc"

const ProductsListing = ({
  locale,
  currency_code,
  filters,
  query,
  page,
  sort,
}: {
  locale?: string
  currency_code: string
  filters: {
    categories?: string[]
    price_min?: number
    price_max?: number
    seller_handle?: string
    region_codes?: string[]
    fulfillment_types?: string[]
  }
  query: string
  page: number
  sort: ListingSort
}) => {
  const [products, setProducts] = useState<
    (HttpTypes.StoreProduct & { seller?: any })[]
  >([])
  const [facets, setFacets] = useState<Record<string, FacetModel[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [pages, setPages] = useState(1)
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [isHoveringSidebar, setIsHoveringSidebar] = useState(false)
  const sidebarHideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastScrollY = useRef(0)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function fetchProducts() {
      if (!locale) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const result = await searchProducts({
          query: query || undefined,
          page: page,
          hitsPerPage: PRODUCT_LIMIT,
          filters,
          currency_code,
          countryCode: locale,
          ...(sort !== "relevance" ? { sort } : {}),
        })

        setProducts(result.products)
        setFacets(result.facets)
        setCount(result.nbHits)
        setPages(result.nbPages)
      } catch (error) {
        setProducts([])
        setFacets({})
        setCount(0)
        setPages(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [locale, filters, query, page, currency_code, sort])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const mediaQuery = window.matchMedia("(min-width: 768px)")
    const minScrollDelta = 8
    const minimumScrollBeforeHide = 120

    const handleScroll = () => {
      if (!mediaQuery.matches || isHoveringSidebar) {
        return
      }

      const currentY = window.scrollY
      const delta = currentY - lastScrollY.current

      if (Math.abs(delta) < minScrollDelta) {
        return
      }

      if (delta > 0 && currentY > minimumScrollBeforeHide) {
        setIsSidebarVisible(false)
      } else if (delta < 0) {
        setIsSidebarVisible(true)
      }

      lastScrollY.current = currentY
    }

    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        setIsSidebarVisible(true)
      }
      lastScrollY.current = window.scrollY
    }

    lastScrollY.current = window.scrollY
    window.addEventListener("scroll", handleScroll, { passive: true })
    mediaQuery.addEventListener("change", handleViewportChange)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      mediaQuery.removeEventListener("change", handleViewportChange)
    }
  }, [isHoveringSidebar])

  const handleSidebarMouseEnter = () => {
    if (sidebarHideTimeout.current) {
      clearTimeout(sidebarHideTimeout.current)
      sidebarHideTimeout.current = null
    }
    setIsHoveringSidebar(true)
    setIsSidebarVisible(true)
  }

  const handleSidebarMouseLeave = () => {
    setIsHoveringSidebar(false)
    sidebarHideTimeout.current = setTimeout(() => {
      setIsSidebarVisible(false)
    }, 400)
  }

  const handleEdgeMouseEnter = () => {
    if (sidebarHideTimeout.current) {
      clearTimeout(sidebarHideTimeout.current)
      sidebarHideTimeout.current = null
    }
    setIsSidebarVisible(true)
  }

  const handleSortChange = (next: ListingSort) => {
    const params = new URLSearchParams(searchParams.toString())
    if (next === "relevance") {
      params.delete("sort")
    } else {
      params.set("sort", next)
    }
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  if (isLoading && products.length === 0) return <ProductListingSkeleton />

  return (
    <div className="min-h-[70vh] flex flex-col">
      <div className="flex justify-between w-full items-center shrink-0">
        <div className="my-4 label-md">{`${products.length ? count : DEMO_STORE_PRODUCTS.length} listings`}</div>
        <div className="hidden md:flex items-center gap-2">
          <label htmlFor="product-listing-sort" className="label-sm uppercase text-secondary">
            Sort by
          </label>
          <select
            id="product-listing-sort"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as ListingSort)}
            className="label-sm uppercase min-w-[10rem] rounded-sm border border-secondary bg-primary px-3 py-2 text-primary hover:bg-secondary/10 transition-colors"
            data-testid="product-listing-sort"
          >
            <option value="relevance">Relevance</option>
            <option value="title_asc">Title (A–Z)</option>
            <option value="title_desc">Title (Z–A)</option>
            <option value="price_asc">Price (low to high)</option>
            <option value="price_desc">Price (high to low)</option>
          </select>
        </div>
      </div>
      <div className="hidden md:block shrink-0">
        <ProductListingActiveFilters />
      </div>
      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0 relative">
        {/* Left-edge hover trigger (desktop only) */}
        {!isSidebarVisible && (
          <div
            className="hidden md:block fixed left-0 top-0 w-4 h-full z-30"
            onMouseEnter={handleEdgeMouseEnter}
            data-testid="sidebar-hover-trigger"
          />
        )}
        <div
          className={`w-full flex-shrink-0 overflow-hidden transition-all duration-300 ${
            isSidebarVisible
              ? "md:w-[280px] md:opacity-100"
              : "md:w-0 md:opacity-0 md:pointer-events-none"
          }`}
          onMouseEnter={handleSidebarMouseEnter}
          onMouseLeave={handleSidebarMouseLeave}
        >
          <SearchProductSidebar facets={Object.keys(facets).length ? facets : (getDemoFacets() as any)} />
        </div>
        <div className="w-full flex flex-col flex-1 min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            {isLoading && (
              <div className="flex-1 min-h-0">
                <ProductListingLoadingView />
              </div>
            )}

            {!isLoading && (
              <div className="flex-1 min-h-0">
                <ProductListingProductsView products={ensureAtLeastOneStoreProduct(products)} />
              </div>
            )}
          </div>

          <div className="shrink-0 mt-auto pt-4">
            <ProductsPagination pages={products.length ? pages : 1} />
          </div>
        </div>
      </div>
    </div>
  )
}
