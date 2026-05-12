import { OrderCancel } from "@/components/cells/OrderCancel/OrderCancel"
import { OrderConfirmReceipt } from "@/components/cells/OrderConfirmReceipt/OrderConfirmReceipt"
import { OrderReturn } from "@/components/cells/OrderReturn/OrderReturn"
import { OrderTrack } from "@/components/cells/OrderTrack/OrderTrack"

export const OrderParcelActions = ({ order }: { order: any }) => {
  // if (order.status === "pending") return <OrderCancel order={order} />
  if (
    order.fulfillment_status === "delivered" &&
    !order.metadata?.buyer_released_at
  ) {
    return <OrderConfirmReceipt order={order} />
  }

  if (order.fulfillment_status === "delivered")
    return <OrderReturn order={order} />

  if (order.fulfillment_status === "shipped")
    return <OrderTrack order={order} />

  return null
}
