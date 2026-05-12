import { Footer, Header } from "@/components/organisms"
import { checkRegion } from "@/lib/helpers/check-region"

export default async function ResetPasswordLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  const regionCheck = await checkRegion(locale)
  // Fail open when regions are unavailable to avoid redirect loops.
  void regionCheck

  return (
    <>
      <Header locale={locale} />
      {children}
      <Footer />
    </>
  )
}
