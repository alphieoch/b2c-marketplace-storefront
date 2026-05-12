"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/atoms"
import { CloseIcon, StorefrontIcon, BuildingIcon } from "@/icons"

const DISMISSAL_KEY = "vendor-business-cta-dismissed"

export const VendorBusinessCTA = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSAL_KEY)
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    localStorage.setItem(DISMISSAL_KEY, "true")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {isExpanded && (
        <div className="bg-white dark:bg-pale-800 border border-neutral-border rounded-lg shadow-lg p-4 w-64 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="heading-sm text-primary">Join our marketplace</h3>
            <button
              onClick={handleDismiss}
              className="text-neutral-secondary hover:text-primary transition-colors"
              aria-label="Dismiss"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <Link href={`${process.env.NEXT_PUBLIC_VENDOR_URL || "https://vendor.mercurjs.com"}/register`} target="_blank" rel="noopener noreferrer">
              <Button
                variant="filled"
                className="w-full flex items-center justify-center gap-2"
                size="small"
              >
                <StorefrontIcon className="w-4 h-4" />
                Become a Vendor
              </Button>
            </Link>

            <Link href="/register?type=business">
              <Button
                variant="tonal"
                className="w-full flex items-center justify-center gap-2"
                size="small"
              >
                <BuildingIcon className="w-4 h-4" />
                Business Buyer
              </Button>
            </Link>
          </div>
        </div>
      )}

      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-action text-action-on-primary hover:bg-action-hover rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105"
          aria-label="Join our marketplace"
        >
          <StorefrontIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}
