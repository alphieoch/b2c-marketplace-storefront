"use client"

import useEmblaCarousel from "embla-carousel-react"

import { Indicator } from "@/components/atoms"
import { ArrowLeftIcon, ArrowRightIcon } from "@/icons"
import { useCallback, useEffect, useState } from "react"
import { EmblaCarouselType } from "embla-carousel"
import tailwindConfig from "../../../../tailwind.config"

export const CustomCarousel = ({
  variant = "light",
  items,
  align = "start",
}: {
  variant?: "light" | "dark"
  items: React.ReactNode[]
  align?: "center" | "start" | "end"
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)

  const maxStep = items.length

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on("reInit", onSelect).on("select", onSelect)
  }, [emblaApi, onSelect])

  const changeSlideHandler = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const arrowColor = {
    light: tailwindConfig.theme.extend.colors.primary,
    dark: tailwindConfig.theme.extend.colors.tertiary,
  }

  return (
    <div className="embla relative w-full flex justify-center">
      <div
        className="embla__viewport overflow-hidden rounded-xs w-full xl:flex xl:justify-center"
        ref={emblaRef}
      >
        <div className="embla__container flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform">
          {items.map((slide, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                index === selectedIndex
                  ? "opacity-100 scale-100"
                  : "opacity-85 scale-[0.98]"
              }`}
            >
              {slide}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4 sm:hidden">
          <div className="w-1/2">
            <Indicator
              variant={variant}
              maxStep={maxStep}
              step={selectedIndex + 1}
            />
          </div>
          <div>
            <button
              onClick={() => changeSlideHandler(selectedIndex - 1)}
              aria-label="Previous slide"
              title="Previous slide"
            >
              <ArrowLeftIcon color={arrowColor[variant]} />
            </button>
            <button
              onClick={() => changeSlideHandler(selectedIndex + 1)}
              aria-label="Next slide"
              title="Next slide"
            >
              <ArrowRightIcon color={arrowColor[variant]} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
