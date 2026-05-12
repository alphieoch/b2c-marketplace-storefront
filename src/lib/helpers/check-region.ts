import { listRegions } from "../data/regions"

export const checkRegion = async (locale: string) => {
  try {
    const regions = await listRegions()
    const countries = (regions ?? [])
      .flatMap((r) => r.countries?.map((c) => c.iso_2) ?? [])
      .filter((c): c is string => Boolean(c))

    return countries.includes(locale)
  } catch {
    return false
  }
}
