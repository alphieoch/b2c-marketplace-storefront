"use client"

import { HttpTypes } from "@medusajs/types"
import { useState, useCallback } from "react"

import { LogoutButton } from "@/components/atoms"
import { HeaderCategoryNavbar } from "@/components/molecules"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { HamburgerMenuIcon, CollapseIcon, ProfileIcon } from "@/icons"
import { farmerNav } from "@/data/farmer-nav"
import { storeQuickNavItems } from "@/data/store-quick-nav"
import { cn } from "@/lib/utils"
import {
  Drawer,
  DrawerClose,
  DrawerPopup,
  DrawerTrigger,
} from "@/components/ui/bottom-sheet"

import { MobileCategoryNavbar } from "./components"

interface MobileNavbarProps {
  categories: HttpTypes.StoreProductCategory[]
  parentCategories: HttpTypes.StoreProductCategory[]
  isLoggedIn?: boolean
  user?: HttpTypes.StoreCustomer | null
}

type SectionKey = "account" | "categories" | "stores" | "filtered" | "farmer"

export const MobileNavbar = ({
  categories,
  parentCategories,
  isLoggedIn = false,
  user = null,
}: MobileNavbarProps) => {
  const accountType =
    (user?.metadata?.customer_type as string | undefined) === "business"
      ? "Business Account"
      : "Customer Account"
  const [openSection, setOpenSection] = useState<SectionKey | null>("categories")

  const toggleSection = useCallback((section: SectionKey) => {
    setOpenSection((current) => (current === section ? null : section))
  }, [])

  const isOpen = (section: SectionKey) => openSection === section

  return (
    <div className="lg:hidden" data-testid="mobile-navbar">
      <Drawer>
        <DrawerTrigger
          className="cursor-pointer"
          data-testid="mobile-menu-toggle"
        >
          <HamburgerMenuIcon />
        </DrawerTrigger>
        <DrawerPopup showBar>
          {/* Drawer Header */}
          <div
            className="flex items-center justify-between border-b p-4"
            data-testid="mobile-menu-header"
          >
            <h2 className="heading-md uppercase text-primary">Menu</h2>
            <DrawerClose className="label-md uppercase px-3 py-2 text-primary hover:bg-secondary/10 transition-colors rounded-lg">
              Close
            </DrawerClose>
          </div>

          {/* Drawer Content */}
          <div className="overflow-y-auto flex-1">
            {/* User Account Section */}
            <div className="border-b">
              <button
                onClick={() => toggleSection("account")}
                className="flex items-center justify-between w-full p-4 text-left"
              >
                <h3 className="label-large uppercase text-secondary">
                  Your Account
                </h3>
                <CollapseIcon
                  size={18}
                  className={cn(
                    "text-secondary transition-transform duration-200",
                    isOpen("account") ? "rotate-180" : ""
                  )}
                />
              </button>
              {isOpen("account") && (
                <div className="px-4 pb-4">
                  {isLoggedIn ? (
                    <nav className="flex flex-col gap-1">
                      <LocalizedClientLink
                        href="/user/orders"
                        className="label-md uppercase px-4 py-3 text-primary hover:bg-secondary/10 transition-colors"
                      >
                        Orders
                      </LocalizedClientLink>
                      <LocalizedClientLink
                        href="/user/messages"
                        className="label-md uppercase px-4 py-3 text-primary hover:bg-secondary/10 transition-colors"
                      >
                        Messages
                      </LocalizedClientLink>
                      <LocalizedClientLink
                        href="/user/returns"
                        className="label-md uppercase px-4 py-3 text-primary hover:bg-secondary/10 transition-colors"
                      >
                        Returns
                      </LocalizedClientLink>
                      <LocalizedClientLink
                        href="/user/addresses"
                        className="label-md uppercase px-4 py-3 text-primary hover:bg-secondary/10 transition-colors"
                      >
                        Addresses
                      </LocalizedClientLink>
                      <LocalizedClientLink
                        href="/user/wishlist"
                        className="label-md uppercase px-4 py-3 text-primary hover:bg-secondary/10 transition-colors"
                      >
                        Wishlist
                      </LocalizedClientLink>
                      <LocalizedClientLink
                        href="/user/settings"
                        className="label-md uppercase px-4 py-3 text-primary hover:bg-secondary/10 transition-colors"
                      >
                        Settings
                      </LocalizedClientLink>
                      <LogoutButton
                        className="label-md uppercase px-4 py-3 text-primary hover:bg-secondary/10 transition-colors w-full text-left"
                        unstyled
                      >
                        Logout
                      </LogoutButton>
                    </nav>
                  ) : (
                    <nav className="flex flex-col gap-1">
                      <LocalizedClientLink
                        href="/login"
                        className="label-md uppercase px-4 py-3 text-primary hover:bg-secondary/10 transition-colors"
                      >
                        Login
                      </LocalizedClientLink>
                      <LocalizedClientLink
                        href="/register"
                        className="label-md uppercase px-4 py-3 text-primary hover:bg-secondary/10 transition-colors"
                      >
                        Register
                      </LocalizedClientLink>
                    </nav>
                  )}
                </div>
              )}
            </div>

            {/* Product Categories Section */}
            <div className="border-b">
              <button
                onClick={() => toggleSection("categories")}
                className="flex items-center justify-between w-full p-4 text-left"
              >
                <h3 className="label-large uppercase text-secondary">
                  Product Categories
                </h3>
                <CollapseIcon
                  size={18}
                  className={cn(
                    "text-secondary transition-transform duration-200",
                    isOpen("categories") ? "rotate-180" : ""
                  )}
                />
              </button>
              {isOpen("categories") && (
                <div className="px-4 pb-4">
                  <LocalizedClientLink
                    href="/categories"
                    className="label-md uppercase px-4 py-3 text-primary hover:bg-secondary/10 transition-colors block"
                  >
                    All Products
                  </LocalizedClientLink>
                  <HeaderCategoryNavbar
                    categories={categories}
                    parentCategories={parentCategories}
                    layout="vertical"
                  />
                </div>
              )}
            </div>

            {/* Stores */}
            <div className="border-b">
              <button
                onClick={() => toggleSection("stores")}
                className="flex items-center justify-between w-full p-4 text-left"
              >
                <h3 className="label-large uppercase text-secondary">Stores</h3>
                <CollapseIcon
                  size={18}
                  className={cn(
                    "text-secondary transition-transform duration-200",
                    isOpen("stores") ? "rotate-180" : ""
                  )}
                />
              </button>
              {isOpen("stores") && (
                <div className="px-4 pb-4">
                  <nav className="flex flex-col gap-1" data-testid="mobile-menu-stores-nav">
                    {storeQuickNavItems.map(({ label, href }) => (
                      <LocalizedClientLink
                        key={href}
                        href={href}
                        className="label-md uppercase px-4 py-3 text-primary hover:bg-secondary/10 transition-colors"
                        data-testid={`mobile-menu-stores-link-${label.replace(/\s+/g, "-").toLowerCase()}`}
                      >
                        {label}
                      </LocalizedClientLink>
                    ))}
                  </nav>
                </div>
              )}
            </div>

            {/* Filtered Child Categories */}
            <div className="border-b">
              <button
                onClick={() => toggleSection("filtered")}
                className="flex items-center justify-between w-full p-4 text-left"
              >
                <h3 className="label-large uppercase text-secondary">
                  Subcategories
                </h3>
                <CollapseIcon
                  size={18}
                  className={cn(
                    "text-secondary transition-transform duration-200",
                    isOpen("filtered") ? "rotate-180" : ""
                  )}
                />
              </button>
              {isOpen("filtered") && (
                <div className="px-4 pb-4">
                  <MobileCategoryNavbar
                    categories={categories}
                    parentCategories={parentCategories}
                  />
                </div>
              )}
            </div>

            {/* Farmer Supplies Section */}
            <div className="border-b">
              <button
                onClick={() => toggleSection("farmer")}
                className="flex items-center justify-between w-full p-4 text-left"
              >
                <h3 className="label-large uppercase text-secondary">
                  Farmer Supplies
                </h3>
                <CollapseIcon
                  size={18}
                  className={cn(
                    "text-secondary transition-transform duration-200",
                    isOpen("farmer") ? "rotate-180" : ""
                  )}
                />
              </button>
              {isOpen("farmer") && (
                <div className="px-4 pb-4">
                  <nav className="flex flex-col gap-1">
                    <LocalizedClientLink
                      href="/categories"
                      className="label-md uppercase px-4 py-3 text-primary hover:bg-secondary/10 transition-colors"
                    >
                      All Supplies
                    </LocalizedClientLink>
                    {farmerNav.map((item) => (
                      <LocalizedClientLink
                        key={item.href}
                        href={item.href}
                        className="label-md uppercase px-4 py-3 text-primary hover:bg-secondary/10 transition-colors"
                      >
                        {item.label}
                      </LocalizedClientLink>
                    ))}
                  </nav>
                </div>
              )}
            </div>

            {/* Sell on Marketplace */}
            <div className="border-b">
              <a
                href={`${process.env.NEXT_PUBLIC_VENDOR_URL || "https://vendor.mercurjs.com"}/register`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-4 text-left"
              >
                <h3 className="label-large uppercase text-secondary">
                  Become a Seller
                </h3>
                <span className="label-small text-secondary bg-action/10 px-2 py-1 rounded-sm">
                  New
                </span>
              </a>
            </div>
          </div>

          {/* Sign-in status bar */}
          <div className="border-t p-4 bg-secondary/5" data-testid="mobile-menu-signin-bar">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <ProfileIcon size={18} className="text-primary" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="label-md text-primary truncate">
                    {user.first_name && user.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user.email}
                  </span>
                  <span className="label-small text-secondary">
                    {accountType}
                  </span>
                </div>
              </div>
            ) : (
              <LocalizedClientLink
                href="/login"
                className="flex items-center gap-3"
                data-testid="mobile-menu-signin-link"
              >
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <ProfileIcon size={18} className="text-primary" />
                </div>
                <span className="label-md text-primary">Sign In</span>
              </LocalizedClientLink>
            )}
          </div>
        </DrawerPopup>
      </Drawer>
    </div>
  )
}
