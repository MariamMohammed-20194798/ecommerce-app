
import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"
import { FeaturedProducts } from "@/components/featured-products"
import { Newsletter } from "@/components/newletter"

export default function HomeLandingPage() {
  return (
    <main className="w-full">
      <Hero />
      <FeaturedProducts />
      <Categories />
      <Newsletter />
    </main>
  )
}

