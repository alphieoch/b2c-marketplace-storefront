import posthog from "posthog-js"

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN

if (token) {
  posthog.init(token, {
    // Use PostHog's origin directly. Same-origin `/ingest` + rewrites can still be
    // resolved under `/[locale]/` by the SDK in some cases, which yields 404 HTML.
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_API_HOST ?? "https://us.i.posthog.com",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST ?? "https://us.posthog.com",
    defaults: "2026-01-30",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  })
}
