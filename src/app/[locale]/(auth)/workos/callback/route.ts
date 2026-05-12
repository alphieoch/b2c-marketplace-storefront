import { NextRequest, NextResponse } from "next/server"

/**
 * OAuth return must set the JWT via a Route Handler — `cookies().set()` is not
 * allowed during Server Component render (would yield 500).
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ locale: string }> }
) {
  const { locale } = await context.params
  const token = request.nextUrl.searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  const target = new URL(`/${locale}/user`, request.url)
  const res = NextResponse.redirect(target)
  res.cookies.set("_medusa_jwt", token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
  return res
}
