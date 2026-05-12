"use client";

import React, { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button, Input } from "@/components/atoms";
import { Accordion, FilterCheckboxOption, Modal } from "@/components/molecules";
import useFilters from "@/hooks/useFilters";
import useGetAllSearchParams from "@/hooks/useGetAllSearchParams";
import { detectUserLocation } from "@/lib/geo";
import { Highlight, SellerProps } from "@/types/seller";

const HIGHLIGHT_OPTIONS: Array<{ value: Highlight; label: string }> = [
  { value: "best_pick", label: "Best Pick" },
  { value: "popular", label: "Popular" },
  { value: "new", label: "New" },
  { value: "organic", label: "Organic" },
  { value: "premium", label: "Premium" },
];

type StoreSidebarProps = {
  sellers: SellerProps[];
  specialties: Record<string, string[]>;
  highlights: Record<string, Highlight[]>;
};

function normalizeString(value?: string | null): string {
  return (value || "").trim().toLowerCase();
}

function getSellerCity(seller: SellerProps): string {
  return normalizeString(seller.address?.city || seller.city);
}

function getSellerCountry(seller: SellerProps): string {
  return normalizeString(seller.address?.country_code || seller.country_code);
}

export function StoreSidebar({
  sellers,
  specialties,
  highlights,
}: StoreSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { allSearchParams } = useGetAllSearchParams();

  const selectedRegions = useMemo(
    () =>
      (searchParams.get("region") || "")
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean),
    [searchParams]
  );

  const specialtyCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const seller of sellers) {
      const sellerSpecialties = specialties[seller.handle] || [];
      for (const specialty of sellerSpecialties) {
        map[specialty] = (map[specialty] || 0) + 1;
      }
    }
    return map;
  }, [sellers, specialties]);

  const highlightCounts = useMemo(() => {
    const map: Record<Highlight, number> = {
      best_pick: 0,
      popular: 0,
      new: 0,
      organic: 0,
      premium: 0,
    };

    for (const seller of sellers) {
      for (const highlight of highlights[seller.handle] || []) {
        map[highlight] += 1;
      }
    }

    return map;
  }, [highlights, sellers]);

  const countryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const seller of sellers) {
      const country = getSellerCountry(seller);
      if (!country) {
        continue;
      }
      map[country] = (map[country] || 0) + 1;
    }
    return map;
  }, [sellers]);

  const cityCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const seller of sellers) {
      const city = getSellerCity(seller);
      const country = getSellerCountry(seller);

      if (!city) {
        continue;
      }

      if (selectedRegions.length && !selectedRegions.includes(country)) {
        continue;
      }

      map[city] = (map[city] || 0) + 1;
    }
    return map;
  }, [sellers, selectedRegions]);

  const resolveNearMe = async () => {
    setIsLocating(true);
    setLocationError("");

    const location = await detectUserLocation();
    if (!location) {
      setLocationError("Unable to detect your location. Please select location filters.");
      setIsLocating(false);
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    if (location.countryCode) {
      nextParams.set("region", location.countryCode);
    } else {
      nextParams.delete("region");
    }

    if (location.city) {
      nextParams.set("city", location.city);
    } else {
      nextParams.delete("city");
    }

    router.push(`${pathname}?${nextParams.toString()}`, { scroll: false });
    setIsLocating(false);
    setIsOpen(false);
  };

  const content = (
    <div>
      <div className="mb-4">
        <Button
          onClick={resolveNearMe}
          className="w-full uppercase"
          disabled={isLocating}
        >
          {isLocating ? "Locating..." : "Use my location"}
        </Button>
        {locationError && <p className="label-sm mt-2 text-red-600">{locationError}</p>}
      </div>

      <HighlightFilter
        items={highlightCounts}
        defaultOpen={Boolean(allSearchParams.highlight)}
      />
      <SpecialtyFilter
        items={specialtyCounts}
        defaultOpen={Boolean(allSearchParams.specialty)}
      />
      <RegionFilter
        items={countryCounts}
        defaultOpen={Boolean(allSearchParams.region)}
      />
      <CityFilter items={cityCounts} defaultOpen={Boolean(allSearchParams.city)} />
    </div>
  );

  return (
    <>
      <div className="md:hidden mb-4">
        <Button onClick={() => setIsOpen(true)} className="w-full uppercase">
          Store Filters
        </Button>
        {isOpen && (
          <Modal heading="Store Filters" onClose={() => setIsOpen(false)}>
            <div className="px-4">{content}</div>
          </Modal>
        )}
      </div>
      <div className="hidden md:block">{content}</div>
    </>
  );
}

