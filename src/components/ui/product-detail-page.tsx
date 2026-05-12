"use client"

import * as React from "react"
import Image from "next/image"
import {
  ChevronRight,
  Share2,
  ShoppingCart,
  Send,
  Camera,
  Star,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { HttpTypes } from "@medusajs/types"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProductVariants } from "@/components/molecules"
import { WishlistButton } from "@/components/cells/WishlistButton/WishlistButton"
import { Chat } from "@/components/organisms/Chat/Chat"
import { ProductPageDetails } from "@/components/cells"
import { useCartContext } from "@/components/providers"
import useGetAllSearchParams from "@/hooks/useGetAllSearchParams"
import { getProductPrice } from "@/lib/helpers/get-product-price"
import { toast } from "@/lib/helpers/toast"
import posthog from "posthog-js"
import { SellerProps } from "@/types/seller"
import { Wishlist } from "@/types/wishlist"
import { AdditionalAttributeProps } from "@/types/product"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

interface BreadcrumbItem {
  label: string
  href: string
}

interface ProductDetailPageProps {
  product: HttpTypes.StoreProduct & {
    seller?: SellerProps
    attribute_values?: AdditionalAttributeProps[]
  }
  locale: string
  user: HttpTypes.StoreCustomer | null
  wishlist: Wishlist
  breadcrumbs?: BreadcrumbItem[]
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce(
    (
      acc: Record<string, string>,
      varopt: HttpTypes.StoreProductOptionValue
    ) => {
      acc[varopt.option?.title.toLowerCase() || ""] = varopt.value
      return acc
    },
    {}
  )
}

