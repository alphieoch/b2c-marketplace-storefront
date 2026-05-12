import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { type FarmerNavItem } from "@/data/farmer-nav"
import { cn } from "@/lib/utils"

type FarmerNavLinksProps = {
  items: FarmerNavItem[]
  /** `start` = toward the logo from the left column; `end` = toward the logo from the right column. */
  align: "start" | "end"
}

export const FarmerNavLinks = ({ items, align }: FarmerNavLinksProps) => {
  if (items.length === 0) {
    return null
  }

  return (
    <nav
      className={cn(
        "hidden lg:flex flex-1 min-w-0 max-w-full flex-nowrap items-center gap-2 xl:gap-4 overflow-x-auto overflow-y-visible scrollbar-hide",
        align === "start" && "justify-start",
        align === "end" && "justify-end"
      )}
      aria-label={
        align === "start"
          ? "Producer supplies"
          : "More producer supplies"
      }
    >
      {items.map((item) => (
        <LocalizedClientLink
          key={item.href}
          href={item.href}
          className="label-large uppercase text-primary hover:opacity-80 transition-opacity pb-2 font-semibold whitespace-nowrap shrink-0"
        >
          {item.label}
        </LocalizedClientLink>
      ))}
    </nav>
  )
}
