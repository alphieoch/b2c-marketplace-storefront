import { SellerInfo } from "@/components/molecules"
import { SellerProps } from "@/types/seller"
import { Chat } from "../Chat/Chat"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"

export const SellerHeading = ({
  seller,
  user,
  header,
}: {
  header: boolean
  seller: SellerProps
  user: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="min-w-0 flex-1">
          <SellerInfo header={header} seller={seller} />
        </div>
        {user && (
          <div className="flex gap-2 px-4 pb-4 pt-0 md:mt-0 md:p-5 md:ml-auto">
            <Chat
              user={user}
              seller={seller}
              buttonClassNames="uppercase h-10 w-full md:w-auto"
              variant="filled"
              buttonSize="small"
            />
          </div>
        )}
      </div>
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <p
          dangerouslySetInnerHTML={{
            __html: seller.description || "",
          }}
          className="label-md break-words"
        />
      </div>
    </div>
  )
}
