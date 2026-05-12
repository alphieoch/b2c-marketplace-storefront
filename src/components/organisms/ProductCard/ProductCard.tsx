"use client"

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import posthog from "posthog-js"
import { HttpTypes } from "@medusajs/types"

import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { useCartContext } from "@/components/providers"
import { Drawer, DrawerClose, DrawerPopup } from "@/components/ui/bottom-sheet"
import { getProductPrice } from "@/lib/helpers/get-product-price"
import { toast } from "@/lib/helpers/toast"
import { cn } from "@/lib/utils"
import { Product } from "@/types/product"

type QuickAddIntent = "add" | "buy"

export const ProductCard = ({
  product,
  className,
}: {
  product: HttpTypes.StoreProduct | Product
  className?: string
}) => {
  const params = useParams()
  const router = useRouter()
  const locale = String(params?.locale ?? "en")
  const { addToCart, onAddToCart, cart, isAddingItem } = useCartContext()

  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [quickAddIntent, setQuickAddIntent] = useState<QuickAddIntent>("add")
  const [quantity, setQuantity] = useState(1)

  const p = product as HttpTypes.StoreProduct

  const derived = useMemo(() => {
    if (!p?.id) {
      return null
    }
    try {
      const { cheapestVariant, cheapestPrice } = getProductPrice({ product: p })
      const hasAnyPrice = Boolean(cheapestPrice && cheapestVariant)
      const variantId = cheapestVariant?.id ?? ""
      const { variantPrice } = getProductPrice({
        product: p,
        variantId: variantId || undefined,
      })
      const variant = p.variants?.find((v) => v.id === variantId) as
        | { inventory_quantity?: number; calculated_price?: unknown }
        | undefined
      const variantStock = variant?.inventory_quantity ?? 0
      const variantHasPrice = Boolean(variant?.calculated_price)
      return {
        cheapestVariant,
        cheapestPrice,
        hasAnyPrice,
        variantId,
        variantPrice,
        variantStock,
        variantHasPrice,
      }
    } catch {
      return null
    }
  }, [p])

  const cheapestVariant = derived?.cheapestVariant ?? null
  const cheapestPrice = derived?.cheapestPrice ?? null
  const hasAnyPrice = derived?.hasAnyPrice ?? false
  const variantId = derived?.variantId ?? ""
  const variantPrice = derived?.variantPrice ?? null
  const variantStock = derived?.variantStock ?? 0
  const variantHasPrice = derived?.variantHasPrice ?? false

  const cartLineQty =
    (cart as { items?: { variant_id?: string; quantity?: number }[] })?.items?.find(
      (item) => item.variant_id === variantId
    )?.quantity ?? 0

  const maxSelectable = Math.max(0, variantStock - cartLineQty)
  const isVariantStockMaxLimitReached = cartLineQty >= variantStock && variantStock > 0

  const canQuickAdd =
    Boolean(variantId) && hasAnyPrice && variantHasPrice && variantStock > 0 && !isVariantStockMaxLimitReached

  const productName = String(product?.title || "Product")

  const clampQty = useCallback(
    (n: number) => {
      const max = Math.max(1, Math.min(maxSelectable || variantStock, 99))
      return Math.min(Math.max(1, n), max)
    },
    [maxSelectable, variantStock]
  )

  const maxForStepper = useMemo(
    () => Math.max(1, Math.min(maxSelectable || variantStock, 99)),
    [maxSelectable, variantStock]
  )

  const openQuickAdd = useCallback((intent: QuickAddIntent) => {
    setQuickAddIntent(intent)
    setQuantity(1)
    setQuickAddOpen(true)
  }, [])

  useEffect(() => {
    if (!quickAddOpen) return
    setQuantity((q) => clampQty(q))
  }, [quickAddOpen, maxForStepper, clampQty])

  const handleConfirmQuickAdd = async () => {
    if (!canQuickAdd || !variantId || !variantPrice) return

    const qty = clampQty(quantity)
    const unitSubtotal = +(variantPrice.calculated_price_without_tax_number || 0)
    const unitTotal = +(variantPrice.calculated_price_number || 0)
    const unitTax = unitTotal - unitSubtotal

    const variantInCart = (cart as { items?: { variant_id?: string }[] })?.items?.some(
      (item) => item.variant_id === variantId
    )

    const storeCartLineItem = {
      thumbnail: product.thumbnail || "",
      product_title: product.title,
      quantity: qty,
      subtotal: variantInCart ? unitSubtotal : unitSubtotal * qty,
      total: variantInCart ? unitTotal : unitTotal * qty,
      tax_total: variantInCart ? unitTax : unitTax * qty,
      variant_id: variantId,
      product_id: product.id,
      variant: p.variants?.find((v) => v.id === variantId),
    }

    onAddToCart(storeCartLineItem, variantPrice.currency_code || "eur")

    try {
      await addToCart({
        variantId,
        quantity: qty,
        countryCode: locale,
      })
      posthog.capture("product_added_to_cart", {
        product_id: product.id,
        product_title: product.title,
        variant_id: variantId,
        quantity: qty,
        source: "product_card_quick_add",
        intent: quickAddIntent,
      })
      setQuickAddOpen(false)
      if (quickAddIntent === "buy") {
        toast.success({
          title: "Added to your basket",
          description: "Opening your basket…",
        })
        router.push(`/${locale}/cart`)
      } else {
        toast.success({
          title: "Added to basket",
          description: `${qty} × ${productName}`,
        })
      }
    } catch (error) {
      posthog.captureException(error)
      toast.error({
        title: "Could not add to basket",
        description: "Check stock and try again.",
      })
    }
  }

  if (!product || !derived) {
    return null
  }

  return (
    <div
      className={cn(
        "relative group border rounded-sm flex flex-col justify-between p-1 w-full h-full min-w-0",
        className
      )}
      data-testid="product-card"
      data-product-handle={product.handle}
    >
      <div className="relative w-full h-full bg-primary aspect-square" data-testid="product-card-image-container">
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          aria-label={`View ${productName}`}
          title={`View ${productName}`}
          data-testid="product-card-link"
        >
          <div className="overflow-hidden rounded-sm w-full h-full flex justify-center align-center ">
            {product.thumbnail ? (
              <Image
                priority
                fetchPriority="high"
                src={decodeURIComponent(product.thumbnail)}
                alt={`${productName} image`}
                width={100}
                height={100}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover aspect-square w-full object-center h-full lg:group-hover:-mt-14 transition-all duration-300 rounded-xs"
                data-testid="product-card-image"
              />
            ) : (
              <Image
                priority
                fetchPriority="high"
                src="/images/placeholder.svg"
                alt={`${productName} image placeholder`}
                width={100}
                height={100}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                data-testid="product-card-placeholder-image"
              />
            )}
          </div>
        </LocalizedClientLink>
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          aria-label={`See more about ${productName}`}
          title={`See more about ${productName}`}
        >
          <Button className="absolute rounded-sm bg-action text-action-on-primary h-auto lg:h-[48px] lg:group-hover:block hidden w-full uppercase bottom-1 z-10" data-testid="product-card-see-more-button">
            See More
          </Button>
        </LocalizedClientLink>
      </div>

      <LocalizedClientLink
        href={`/products/${product.handle}`}
        aria-label={`Go to ${productName} page`}
        title={`Go to ${productName} page`}
        className="block p-4 pb-2 lg:pb-4"
      >
        <div className="flex justify-between" data-testid="product-card-info">
          <div className="w-full min-w-0">
            <h3 className="heading-sm truncate" data-testid="product-card-title">
              {product.title}
            </h3>
            <div className="mt-2 space-y-0.5" data-testid="product-card-price">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="label-sm text-secondary">Farmer&apos;s Value:</span>
                <p className="font-medium text-primary" data-testid="product-card-current-price">
                  {cheapestPrice?.calculated_price}
                </p>
              </div>
              {cheapestPrice?.calculated_price !== cheapestPrice?.original_price && (
                <div className="flex items-center gap-2">
                  <span className="label-sm text-secondary">Market Value:</span>
                  <p className="label-sm text-secondary line-through" data-testid="product-card-original-price">
                    {cheapestPrice?.original_price}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </LocalizedClientLink>

      <div className="flex gap-2 px-4 pb-4 lg:hidden">
        <Button
          type="button"
          variant="tonal"
          className="flex-1 uppercase text-xs sm:text-sm"
          disabled={!canQuickAdd}
          onClick={() => openQuickAdd("add")}
          data-testid="product-card-mobile-add-to-basket"
        >
          Add to basket
        </Button>
        <Button
          type="button"
          className="flex-1 uppercase text-xs sm:text-sm"
          disabled={!canQuickAdd}
          onClick={() => openQuickAdd("buy")}
          data-testid="product-card-mobile-buy-now"
        >
          Buy now
        </Button>
      </div>

      <Drawer open={quickAddOpen} onOpenChange={setQuickAddOpen}>
        <DrawerPopup direction="bottom" showBar>
          <div className="border-b px-4 pb-3 pt-1">
            <h2 className="heading-sm pr-8">{productName}</h2>
            <p className="label-sm text-secondary mt-1">
              {quickAddIntent === "buy" ? "Choose quantity, then go to your basket." : "Choose how many to add."}
            </p>
          </div>
          <div className="flex flex-col gap-6 px-4 py-6">
            <div>
              <span className="label-sm uppercase text-secondary block mb-3" id="product-card-qty-label">
                Quantity
              </span>
              <div className="flex items-center justify-center gap-4">
                <Button
                  type="button"
                  variant="tonal"
                  className="min-w-[48px] px-0"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1 || isAddingItem}
                  onClick={() => setQuantity((q) => clampQty(q - 1))}
                  data-testid="product-card-qty-decrease"
                >
                  −
                </Button>
                <input
                  id="product-card-qty-input"
                  aria-labelledby="product-card-qty-label"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={maxForStepper}
                  className="w-16 rounded-sm border border-secondary bg-primary py-2 text-center text-primary label-md tabular-nums"
                  value={quantity}
                  onChange={(e) => {
                    const raw = parseInt(e.target.value, 10)
                    if (Number.isNaN(raw)) return
                    setQuantity(clampQty(raw))
                  }}
                  data-testid="product-card-qty-input"
                />
                <Button
                  type="button"
                  variant="tonal"
                  className="min-w-[48px] px-0"
                  aria-label="Increase quantity"
                  disabled={quantity >= maxForStepper || isAddingItem}
                  onClick={() => setQuantity((q) => clampQty(q + 1))}
                  data-testid="product-card-qty-increase"
                >
                  +
                </Button>
              </div>
              <p className="label-sm text-secondary text-center mt-2">
                {variantStock > 0 ? `${maxForStepper} available` : "Out of stock"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                loading={isAddingItem}
                disabled={!canQuickAdd || isAddingItem}
                onClick={handleConfirmQuickAdd}
                data-testid="product-card-quick-add-confirm"
              >
                {quickAddIntent === "buy" ? "Add & go to basket" : "Add to basket"}
              </Button>
              <DrawerClose asChild>
                <button
                  type="button"
                  className="label-md w-full rounded-sm px-4 py-2 text-primary hover:bg-secondary/10 transition-colors"
                  data-testid="product-card-quick-add-cancel"
                >
                  Cancel
                </button>
              </DrawerClose>
            </div>
          </div>
        </DrawerPopup>
      </Drawer>
    </div>
  )
}
