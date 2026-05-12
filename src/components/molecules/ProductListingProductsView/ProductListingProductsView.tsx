import { HttpTypes } from "@medusajs/types"
import { ProductCard } from "@/components/organisms"

interface Props {
  products: HttpTypes.StoreProduct[]
}

const ProductListingProductsView = ({ products }: Props) => (
  <div className="w-full">
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(
        (product) =>
           (
            <li key={product.id} className="w-full min-w-0">
              <ProductCard
                product={product}
                className="w-full h-full min-w-0"
              />
            </li>
          )
      )}
    </ul>
  </div>
)

export default ProductListingProductsView
