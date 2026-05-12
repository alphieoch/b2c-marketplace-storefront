"use client"

import { useState } from "react"

import { Button } from "@/components/atoms"

type OrderConfirmReceiptProps = {
  order: {
    id: string
    metadata?: Record<string, unknown> | null
  }
}

export const OrderConfirmReceipt = ({ order }: OrderConfirmReceiptProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReleased, setIsReleased] = useState(Boolean(order.metadata?.buyer_released_at))
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/store/orders/${order.id}/confirm-receipt`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accepted_terms: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Unable to release payment right now. Please retry.")
      }

      setIsReleased(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to release payment."
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="md:flex justify-between items-center gap-4">
      <div className="mb-4 md:mb-0">
        <h2 className="text-primary label-lg uppercase">Confirm handover</h2>
        <p className="text-secondary label-md max-w-sm">
          Release payment to the seller once livestock or equipment has been handed over in good condition.
        </p>
        {isReleased && (
          <p className="text-success label-sm mt-2 uppercase">
            Payment released
          </p>
        )}
        {error && (
          <p className="text-error label-sm mt-2">{error}</p>
        )}
      </div>
      <Button
        variant="tonal"
        className="uppercase"
        disabled={isSubmitting || isReleased}
        onClick={handleConfirm}
      >
        {isReleased ? "Released" : isSubmitting ? "Releasing..." : "Release payment"}
      </Button>
    </div>
  )
}
