"use client"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { cn } from "@/lib/utils"
import { Button } from "@/components/atoms"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import { getActiveParentHandle } from "@/lib/helpers/category-utils"

export const HeaderCategoryNavbar = ({
  parentCategories,
  categories,
  onClose,
  layout = "horizontal",
}: {
  parentCategories: HttpTypes.StoreProductCategory[]
  categories: HttpTypes.StoreProductCategory[]
  onClose?: (state: boolean) => void
  layout?: "horizontal" | "vertical"
}) => {
  const { category } = useParams<{ category?: string }>()

  const activeParentHandle = useMemo(
    () => getActiveParentHandle(category, categories, parentCategories),
    [category, categories, parentCategories]
  )

  const isVertical = layout === "vertical"

  return (
    <nav
      className={cn(
        "flex scrollbar-hide",
        isVertical
          ? "flex-col gap-1 p-4"
          : "items-center p-4 gap-2 overflow-x-auto"
      )}
      aria-label="Parent categories"
    >
      {parentCategories?.map(({ id, handle, name }) => {
        const isActive = handle === activeParentHandle
        return (
          <LocalizedClientLink
            key={id}
            href={`/categories/${handle}`}
            onClick={() => (onClose ? onClose(false) : null)}
            className={cn(
              "uppercase text-primary transition-colors",
              isVertical
                ? "label-md px-4 py-3 hover:bg-secondary/10 whitespace-normal flex-shrink-0"
                : "label-large hover:opacity-80 transition-opacity py-2 font-semibold whitespace-nowrap flex-shrink-0 px-4 lg:px-8",
              isActive && (isVertical
                ? "border-l-2 border-primary bg-secondary/5"
                : "border-b border-primary"
              )
            )}
          >
            {name}
          </LocalizedClientLink>
        )
      })}
    </nav>
  )
}
