"use client"

import { Button, Chip, Input } from "@/components/atoms"
import { Accordion, FilterCheckboxOption, Modal } from "@/components/molecules"
import useFilters from "@/hooks/useFilters"
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams"
import { useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { ProductListingActiveFilters } from "../ProductListingActiveFilters/ProductListingActiveFilters"
import useGetAllSearchParams from "@/hooks/useGetAllSearchParams"

export type FacetModel = {
  count: number
  value: string
  label: string
}

import { Drawer, DrawerPopup, DrawerClose } from "@/components/ui/bottom-sheet"
import { CloseIcon } from "@/icons"

export const SearchProductSidebar = ({ facets }: { facets: Record<string, FacetModel[]> }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const { allSearchParams } = useGetAllSearchParams()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const filterContent = (
    <>
      <PriceFilter
        defaultOpen={Boolean(
          allSearchParams.min_price || allSearchParams.max_price
        )}
      />
      <CategoryFilter items={facets["categories.name"]} defaultOpen={Boolean(allSearchParams.category)} />
      <SellerFilter items={facets["seller.name"]} defaultOpen={Boolean(allSearchParams.seller)} />
      <RegionFilter
        items={facets["seller.country_code"]}
        defaultOpen={Boolean(allSearchParams.region)}
      />
      <FulfillmentFilter
        items={facets["seller.fulfillment_types"]}
        defaultOpen={Boolean(allSearchParams.fulfillment)}
      />
    </>
  )

  return isMobile ? (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full uppercase mb-4">
        Filters
      </Button>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerPopup direction="bottom">
          <div className="flex items-center justify-between px-4 pb-4 border-b">
            <h2 className="text-xl font-bold">Filters</h2>
            <DrawerClose className="p-2 -mr-2 rounded-full hover:bg-secondary/10 transition-colors">
              <CloseIcon size={20} />
            </DrawerClose>
          </div>
          <div className="px-4 overflow-y-auto flex-1 py-4">
            <ProductListingActiveFilters />
            {filterContent}
          </div>
        </DrawerPopup>
      </Drawer>
    </>
  ) : (
    <div className="w-full pr-4">
      {filterContent}
    </div>
  )
}

function CategoryFilter({ defaultOpen = true, items }: { defaultOpen?: boolean, items: FacetModel[]}) {
  const { updateFilters, isFilterActive } = useFilters("category")

  const selectHandler = (option: string) => {
    updateFilters(option)
  }
  return (
    <Accordion heading="Category" defaultOpen={defaultOpen}>
      <ul className="px-4">
        {items && Object.entries(items).map(([ label, count ]) => (
          <li key={label} className="mb-4">
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={Boolean(!count)}
              onCheck={selectHandler}
              label={label}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  )
}

function SellerFilter({ defaultOpen = true, items }: { defaultOpen?: boolean, items: FacetModel[] }) {
  const { updateFilters, isFilterActive } = useFilters("seller")

  const selectHandler = (option: string) => {
    updateFilters(option)
  }
  return (
    <Accordion heading="Seller" defaultOpen={defaultOpen}>
      <ul className="px-4">
        {items && Object.entries(items).map(([ label, count ]) => (
          <li key={label} className="mb-4">
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={Boolean(!count)}
              onCheck={selectHandler}
              label={label}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  )
}

function RegionFilter({ defaultOpen = true, items }: { defaultOpen?: boolean, items: FacetModel[] }) {
  const { updateFilters, isFilterActive } = useFilters("region")

  const selectHandler = (option: string) => {
    updateFilters(option)
  }

  return (
    <Accordion heading="Region" defaultOpen={defaultOpen}>
      <ul className="px-4">
        {items && Object.entries(items).map(([ label, count ]) => (
          <li key={label} className="mb-4">
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={Boolean(!count)}
              onCheck={selectHandler}
              label={label}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  )
}

function FulfillmentFilter({
  defaultOpen = true,
  items,
}: {
  defaultOpen?: boolean
  items: FacetModel[]
}) {
  const { updateFilters, isFilterActive } = useFilters("fulfillment")

  const selectHandler = (option: string) => {
    updateFilters(option)
  }

  const fallbackOptions = { delivery: 1, pickup: 1 }
  const options = items && Object.keys(items).length ? items : fallbackOptions

  return (
    <Accordion heading="Fulfillment" defaultOpen={defaultOpen}>
      <ul className="px-4">
        {options && Object.entries(options).map(([ label, count ]) => (
          <li key={label} className="mb-4">
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={Boolean(!count)}
              onCheck={selectHandler}
              label={label.charAt(0).toUpperCase() + label.slice(1)}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  )
}

function PriceFilter({ defaultOpen = true }: { defaultOpen?: boolean }) {
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")

  const updateSearchParams = useUpdateSearchParams()
  const searchParams = useSearchParams()

  useEffect(() => {
    setMin(searchParams.get("min_price") || "")
    setMax(searchParams.get("max_price") || "")
  }, [searchParams])

  const updateMinPriceHandler = (
    e: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>
  ) => {
    e.preventDefault()
    updateSearchParams("min_price", min)
  }

  const updateMaxPriceHandler = (
    e: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>
  ) => {
    e.preventDefault()
    updateSearchParams("max_price", max)
  }
  return (
    <Accordion heading="Price" defaultOpen={defaultOpen}>
      <div className="flex gap-2 mb-4">
        <form method="POST" onSubmit={updateMinPriceHandler}>
          <Input
            placeholder="Min"
            onChange={(e) => setMin(e.target.value)}
            value={min}
            onBlur={(e) => {
              setTimeout(() => {
                updateMinPriceHandler(e)
              }, 500)
            }}
            type="number"
            className="no-arrows-number-input"
          />
          <input type="submit" className="hidden" />
        </form>
        <form method="POST" onSubmit={updateMaxPriceHandler}>
          <Input
            placeholder="Max"
            onChange={(e) => setMax(e.target.value)}
            onBlur={(e) => {
              setTimeout(() => {
                updateMaxPriceHandler(e)
              }, 500)
            }}
            value={max}
            type="number"
            className="no-arrows-number-input"
          />
          <input type="submit" className="hidden" />
        </form>
      </div>
    </Accordion>
  )
}
