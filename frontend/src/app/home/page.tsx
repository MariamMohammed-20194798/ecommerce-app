
import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"
import { FeaturedProducts } from "@/components/featured-products"

export default function HomeLandingPage() {
  return (
    <main className="w-full">
      <Hero />
      <FeaturedProducts />
      <Categories />
    </main>
  )
}

