"use client"

import { Button } from "@/components/atoms"
import { useParams } from "next/navigation"

export const WorkOSLoginButton = () => {
  const params = useParams()
  const locale =
    typeof params?.locale === "string" ? params.locale : ""

  const handleLogin = async () => {
    try {
      const origin = window.location.origin
      const storefrontCallback =
        locale.length > 0
          ? `${origin}/${locale}/workos/callback`
          : `${origin}/workos/callback`

      const res = await fetch("/api/workos/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: storefrontCallback,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error("WorkOS login failed:", res.status, err)
        return
      }

      const { authorizationUrl } = await res.json()
      if (authorizationUrl) {
        window.location.href = authorizationUrl
      }
    } catch (err) {
      console.error("WorkOS login failed:", err)
    }
  }

  return (
    <Button
      variant="tonal"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleLogin}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Continue with WorkOS
    </Button>
  )
}
