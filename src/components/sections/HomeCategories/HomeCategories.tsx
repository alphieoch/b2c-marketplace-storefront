import { Carousel } from "@/components/cells"
import { CategoryCard } from "@/components/organisms"

export const categories: {
  id: number
  name: string
  handle: string
  imageSrc: string
}[] = [
  {
    id: 1,
    name: "Produce",
    handle: "produce",
    imageSrc:
      "https://images.unsplash.com/photo-1540420773420-bd3362c9d999?w=400&h=400&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Dairy & Eggs",
    handle: "dairy-eggs",
    imageSrc:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Meat & Poultry",
    handle: "meat-poultry",
    imageSrc:
      "https://images.unsplash.com/photo-1604503468506-a399da69a440?w=400&h=400&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Pantry",
    handle: "pantry",
    imageSrc:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Plants & Seeds",
    handle: "plants-seeds",
    imageSrc:
      "https://images.unsplash.com/photo-1466692476869-aef1dfb1e735?w=400&h=400&fit=crop&q=80",
  },
]

export const HomeCategories = async ({ heading }: { heading: string }) => {
  return (
    <section className="bg-primary py-8 w-full">
      <div className="mb-6">
        <h2 className="heading-lg text-primary uppercase">{heading}</h2>
      </div>
      <Carousel
        items={categories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      />
    </section>
  )
}
