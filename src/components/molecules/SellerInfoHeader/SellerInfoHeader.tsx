import { StarRating } from "@/components/atoms"
import { SellerAvatar } from "@/components/cells/SellerAvatar/SellerAvatar"
import { CollapseIcon } from "@/icons"
import clsx from "clsx"

export const SellerInfoHeader = ({
  photo,
  name,
  rating,
  reviewCount,
  showArrow,
  bottomBorder = false,
}: {
  photo: string
  name: string
  rating: number
  reviewCount: number
  showArrow: boolean
  bottomBorder?: boolean
}) => (
  <div
    className={clsx(
      "flex gap-3 w-full p-4 sm:p-5 items-center min-w-0",
      bottomBorder && "border-b"
    )}
  >
    <div className="rounded-sm shrink-0">
      <SellerAvatar photo={photo} size={56} alt={name} />
    </div>
    <div className="flex flex-col gap-1 min-w-0 flex-1">
      <h3 className="heading-sm text-primary truncate">{name}</h3>
      <div className="flex items-center gap-2 flex-wrap">
        <StarRating starSize={14} rate={rating || 0} />
        <span className="label-md text-secondary">{reviewCount} reviews</span>
      </div>
    </div>
    {showArrow && <CollapseIcon className="ml-auto shrink-0 -rotate-90" />}
  </div>
)
