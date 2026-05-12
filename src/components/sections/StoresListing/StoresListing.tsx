"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { StoreCard } from "@/components/cells/StoreCard/StoreCard";
import { ProductListingActiveFilters } from "@/components/organisms";
import { StoreSidebar } from "@/components/organisms/StoreSidebar/StoreSidebar";
import { Highlight, SellerProps } from "@/types/seller";

type StoresListingProps = {
  sellers: SellerProps[];
  specialties: Record<string, string[]>;
  highlights: Record<string, Highlight[]>;
};

function normalize(value?: string | null): string {
  return (value || "").trim().toLowerCase();
}

function parseMultiValue(searchValue: string | null): string[] {
  return (searchValue || "")
    .split(",")
    .map((value) => normalize(value))
    .filter(Boolean);
}

function getSellerCountry(seller: SellerProps): string {
  return normalize(seller.address?.country_code || seller.country_code);
}

function getSellerCity(seller: SellerProps): string {
  return normalize(seller.address?.city || seller.city);
}

export function StoresListing({
  sellers,
  specialties,
  highlights,
}: StoresListingProps) {
  const searchParams = useSearchParams();

  const filteredSellers = useMemo(() => {
    const highlightFilters = parseMultiValue(searchParams.get("highlight"));
    const specialtyFilters = parseMultiValue(searchParams.get("specialty"));
    const regionFilters = parseMultiValue(searchParams.get("region"));
    const cityFilters = parseMultiValue(searchParams.get("city"));

    return sellers.filter((seller) => {
      const sellerHighlights = (highlights[seller.handle] || []).map((value) =>
        normalize(value)
      );
      const sellerSpecialties = (specialties[seller.handle] || []).map((value) =>
        normalize(value)
      );
      const sellerCountry = getSellerCountry(seller);
      const sellerCity = getSellerCity(seller);

      if (
        highlightFilters.length &&
        !highlightFilters.some((highlight) => sellerHighlights.includes(highlight))
      ) {
        return false;
      }

      if (
        specialtyFilters.length &&
        !specialtyFilters.some((specialty) => sellerSpecialties.includes(specialty))
      ) {
        return false;
      }

      if (regionFilters.length && !regionFilters.includes(sellerCountry)) {
        return false;
      }

      if (cityFilters.length && !cityFilters.includes(sellerCity)) {
        return false;
      }

      return true;
    });
  }, [sellers, highlights, specialties, searchParams]);

  return (
    <div className="mt-6 min-h-[70vh] flex flex-col">
      <div className="my-4 label-md">{`${filteredSellers.length} stores`}</div>

      <div className="shrink-0">
        <ProductListingActiveFilters />
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0 mt-2">
        <div className="w-full flex flex-col flex-1 min-h-0">
          {filteredSellers.length === 0 ? (
            <div className="rounded-sm border p-6">
              <p className="label-md text-primary/70">
                No stores match your filters yet. Try clearing one or more filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSellers.map((seller) => (
                <StoreCard
                  key={seller.id}
                  seller={seller}
                  highlights={highlights[seller.handle] || []}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="w-full md:w-[280px] md:flex-shrink-0">
          <StoreSidebar
            sellers={sellers}
            specialties={specialties}
            highlights={highlights}
          />
        </aside>
      </div>
    </div>
  );
}
