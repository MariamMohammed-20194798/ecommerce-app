"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Eye, Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { formatPriceEgp } from "@/lib/products"

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
  const [isHovered, setIsHovered] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await api.get<ProductsResponse>("/products", {
          params: { sort: "newest" },
        })
        setProducts(response.data?.data ?? [])
      } catch (error) {
        console.error("Failed to load new arrivals:", error)
      }
    }

    void fetchNewArrivals()
  }, [])

  const updateScrollState = () => {
    const element = scrollerRef.current
    if (!element) {
      return
    }

    const maxScrollLeft = element.scrollWidth - element.clientWidth
    setCanScrollLeft(element.scrollLeft > 0)
    setCanScrollRight(element.scrollLeft < maxScrollLeft - 1)
  }

  const scrollByAmount = (direction: "left" | "right") => {
    const element = scrollerRef.current
    if (!element) {
      return
    }

    const distance = Math.max(element.clientWidth * 0.8, 260)
    element.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    updateScrollState()
    window.addEventListener("resize", updateScrollState)
    return () => window.removeEventListener("resize", updateScrollState)
  }, [products.length])

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

        <div
          className="group relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            ref={scrollerRef}
            onScroll={updateScrollState}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:gap-6"
          >
            {products.map((product) => (
              <div key={product.id} className="group/card w-[72%] shrink-0 snap-start cursor-pointer sm:w-[45%] lg:w-[24%]">
                <div className="relative group/image mb-4 aspect-[4/4] overflow-hidden rounded-[24px] bg-muted">
                  <Image
                    src={getProductImage(product)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 24vw"
                    className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/92 px-3 py-2 shadow-sm md:hidden">
                    <button
                      type="button"
                      aria-label="Quick add"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </button>
                    <Link
                      href="/wishlist"
                      aria-label="Add to wishlist"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground"
                    >
                      <Heart className="h-4 w-4" />
                    </Link>
                    <Link
                      href={getProductHref(product)}
                      aria-label="View product"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 hidden translate-y-full opacity-0 transition-all duration-300 md:block md:group-hover/image:translate-y-0 md:group-hover/image:opacity-100">
                      <Button
                        asChild
                        className="w-full rounded-full bg-white text-foreground hover:bg-white/95"
                      >
                      <Link href={getProductHref(product)}>Quick Add</Link>
                    </Button>
                  </div>
                </div>
                <div>
                  <Link href={getProductHref(product)} className="inline-block">
                    <h3 className="text-lg font-light tracking-wide text-foreground transition-colors">
                      {getProductName(product)}
                    </h3>
                  </Link>
                  <p className="mt-1 text-md text-foreground/50">{formatPriceEgp(product.basePrice)}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            aria-label="Scroll new arrivals left"
            className={`absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-foreground shadow-md transition md:flex ${
              canScrollLeft && isHovered ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            aria-label="Scroll new arrivals right"
            className={`absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-foreground shadow-md transition md:flex ${
              canScrollRight && isHovered ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-6 flex items-center justify-center gap-4 md:hidden">
            <button
              type="button"
              onClick={() => scrollByAmount("left")}
              aria-label="Previous new arrivals"
              disabled={!canScrollLeft}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/20 text-foreground disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              aria-label="Next new arrivals"
              disabled={!canScrollRight}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/40 text-foreground disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
