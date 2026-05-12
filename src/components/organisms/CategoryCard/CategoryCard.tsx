import type { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import Image from "next/image"

type CategoryCardCategory = {
  name: string
  handle: string
  imageSrc?: string
  metadata?: HttpTypes.StoreProductCategory["metadata"]
}

export function CategoryCard({ category }: { category: CategoryCardCategory }) {
  const metaImage =
    typeof category.metadata?.image_url === "string"
      ? category.metadata.image_url
      : undefined

  const src = category.imageSrc ?? metaImage ?? "/images/placeholder.svg"

  const isLocalSvg = src.startsWith("/") && src.endsWith(".svg")

  return (
    <LocalizedClientLink
      href={`/categories/${category.handle}`}
      className="relative flex flex-col items-center border rounded-sm bg-component transition-all hover:rounded-full w-[233px] aspect-square"
    >
      <div className="flex relative aspect-square overflow-hidden w-[200px]">
        <Image
          loading="lazy"
          src={src}
          alt={`category - ${category.name}`}
          width={200}
          height={200}
          sizes="(min-width: 1024px) 200px, 40vw"
          className="object-contain scale-90 rounded-full"
          unoptimized={isLocalSvg}
        />
      </div>
      <h3 className="w-full text-center label-lg text-primary">
        {category.name}
      </h3>
    </LocalizedClientLink>
  )
}
