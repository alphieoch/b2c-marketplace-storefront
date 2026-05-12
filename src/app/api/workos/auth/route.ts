import { NextRequest, NextResponse } from "next/server"

const backend =
  process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

/**
 * Proxies WorkOS login initiation to Medusa so the browser uses same-origin
 * fetch (no CORS) and the server supplies MEDUSA_BACKEND_URL (not
 * NEXT_PUBLIC_*).
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 })
  }

  const payload = {
    ...body,
    redirectUri: `${backend.replace(/\/$/, "")}/workos/auth`,
  }

  try {
    const res = await fetch(`${backend.replace(/\/$/, "")}/workos/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = (await res.json().catch(() => ({}))) as Record<
      string,
      unknown
    >
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    console.error("[api/workos/auth] proxy error:", e)
    return NextResponse.json(
      { message: "Failed to reach Medusa backend" },
      { status: 502 }
    )
  }
}
