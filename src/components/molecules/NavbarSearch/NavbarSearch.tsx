"use client"

import { Input } from "@/components/atoms"
import { SearchIcon } from "@/icons"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { redirect } from "next/navigation"
import clsx from "clsx"
import SuggestiveSearch from "@/components/ui/suggestive-search"

interface Props {
  className?: string
}

const FARM_SUGGESTIONS = [
  "Search organic tomatoes",
  "Search fresh milk",
  "Search farm eggs",
  "Search artisan cheese",
  "Search pasture-raised beef",
  "Search heirloom vegetables",
]

export const NavbarSearch = ({ className }: Props) => {
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("query") || "")

  const handleSearch = () => {
    if (search) {
      redirect(`/categories?query=${search}`)
    } else {
      redirect(`/categories`)
    }
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSearch()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <>
      {/* Desktop */}
      <form
        className={clsx("w-full hidden lg:block", className)}
        method="POST"
        onSubmit={submitHandler}
      >
        <Input
          icon={<SearchIcon />}
          onIconClick={handleSearch}
          iconAriaLabel="Search"
          placeholder="Search product"
          value={search}
          changeValue={setSearch}
          type="search"
        />
        <input type="submit" className="hidden" />
      </form>

      {/* Mobile */}
      <div className={clsx("w-full lg:hidden", className)}>
        <SuggestiveSearch
          suggestions={FARM_SUGGESTIONS}
          effect="typewriter"
          animateMode="infinite"
          onChange={setSearch}
          onKeyDown={handleKeyDown}
          showLeading
          Leading={() => <SearchIcon size={16} />}
          className="w-full"
        />
      </div>
    </>
  )
}
