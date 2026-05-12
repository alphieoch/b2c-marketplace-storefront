export interface FarmerNavItem {
  label: string
  href: string
  /** Which side of the logo row these links sit on (desktop). */
  headerColumn: "start" | "end"
}

export const farmerNav: FarmerNavItem[] = [
  {
    label: "Farm Equipment",
    href: "/categories/machinery",
    headerColumn: "start",
  },
  {
    label: "Cattle & Livestock",
    href: "/categories/cattle-livestock",
    headerColumn: "end",
  },
  {
    label: "Agrovet Supplies",
    href: "/categories/farm-inputs",
    headerColumn: "end",
  },
]

export function farmerNavForHeaderColumn(
  column: FarmerNavItem["headerColumn"]
): FarmerNavItem[] {
  return farmerNav.filter((item) => item.headerColumn === column)
}
