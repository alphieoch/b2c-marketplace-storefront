"use client"
import { Card } from "@/components/atoms"
import { CollapseIcon } from "@/icons"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

export const Accordion = ({
  children,
  heading,
  defaultOpen = true,
}: {
  children: React.ReactNode
  heading: string
  defaultOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [height, setHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (contentRef.current) {
        setHeight(contentRef.current.scrollHeight)
      }
    }, 100)
  }, [children])

  const openHandler = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="border-b py-2">
      <div
        onClick={openHandler}
        className="flex justify-between items-center cursor-pointer py-2 px-1"
      >
        <h4 className="label-lg font-bold">{heading}</h4>
        <CollapseIcon
          size={20}
          className={cn("transition-all duration-300", isOpen && "rotate-180")}
        />
      </div>
      <div
        className={cn("transition-all duration-300 overflow-hidden")}
        style={{
          maxHeight: isOpen ? `${height}px` : "0px",
          opacity: isOpen ? 1 : 0,
          transition: "max-height 0.3s ease-in-out, opacity 0.2s ease-in-out",
        }}
      >
        <div ref={contentRef} className="pt-2 pb-4">
          {children}
        </div>
      </div>
    </div>
  )
}
