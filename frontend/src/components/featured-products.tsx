"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"

type ProductVariant = {
  name?: string
  images?: string[]
}

type ProductItem = {
  id: string
  name: string
  basePrice: number
  slug?: string
  category?: { name?: string }
  variants?: ProductVariant[]
}

type ProductsResponse = {
  data?: ProductItem[]
}

const formatPrice = (priceInCents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(priceInCents / 100)

const getProductImage = (product: ProductItem) => {
  const variantImage = product.variants?.find((variant) => variant.images?.length)?.images?.[0]
  return variantImage || ''
}

const getProductName = (product: ProductItem) => {
  const variantName = product.variants?.find(
    (variant) => typeof variant.name === "string" && variant.name.trim().length > 0,
  )?.name
  return variantName ?? product.name
}

const getProductHref = (product: ProductItem) => {
  if (product.slug) {
    return `/products/${product.slug}`
  }
  return "/collections"
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<ProductItem[]>([])

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await api.get<ProductsResponse>("/products", {
          params: { sort: "newest", limit: 4 },
        })
        setProducts(response.data?.data ?? [])
      } catch (error) {
        console.error("Failed to load new arrivals:", error)
      }
    }

    void fetchNewArrivals()
  }, [])

  return (
    <section className="py-24 bg-background" id="new">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Curated Selection
          </p>
          <h2 className="text-3xl sm:text-4xl font-light text-foreground tracking-tight">
            New Arrivals
          </h2>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              {/* Product image */}
              <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-muted">
                <Image
                  src={getProductImage(product)}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Quick actions */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full h-10 w-10 bg-white/90 hover:bg-white"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                {/* Add to bag button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Button asChild className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90">
                    <Link href={getProductHref(product)}>Add to Bag</Link>
                  </Button>
                </div>
              </div>
              {/* Product info */}
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  {product.category?.name ?? "Uncategorized"}
                </p>
                <Link href={getProductHref(product)} className="inline-block">
                  <h3 className="text-base font-medium text-foreground group-hover:text-accent transition-colors">
                    {getProductName(product)}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-foreground">{formatPrice(product.basePrice)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-16">
          <Button asChild variant="outline" size="lg" className="rounded-none px-12">
            <Link href="/collections">View All New Arrivals</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
