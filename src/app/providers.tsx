"use client"

import { CartProvider } from "@/components/providers"
import { Cart } from "@/types/cart"
import { ThemeProvider } from "next-themes"
import type React from "react"

import { PropsWithChildren } from "react"

interface ProvidersProps extends PropsWithChildren {
  cart: Cart | null
}

export function Providers({ children, cart }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CartProvider cart={cart}>{children}</CartProvider>
    </ThemeProvider>
  )
}
