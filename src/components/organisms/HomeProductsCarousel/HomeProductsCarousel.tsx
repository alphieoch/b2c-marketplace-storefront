import { listProducts } from "@/lib/data/products"
import { mapProductToCarouselRow } from "@/lib/helpers/map-products-for-carousel"
import { ProductCarousel } from "@/components/ui/product-carousel"
import { Product } from "@/types/product"
import type { HttpTypes } from "@medusajs/types"
import { ensureAtLeastOneProduct } from "@/lib/data/demo-product"

export const HomeProductsCarousel = async ({
  locale,
  sellerProducts,
  home,
  title,
  viewAllHref = "/products",
}: {
  locale: string
  sellerProducts: Product[]
  home: boolean
  title: string
  viewAllHref?: string
}) => {
  const {
    response: { products },
  } = await listProducts({
    countryCode: locale,
    queryParams: {
      limit: home ? 4 : undefined,
      order: "created_at",
      handle: home
        ? undefined
        : sellerProducts.map((product) => product.handle),
    },
    forceCache: !home,
  })

  const source: (HttpTypes.StoreProduct | Product)[] = sellerProducts.length
    ? sellerProducts
    : products

  const carouselProducts = ensureAtLeastOneProduct(
    source.map(mapProductToCarouselRow)
  )

  return (
    <div className="flex justify-center w-full">
      <ProductCarousel
        title={title}
        products={carouselProducts}
        viewAllHref={viewAllHref}
        className="py-0"
      />
    </div>
  )
}
