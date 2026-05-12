"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export interface Product {
  id: string | number
  name: string
  quantity: string
  priceLabel: string
  originalPriceLabel?: string
  discount?: string
  deliveryTime: string
  imageUrl: string
  productHref: string
}

interface ProductCardProps {
  product: Product
}

export interface ProductCarouselProps {
  title: string
  products: Product[]
  viewAllHref?: string
  className?: string
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div
      className="group relative w-48 flex-shrink-0"
      data-testid="product-carousel-card"
    >
      <div className="flex flex-col overflow-hidden rounded-xl border border-primary bg-component text-primary transition-all duration-300 hover:shadow-md">
        <div className="relative h-40 overflow-hidden bg-secondary">
          <LocalizedClientLink
            href={product.productHref}
            aria-label={`View ${product.name}`}
            className="absolute inset-0 block"
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 45vw, 192px"
              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          </LocalizedClientLink>
          {product.discount ? (
            <div className="absolute left-2 top-2 rounded-md bg-positive-secondary px-2 py-0.5 text-xs font-semibold text-primary">
              {product.discount}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col space-y-3 p-4">
          <div className="flex items-center space-x-2 text-xs text-secondary">
            <Clock className="h-4 w-4 shrink-0" aria-hidden />
            <span>{product.deliveryTime}</span>
          </div>
          <LocalizedClientLink
            href={product.productHref}
            className="block h-10"
            aria-label={product.name}
          >
            <h3 className="line-clamp-2 text-sm font-medium text-primary">
              {product.name}
            </h3>
          </LocalizedClientLink>
          <p className="text-xs text-secondary">{product.quantity}</p>

          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-col">
              <span className="text-base font-semibold text-primary">
                {product.priceLabel}
              </span>
              {product.originalPriceLabel ? (
                <span className="text-xs text-secondary line-through">
                  {product.originalPriceLabel}
                </span>
              ) : null}
            </div>
            <LocalizedClientLink
              href={product.productHref}
              className="shrink-0 rounded-lg border border-action bg-primary px-4 py-2 text-sm font-bold text-action transition-colors hover:bg-action hover:text-action-on-primary"
              data-testid="product-carousel-add-link"
            >
              ADD
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ProductCarousel = React.forwardRef<
  HTMLDivElement,
  ProductCarouselProps
>(({ title, products, viewAllHref = "/products", className }, ref) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [isScrollable, setIsScrollable] = React.useState(false)
  const [isAtStart, setIsAtStart] = React.useState(true)
  const [isAtEnd, setIsAtEnd] = React.useState(false)

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current
    if (!el) return
    const scrollAmount = el.clientWidth * 0.8
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  const checkScrollState = React.useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return

    const scrollable = el.scrollWidth > el.clientWidth
    setIsScrollable(scrollable)
    setIsAtStart(el.scrollLeft <= 0)
    setIsAtEnd(
      Math.abs(el.scrollWidth - el.scrollLeft - el.clientWidth) < 1
    )
  }, [])

  React.useEffect(() => {
    checkScrollState()
    const el = scrollContainerRef.current
    el?.addEventListener("scroll", checkScrollState)
    window.addEventListener("resize", checkScrollState)

    return () => {
      el?.removeEventListener("scroll", checkScrollState)
      window.removeEventListener("resize", checkScrollState)
    }
  }, [checkScrollState, products.length])

  return (
    <section
      className={cn("relative w-full space-y-4 py-8", className)}
      ref={ref}
      data-testid="product-strip-carousel"
    >
      <div className="flex items-center justify-between px-4 sm:px-6">
        <h2 className="heading-md font-bold text-primary">{title}</h2>
        <LocalizedClientLink
          href={viewAllHref}
          className="text-sm font-medium text-action transition-colors hover:text-action-hover"
        >
          see all
        </LocalizedClientLink>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex space-x-4 overflow-x-auto px-4 sm:px-6 pb-1"
        >
          {products.map((product) => (
            <ProductCard key={String(product.id)} product={product} />
          ))}
        </div>

        {isScrollable ? (
          <>
            <button
              type="button"
              onClick={() => handleScroll("left")}
              disabled={isAtStart}
              aria-label="Scroll left"
              className={cn(
                "absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-primary bg-component p-2 shadow-md transition-opacity duration-300 disabled:pointer-events-none disabled:opacity-0",
                "hover:bg-component-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
              data-testid="product-carousel-scroll-left"
            >
              <ChevronLeft className="h-6 w-6 text-primary" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              disabled={isAtEnd}
              aria-label="Scroll right"
              className={cn(
                "absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-primary bg-component p-2 shadow-md transition-opacity duration-300 disabled:pointer-events-none disabled:opacity-0",
                "hover:bg-component-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
              data-testid="product-carousel-scroll-right"
            >
              <ChevronRight className="h-6 w-6 text-primary" />
            </button>
          </>
        ) : null}
      </div>
    </section>
  )
})

ProductCarousel.displayName = "ProductCarousel"
