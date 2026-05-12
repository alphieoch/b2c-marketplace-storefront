import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink";
import { cn } from "@/lib/utils";
import { Highlight, SellerProps } from "@/types/seller";

const HIGHLIGHT_STYLES: Record<Highlight, { label: string; className: string }> = {
  best_pick: {
    label: "Best Pick",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
  },
  popular: {
    label: "Popular",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  },
  new: {
    label: "New",
    className: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  },
  organic: {
    label: "Organic",
    className: "bg-green-50 text-green-900 dark:bg-green-950/60 dark:text-green-100",
  },
  premium: {
    label: "Premium",
    className: "bg-black text-white dark:bg-white dark:text-black",
  },
};

export type StoreCardProps = {
  seller: SellerProps;
  highlights?: Highlight[];
};

export function StoreCard({ seller, highlights = [] }: StoreCardProps) {
  return (
    <article className="rounded-sm border p-5">
      <h2 className="heading-sm uppercase">{seller.name}</h2>
      <p className="label-sm mt-2 text-primary/70">
        {(seller.description || "Trusted marketplace store.")
          .replace(/<[^>]*>/g, "")
          .slice(0, 140)}
      </p>

      {Boolean(highlights.length) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {highlights.map((highlight) => (
            <span
              key={highlight}
              className={cn(
                "inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
                HIGHLIGHT_STYLES[highlight].className
              )}
            >
              {HIGHLIGHT_STYLES[highlight].label}
            </span>
          ))}
        </div>
      )}

      <LocalizedClientLink
        href={`/sellers/${seller.handle}`}
        className="label-md mt-4 inline-flex uppercase underline"
      >
        Visit store
      </LocalizedClientLink>
    </article>
  );
}
