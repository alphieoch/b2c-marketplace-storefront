import { ProductDetailPage } from "@/components/ui/product-detail-page"
import { HomeProductSection } from "@/components/sections/HomeProductSection/HomeProductSection"
import {
  ProductAdditionalAttributes,
  ProductDetailsShipping,
  ProductDetailsFooter,
} from "@/components/cells"
import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@/lib/data/products"
import { retrieveCustomer } from "@/lib/data/customer"
import { getUserWishlists } from "@/lib/data/wishlist"
import { generateProductMetadata } from "@/lib/helpers/seo"
import NotFound from "@/app/not-found"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string; locale: string }>
}): Promise<Metadata> {
  const { handle, locale } = await params

  const prod = await listProducts({
    countryCode: locale,
    queryParams: { handle: [handle], limit: 1 },
    forceCache: true,
  }).then(({ response }) => response.products[0])

  return generateProductMetadata(prod)
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string; locale: string }>
}) {
  const { handle, locale } = await params

  const prod = await listProducts({
    countryCode: locale,
    queryParams: { handle: [handle], limit: 1 },
    forceCache: true,
  }).then(({ response }) => response.products[0])

  if (!prod) return null

  if (prod.seller?.store_status === "SUSPENDED") {
    return NotFound()
  }

  const user = await retrieveCustomer().catch(() => null)

  let wishlist: { products: HttpTypes.StoreProduct[] } = { products: [] }
  if (user) {
    wishlist = await getUserWishlists({ countryCode: locale })
  }

  return (
    <main className="container">
      <ProductDetailPage
        product={prod}
        locale={locale}
        user={user}
        wishlist={wishlist}
      />
      <div className="mt-8 space-y-4">
        <ProductAdditionalAttributes
          attributes={prod?.attribute_values || []}
        />
        <ProductDetailsShipping />
        <ProductDetailsFooter
          tags={prod?.tags || []}
          posted={prod?.created_at}
        />
      </div>
      <div className="my-8">
        <HomeProductSection
          heading="More from this seller"
          products={prod.seller?.products}
          locale={locale}
        />
      </div>
    </main>
  )
}
