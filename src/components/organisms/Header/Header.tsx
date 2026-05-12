import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

import { CartDropdown, MobileNavbar, Navbar } from "@/components/cells"
import { HeartIcon } from "@/icons"
import { UserDropdown } from "@/components/cells/UserDropdown/UserDropdown"
import { Wishlist } from "@/types/wishlist"
import { Badge } from "@/components/atoms"
import CountrySelector from "@/components/molecules/CountrySelector/CountrySelector"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { MessageButton } from "@/components/molecules/MessageButton/MessageButton"
import { NavbarSearch } from "@/components/molecules"
import { MobileHeaderHub } from "@/components/molecules/MobileHeaderHub/MobileHeaderHub"
import { listCategories } from "@/lib/data/categories"
import { listRegions } from "@/lib/data/regions"
import { getUserWishlists } from "@/lib/data/wishlist"
import { retrieveCustomer } from "@/lib/data/customer"

export const Header = async ({ locale }: { locale: string }) => {
  const user = await retrieveCustomer().catch(() => null)
  const isLoggedIn = Boolean(user)

  let wishlist: Wishlist = { products: [] }
  if (user) {
    wishlist = await getUserWishlists({ countryCode: locale })
  }

  const regions = await listRegions()
  const wishlistCount = wishlist?.products.length || 0

  const { categories, parentCategories } = (await listCategories({ query: { include_ancestors_tree: true } })) as {
    categories: HttpTypes.StoreProductCategory[]
    parentCategories: HttpTypes.StoreProductCategory[]
  }

  return (
    <header data-testid="header">
      {/* Mobile header */}
      <div className="flex lg:hidden items-center justify-between py-2 px-4 w-full" data-testid="header-top-mobile">
        <MobileNavbar
          parentCategories={parentCategories}
          categories={categories}
          isLoggedIn={isLoggedIn}
          user={user}
        />
        <LocalizedClientLink href="/" className="text-2xl font-bold" data-testid="header-logo-link">
          <Image
            src="/Logo.svg"
            width={126}
            height={40}
            alt="Logo"
            priority
          />
        </LocalizedClientLink>
        <MobileHeaderHub isLoggedIn={isLoggedIn} />
      </div>

      {/* Desktop header */}
      <div className="hidden lg:flex items-center justify-between py-2 px-8 w-full gap-6" data-testid="header-top-desktop">
        <div className="flex-shrink-0">
          <LocalizedClientLink href="/" className="text-2xl font-bold" data-testid="header-logo-link">
            <Image
              src="/Logo.svg"
              width={126}
              height={40}
              alt="Logo"
              priority
            />
          </LocalizedClientLink>
        </div>
        <div className="flex-1 max-w-xl mx-4">
          <NavbarSearch />
        </div>
        <div className="flex items-center gap-3 shrink-0" data-testid="header-actions">
          <CountrySelector regions={regions} />
          {isLoggedIn && <MessageButton />}
          <UserDropdown isLoggedIn={isLoggedIn} />
          {isLoggedIn && (
            <LocalizedClientLink href="/user/wishlist" className="relative" data-testid="header-wishlist-link">
              <HeartIcon size={20} />
              {Boolean(wishlistCount) && (
                <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0" data-testid="wishlist-count-badge">
                  {wishlistCount}
                </Badge>
              )}
            </LocalizedClientLink>
          )}
          <CartDropdown />
        </div>
      </div>

      <Navbar categories={categories} parentCategories={parentCategories} />
    </header>
  )
}
