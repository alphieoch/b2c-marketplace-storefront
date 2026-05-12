import { SellerStoreHours } from "@/components/molecules"
import { SellerFooter, SellerHeading } from "@/components/organisms"
import { HttpTypes } from "@medusajs/types"

export const SellerPageHeader = ({
  header = false,
  seller,
  user,
}: {
  header?: boolean
  seller: any
  user: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="rounded-sm border border-neutral-200 dark:border-neutral-800">
      <SellerHeading header seller={seller} user={user} />
      <SellerStoreHours seller={seller} />
      <SellerFooter seller={seller} />
    </div>
  )
}