const StarRating = ({
  rating,
  className,
}: {
  rating: number
  className?: string
}) => (
  <div className={cn("flex items-center gap-0.5", className)}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-secondary/50"
        )}
      />
    ))}
    <span className="ml-2 text-sm font-medium text-secondary">
      {rating.toFixed(1)}
    </span>
  </div>
)

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  locale,
  user,
  wishlist,
  breadcrumbs,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const { addToCart, onAddToCart, cart, isAddingItem } = useCartContext()
  const { allSearchParams } = useGetAllSearchParams()

  const images = product.images || []

  const { cheapestVariant, cheapestPrice } = getProductPrice({
    product,
  })

  const hasAnyPrice = cheapestPrice !== null && cheapestVariant !== null

  const selectedVariant = hasAnyPrice
    ? {
        ...optionsAsKeymap(cheapestVariant.options ?? null),
        ...allSearchParams,
      }
    : allSearchParams

  const variantId =
    product.variants?.find(({ options }: { options: any }) =>
      options?.every((option: any) =>
        selectedVariant[option.option?.title.toLowerCase() || ""]?.includes(
          option.value
        )
      )
    )?.id || ""

  const { variantPrice } = getProductPrice({
    product,
    variantId,
  })

  const variantStock =
    (product.variants?.find((v: any) => v.id === variantId) as any)
      ?.inventory_quantity || 0

  const variantHasPrice = !!(
    product.variants?.find((v: any) => v.id === variantId) as any
  )?.calculated_price

  const isVariantStockMaxLimitReached =
    ((cart as any)?.items?.find((item: any) => item.variant_id === variantId)
      ?.quantity ?? 0) >= variantStock

  const handleAddToCart = async () => {
    if (!variantId || !hasAnyPrice || isVariantStockMaxLimitReached) return

    const subtotal = +(variantPrice?.calculated_price_without_tax_number || 0)
    const total = +(variantPrice?.calculated_price_number || 0)

    const storeCartLineItem = {
      thumbnail: product.thumbnail || "",
      product_title: product.title,
      quantity: 1,
      subtotal,
      total,
      tax_total: total - subtotal,
      variant_id: variantId,
      product_id: product.id,
      variant: product.variants?.find((v: any) => v.id === variantId),
    }

    onAddToCart(storeCartLineItem, variantPrice?.currency_code || "eur")

    try {
      await addToCart({
        variantId: variantId,
        quantity: 1,
        countryCode: locale,
      })
      posthog.capture("product_added_to_cart", {
        product_id: product.id,
        product_title: product.title,
        variant_id: variantId,
        price: +(variantPrice?.calculated_price_number || 0),
        currency: variantPrice?.currency_code || "eur",
        seller_id: product.seller?.id,
      })
    } catch (error) {
      posthog.captureException(error)
      toast.error({
        title: "Error adding to cart",
        description: "Some variant does not have the required inventory",
      })
    }
  }

  const isAddToCartDisabled =
    !variantStock || !variantHasPrice || !hasAnyPrice || isVariantStockMaxLimitReached

  const seller = product.seller
  const reviewCount =
    seller?.reviews?.filter((rev: any) => rev !== null).length || 0
  const sellerRating =
    reviewCount > 0
      ? seller!.reviews!
          .filter((rev: any) => rev !== null)
          .reduce((sum: number, r: any) => sum + (r?.rating || 0), 0) /
        reviewCount
      : 0

  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/categories" },
    { label: product.title || "Product", href: `#` },
  ]

  const crumbItems = breadcrumbs || defaultBreadcrumbs

  return (
    <div className="w-full mx-auto p-4 md:p-8 bg-primary text-primary">
      {/* Breadcrumbs Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center text-sm text-secondary mb-4"
      >
        {crumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <LocalizedClientLink
              href={item.href}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </LocalizedClientLink>
            {index < crumbItems.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-1" />
            )}
          </React.Fragment>
        ))}
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div />
        <div className="flex items-center gap-2">
          {user && (
            <WishlistButton
              productId={product.id}
              wishlist={wishlist}
              user={user}
            />
          )}
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </div>

      {/* Main content grid */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Image Gallery Section */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square md:aspect-[4/5] w-full overflow-hidden rounded-xl border max-h-[50vh] md:max-h-none"
            >
              {images.length > 0 ? (
                <Image
                  src={images[currentImageIndex]?.url || product.thumbnail || ""}
                  alt={`${product.title} image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority={currentImageIndex === 0}
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <Camera className="h-12 w-12 text-secondary" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {images.map((_img: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    currentImageIndex === index
                      ? "bg-action"
                      : "bg-secondary hover:bg-secondary/70"
                  )}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Camera className="h-4 w-4" /> Find Similar
            </Button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {product.title}
          </h1>
          <div className="mt-2">
            {hasAnyPrice && variantPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold">
                  {variantPrice.calculated_price}
                </span>
                {variantPrice.calculated_price_number !==
                  variantPrice.original_price_number && (
                  <span className="text-sm text-secondary line-through">
                    {variantPrice.original_price}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-lg text-secondary">
                Not available in your region
              </span>
            )}
          </div>

          {/* Variants */}
          {hasAnyPrice && product.options && product.options.length > 0 && (
            <div className="mt-4">
              <ProductVariants
                product={product}
                selectedVariant={selectedVariant}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 my-6">
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handleAddToCart}
              disabled={isAddToCartDisabled}
            >
              <ShoppingCart className="h-5 w-5" />
              {isAddingItem
                ? "Adding..."
                : !hasAnyPrice
                ? "Not Available"
                : variantStock && variantHasPrice
                ? "Add to Cart"
                : "Out of Stock"}
            </Button>
            {user && seller && (
              <Chat
                user={user}
                seller={seller}
                buttonClassNames="flex-1 gap-2"
                product={product}
              />
            )}
            {!user && seller && (
              <LocalizedClientLink href="/login" className="flex-1">
                <Button size="lg" variant="outline" className="w-full gap-2">
                  <Send className="h-5 w-5" /> Contact Seller
                </Button>
              </LocalizedClientLink>
            )}
          </div>

          {/* Tags/Badges */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag: any, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm font-normal py-1 px-3 gap-2"
                >
                  {tag.value}
                </Badge>
              ))}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p className="text-secondary leading-relaxed">
              {product.description.replace(/<[^>]*>/g, "").substring(0, 300)}
              {product.description.replace(/<[^>]*>/g, "").length > 300 && (
                <span className="text-primary font-medium ml-2">
                  ...
                </span>
              )}
            </p>
          )}

          {/* Seller Information */}
          {seller && (
            <div className="mt-8 pt-6 border-t">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={seller.photo || "/images/product/seller-avatar.jpg"}
                      alt={seller.name}
                    />
                    <AvatarFallback>
                      {seller.name?.charAt(0) || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{seller.name}</p>
                    {sellerRating > 0 && (
                      <StarRating rating={sellerRating} />
                    )}
                  </div>
                </div>
                <LocalizedClientLink href={`/sellers/${seller.handle}`}>
                  <Button variant="link" className="text-action">
                    All listings &rarr;
                  </Button>
                </LocalizedClientLink>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Additional Sections */}
      <div className="mt-12 space-y-4">
        <ProductPageDetails details={product?.description || ""} />
      </div>
    </div>
  )
}