function HighlightFilter({
  defaultOpen = true,
  items,
}: {
  defaultOpen?: boolean;
  items: Record<Highlight, number>;
}) {
  const { updateFilters, isFilterActive } = useFilters("highlight");

  return (
    <Accordion heading="Highlights" defaultOpen={defaultOpen}>
      <ul className="px-4">
        {HIGHLIGHT_OPTIONS.map((option) => (
          <li key={option.value} className="mb-4">
            <FilterCheckboxOption
              label={option.label}
              amount={items[option.value]}
              checked={isFilterActive(option.value)}
              disabled={Boolean(!items[option.value])}
              onCheck={() => updateFilters(option.value)}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  );
}

function SpecialtyFilter({
  defaultOpen = true,
  items,
}: {
  defaultOpen?: boolean;
  items: Record<string, number>;
}) {
  const { updateFilters, isFilterActive } = useFilters("specialty");
  const sortedOptions = useMemo(
    () => Object.entries(items).sort(([a], [b]) => a.localeCompare(b)),
    [items]
  );

  return (
    <Accordion heading="Specialty" defaultOpen={defaultOpen}>
      <ul className="px-4">
        {sortedOptions.map(([label, count]) => (
          <li key={label} className="mb-4">
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={Boolean(!count)}
              onCheck={updateFilters}
              label={label}
              amount={count}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  );
}

function RegionFilter({
  defaultOpen = true,
  items,
}: {
  defaultOpen?: boolean;
  items: Record<string, number>;
}) {
  const [searchValue, setSearchValue] = useState("");
  const { updateFilters, isFilterActive } = useFilters("region");
  const sortedOptions = useMemo(
    () => Object.entries(items).sort(([a], [b]) => a.localeCompare(b)),
    [items]
  );
  const filteredOptions = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    if (!keyword) {
      return sortedOptions;
    }

    return sortedOptions.filter(([label]) =>
      label.toLowerCase().includes(keyword)
    );
  }, [sortedOptions, searchValue]);

  return (
    <Accordion heading="Country" defaultOpen={defaultOpen}>
      <div className="px-4 mb-4">
        <Input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Type country..."
          type="text"
        />
      </div>
      <ul className="px-4">
        {filteredOptions.map(([label, count]) => (
          <li key={label} className="mb-4">
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={Boolean(!count)}
              onCheck={updateFilters}
              label={label}
              amount={count}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  );
}

function CityFilter({
  defaultOpen = true,
  items,
}: {
  defaultOpen?: boolean;
  items: Record<string, number>;
}) {
  const [searchValue, setSearchValue] = useState("");
  const { updateFilters, isFilterActive } = useFilters("city");
  const sortedOptions = useMemo(
    () => Object.entries(items).sort(([a], [b]) => a.localeCompare(b)),
    [items]
  );
  const filteredOptions = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    if (!keyword) {
      return sortedOptions;
    }

    return sortedOptions.filter(([label]) =>
      label.toLowerCase().includes(keyword)
    );
  }, [sortedOptions, searchValue]);

  return (
    <Accordion heading="City" defaultOpen={defaultOpen}>
      <div className="px-4 mb-4">
        <Input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Type city or county..."
          type="text"
        />
      </div>
      <ul className="px-4">
        {filteredOptions.map(([label, count]) => (
          <li key={label} className="mb-4">
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={Boolean(!count)}
              onCheck={updateFilters}
              label={label}
              amount={count}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  );
}
