"use client"

import { HttpTypes } from "@medusajs/types"
import { usePathname } from "next/navigation"

import { NavbarSearch } from "@/components/molecules"
import { ParentCategoryLinks } from "@/components/molecules/ParentCategoryLinks/ParentCategoryLinks"
import { FarmerNavLinks } from "@/components/molecules/FarmerNavLinks/FarmerNavLinks"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { farmerNav } from "@/data/farmer-nav"
import { cn } from "@/lib/utils"

interface NavbarProps {
  categories: HttpTypes.StoreProductCategory[]
  parentCategories: HttpTypes.StoreProductCategory[]
}

export const Navbar = ({ categories, parentCategories }: NavbarProps) => {
  const pathname = usePathname()
  const isAllProductsPage = pathname?.endsWith("/categories")
  const isStoresPage = pathname?.endsWith("/stores")

  return (
    <div className="flex flex-col lg:flex-row border-t border-b py-3 justify-between px-4 md:px-5 lg:px-8 gap-4 md:gap-0" data-testid="navbar">
      {/* Desktop navigation */}
      <div className="hidden lg:flex items-center w-full gap-6 relative">
        {/* Left: Parent categories */}
        <div className="flex items-center gap-2 xl:gap-4 overflow-x-auto scrollbar-hide flex-1 min-w-0 justify-start">
          <ParentCategoryLinks parentCategories={parentCategories} categories={categories} />
        </div>

        {/* Center: All Products & Stores */}
        <div className="flex items-center gap-2 xl:gap-4 flex-shrink-0">
          {isAllProductsPage ? (
            <span className="label-md uppercase px-2 text-primary" data-testid="category-label-all-products">
              All Products
            </span>
          ) : (
            <LocalizedClientLink
              href="/categories"
              className="label-md uppercase px-2 text-primary"
              data-testid="category-link-all-products"
            >
              All Products
            </LocalizedClientLink>
          )}

          <LocalizedClientLink
            href="/stores"
            className={cn(
              "label-md uppercase px-2 text-primary",
              isStoresPage && "border-b border-primary"
            )}
            data-testid="category-link-stores"
          >
            Stores
          </LocalizedClientLink>
        </div>

        {/* Right: Farmer links */}
        <div className="flex items-center gap-2 xl:gap-4 overflow-x-auto scrollbar-hide flex-1 min-w-0 justify-end">
          <FarmerNavLinks items={farmerNav} align="end" />
        </div>
      </div>

      {/* Mobile search */}
      <div className="lg:hidden w-full flex justify-center" data-testid="navbar-search-mobile">
        <NavbarSearch className="max-w-[296px] w-full" />
      </div>
    </div>
  )
}
