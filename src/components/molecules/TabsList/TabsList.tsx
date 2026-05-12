import { TabsTrigger } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export const TabsList = ({
  list,
  activeTab,
  "data-testid": dataTestId,
}: {
  list: { label: string; link: string }[]
  activeTab: string
  "data-testid"?: string
}) => {
  return (
    <div
      className="flex gap-3 sm:gap-4 w-full overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
      data-testid={dataTestId ?? 'tabs-list'}
    >
      {list.map(({ label, link }) => (
        <LocalizedClientLink key={label} href={link} className="shrink-0">
          <TabsTrigger isActive={activeTab === label.toLowerCase()}>
            {label}
          </TabsTrigger>
        </LocalizedClientLink>
      ))}
    </div>
  )
}
