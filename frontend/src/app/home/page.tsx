
import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"
import { FeaturedProducts } from "@/components/featured-products"
import { ExchangeRefunds } from "@/components/exchange-refunds"
import { Newsletter } from "@/components/newletter"

export default function HomeLandingPage() {
  return (
    <main className="w-full">
      <Hero />
      <FeaturedProducts />
      <Categories />
      <ExchangeRefunds />
      <Newsletter />
    </main>
  )
}

