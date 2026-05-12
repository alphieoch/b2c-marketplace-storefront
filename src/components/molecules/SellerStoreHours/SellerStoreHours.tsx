import { getSellerStoreHoursDisplay } from "@/lib/seller-store-hours";
import { SellerProps } from "@/types/seller";
import { cn } from "@/lib/utils";

type SellerStoreHoursProps = {
  seller: SellerProps;
  className?: string;
};

export function SellerStoreHours({ seller, className }: SellerStoreHoursProps) {
  const hoursLine = getSellerStoreHoursDisplay(seller.metadata ?? undefined);

  return (
    <div
      className={cn(
        "border-b border-neutral-200 px-5 py-5 dark:border-neutral-800",
        className
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4 sm:gap-y-1">
        <span className="inline-flex w-fit shrink-0 items-center rounded-sm border border-neutral-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary dark:border-neutral-700">
          Open · Accepting orders
        </span>
        {hoursLine ? (
          <p className="label-sm text-secondary">
            <span className="font-medium text-primary">Active hours:</span>{" "}
            {hoursLine}
          </p>
        ) : (
          <p className="label-sm text-secondary">
            Typical hours aren&apos;t listed — contact the store for pickup and delivery windows.
          </p>
        )}
      </div>
    </div>
  );
}
