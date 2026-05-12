"use client"

import { useUnreads } from "@talkjs/react"

import { Badge, LogoutButton } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { useCartContext } from "@/components/providers"
import {
  Drawer,
  DrawerClose,
  DrawerPopup,
  DrawerTrigger,
} from "@/components/ui/bottom-sheet"
import type { Cart } from "@/types/cart"
import { CollapseIcon, ProfileIcon } from "@/icons"

const getItemCount = (cart: Cart | null) =>
  cart?.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0

type HubRowProps = {
  href: string
  label: string
  badge?: number
}

function HubRow({ href, label, badge }: HubRowProps) {
  return (
    <DrawerClose asChild>
      <LocalizedClientLink
        href={href}
        className="label-md uppercase px-4 py-3 text-primary hover:bg-secondary/10 transition-colors w-full flex items-center justify-between"
        data-testid={`header-mobile-hub-row-${href.replace(/^\//, "").replace(/\//g, "-") || "home"}`}
      >
        <span>{label}</span>
        {Boolean(badge) && (
          <Badge className="shrink-0 w-5 h-5 p-0 flex items-center justify-center text-[10px]">
            {badge}
          </Badge>
        )}
      </LocalizedClientLink>
    </DrawerClose>
  )
}

export const MobileHeaderHub = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const { cart } = useCartContext()
  const unreads = useUnreads()
  const cartCount = getItemCount(cart)
  const hasNotifications = Boolean(unreads?.length)

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-secondary bg-primary text-primary shadow-sm transition-all duration-300 hover:bg-secondary/10 active:bg-secondary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          aria-label="Open account and shopping cart menu"
          data-testid="header-mobile-hub-trigger"
        >
          <ProfileIcon
            size={20}
            className="transition-transform duration-300"
          />
          <CollapseIcon
            size={12}
            className="absolute -bottom-1.5 right-0 rounded-full bg-primary text-secondary transition-all duration-300"
          />
          {hasNotifications && (
            <span
              className={`absolute top-0 h-2.5 w-2.5 rounded-full bg-action ${
                cartCount > 0 ? "right-5" : "right-0.5"
              }`}
              aria-label="You have new notifications"
            />
          )}
          {cartCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center p-0 px-1 text-[10px]">
              {cartCount > 99 ? "99+" : cartCount}
            </Badge>
          )}
        </button>
      </DrawerTrigger>
      <DrawerPopup showBar>
        <div
          className="flex items-center justify-between border-b p-4"
          data-testid="header-mobile-hub-header"
        >
          <h2 className="heading-md uppercase text-primary">Account &amp; cart</h2>
          <DrawerClose className="label-md uppercase px-3 py-2 text-primary hover:bg-secondary/10 transition-colors rounded-lg">
            Close
          </DrawerClose>
        </div>

        <div className={`overflow-y-auto flex-1 ${!isLoggedIn ? "flex items-center" : ""}`}>
          <div className={`border-b w-full ${!isLoggedIn ? "my-auto" : ""}`}>
            <div className="px-4 pb-4 pt-2">
              {cartCount > 0 ? (
                <nav className="flex flex-col gap-1">
                  <HubRow
                    href="/cart"
                    label="Shopping cart"
                    badge={cartCount || undefined}
                  />
                  {isLoggedIn ? (
                    <HubRow
                      href="/user"
                      label="Your account"
                    />
                  ) : null}
                </nav>
              ) : (
                <div
                  className="relative overflow-hidden rounded-sm bg-secondary/5 p-4"
                  data-testid="header-mobile-hub-empty-cart-cta"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-40">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full px-6">
                        <div className="h-2 animate-pulse rounded-full bg-secondary/40" />
                        <div className="mx-auto mt-3 h-2 w-3/4 animate-pulse rounded-full bg-secondary/40 [animation-delay:120ms]" />
                      </div>
                    </div>
                  </div>
                  <div className="relative flex w-full min-h-[120px] flex-col items-center justify-center text-center">
                    <p className="label-md uppercase text-primary">Nothing in your cart</p>
                    <p className="label-sm mt-1 text-secondary">
                      Take a look and add items now.
                    </p>
                    <DrawerClose asChild>
                      <LocalizedClientLink
                        href="/categories"
                        className="mt-3 inline-flex items-center justify-center rounded-sm bg-primary px-3 py-2 label-sm uppercase text-action-on-primary hover:opacity-90 transition-opacity"
                        data-testid="header-mobile-hub-empty-cart-buy-now"
                      >
                        Buy now
                      </LocalizedClientLink>
                    </DrawerClose>
                  </div>
                </div>
              )}
            </div>
          </div>

            {isLoggedIn && (
              <div className="border-b">
                <div className="px-4 pb-4 pt-2">
                  <h3 className="label-large uppercase text-secondary px-4 py-3">
                    Your Account
                  </h3>
                  <nav className="flex flex-col gap-1">
                    <HubRow
                      href="/user/orders"
                      label="Orders"
                    />
                    <HubRow
                      href="/user/messages"
                      label="Messages"
                      badge={unreads?.length || undefined}
                    />
                    <HubRow
                      href="/user/returns"
                      label="Returns"
                    />
                    <HubRow
                      href="/user/addresses"
                      label="Addresses"
                    />
                    <HubRow
                      href="/user/reviews"
                      label="Reviews"
                    />
                    <HubRow
                      href="/user/wishlist"
                      label="Wishlist"
                    />
                    <HubRow
                      href="/user/settings"
                      label="Settings"
                    />
                    <LogoutButton
                      className="label-md uppercase px-4 py-3 text-primary hover:bg-secondary/10 transition-colors w-full text-left"
                      unstyled
                      data-testid="header-mobile-hub-logout"
                    >
                      Logout
                    </LogoutButton>
                  </nav>
                </div>
              </div>
            )}
          </div>

        <div className="border-t p-4 bg-secondary/5" data-testid="header-mobile-hub-signin-bar">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <ProfileIcon size={18} className="text-primary" />
                </div>
                <span className="label-md text-primary">Signed in</span>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <DrawerClose asChild>
                  <LocalizedClientLink
                    href="/login"
                    className="flex items-center gap-3"
                    data-testid="header-mobile-hub-signin-link"
                  >
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <ProfileIcon size={18} className="text-primary" />
                    </div>
                    <span className="label-md text-primary">Sign In</span>
                  </LocalizedClientLink>
                </DrawerClose>
                <DrawerClose asChild>
                  <LocalizedClientLink
                    href="/register"
                    className="label-md uppercase text-primary hover:bg-secondary/10 transition-colors px-3 py-2 rounded-sm"
                    data-testid="header-mobile-hub-register-link"
                  >
                    Register
                  </LocalizedClientLink>
                </DrawerClose>
              </div>
            )}
        </div>
      </DrawerPopup>
    </Drawer>
  )
}
