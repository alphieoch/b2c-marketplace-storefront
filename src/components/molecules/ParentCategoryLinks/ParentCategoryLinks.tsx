"use client"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import { getActiveParentHandle } from "@/lib/helpers/category-utils"

const STORE_PARENT_HANDLES = new Set([
  "produce",
  "dairy-eggs",
  "meat-poultry",
  "pantry",
  "plants-seeds",
])

interface ParentCategoryLinksProps {
  parentCategories: HttpTypes.StoreProductCategory[]
  categories: HttpTypes.StoreProductCategory[]
}

export const ParentCategoryLinks = ({
  parentCategories,
  categories,
}: ParentCategoryLinksProps) => {
  const { category } = useParams<{ category?: string }>()

  const activeParentHandle = useMemo(
    () => getActiveParentHandle(category, categories, parentCategories),
    [category, categories, parentCategories]
  )
  const storefrontParentCategories = useMemo(
    () =>
      parentCategories.filter((category) =>
        STORE_PARENT_HANDLES.has(category.handle)
      ),
    [parentCategories]
  )

  return (
    <nav
      className="hidden lg:flex flex-1 w-full min-w-0 max-w-full flex-nowrap items-center gap-2 xl:gap-4 overflow-x-auto overflow-y-visible scrollbar-hide pr-3"
      aria-label="Parent categories"
    >
      {storefrontParentCategories.map(({ id, handle, name }) => {
        const isActive = handle === activeParentHandle

        return (
          <LocalizedClientLink
            key={id}
            href={`/categories/${handle}`}
            className={cn(
              "label-large uppercase text-primary hover:opacity-80 transition-opacity pb-2 font-semibold whitespace-nowrap shrink-0",
              isActive && "border-b border-primary"
            )}
          >
            {name}
          </LocalizedClientLink>
        )
      })}
    </nav>
  )
}
