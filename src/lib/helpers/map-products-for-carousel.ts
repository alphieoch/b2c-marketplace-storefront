import type { HttpTypes } from "@medusajs/types"
import type { Product as LegacyProduct } from "@/types/product"
import type { Product as CarouselProduct } from "@/components/ui/product-carousel"
import { getProductPrice } from "@/lib/helpers/get-product-price"
import { getPercentageDiff } from "@/lib/helpers/get-precentage-diff"
import { convertToLocale } from "@/lib/helpers/money"

function isStoreProduct(
  p: HttpTypes.StoreProduct | LegacyProduct
): p is HttpTypes.StoreProduct {
  return typeof p.id === "string"
}

export function mapProductToCarouselRow(
  product: HttpTypes.StoreProduct | LegacyProduct
): CarouselProduct {
  if (isStoreProduct(product)) {
    const { cheapestPrice } = getProductPrice({ product })
    const variant = product.variants?.[0]
    const qtyLabel =
      variant?.title ||
      (product as { subtitle?: string }).subtitle ||
      "1 unit"

    const discount =
      cheapestPrice?.percentage_diff &&
      Number(cheapestPrice.percentage_diff) > 0
        ? `${cheapestPrice.percentage_diff}% OFF`
        : undefined

    const thumb = product.thumbnail
      ? decodeURIComponent(product.thumbnail)
      : "/images/placeholder.svg"

    const originalLabel =
      cheapestPrice?.original_price &&
      cheapestPrice.original_price !== cheapestPrice.calculated_price
        ? cheapestPrice.original_price
        : undefined

    return {
      id: product.id,
      name: product.title ?? "Product",
      quantity: qtyLabel,
      priceLabel: cheapestPrice?.calculated_price ?? "—",
      originalPriceLabel: originalLabel,
      discount,
      deliveryTime: "In stock",
      imageUrl: thumb,
      productHref: `/products/${product.handle}`,
    }
  }

  const p = product as LegacyProduct
  const currency = "usd"
  const priceLabel = convertToLocale({
    amount: p.price,
    currency_code: currency,
  })
  const originalLabel =
    p.originalPrice && p.originalPrice !== p.price
      ? convertToLocale({
          amount: p.originalPrice,
          currency_code: currency,
        })
      : undefined
  const pct =
    p.originalPrice && p.originalPrice > p.price
      ? getPercentageDiff(p.originalPrice, p.price)
      : null
  const discount =
    pct && Number(pct) > 0 ? `${pct}% OFF` : undefined

  return {
    id: p.id,
    name: p.title,
    quantity: p.size || "—",
    priceLabel,
    originalPriceLabel: originalLabel,
    discount,
    deliveryTime: "In stock",
    imageUrl: p.thumbnail
      ? decodeURIComponent(p.thumbnail)
      : "/images/placeholder.svg",
    productHref: `/products/${p.handle}`,
  }
}
