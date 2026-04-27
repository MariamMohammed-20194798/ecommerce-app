"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

import api from "@/lib/api"

type CategoryNode = {
  id?: string
  name: string
  description: string
  images: string[]
  slug?: string
  children?: CategoryNode[]
}

type CategoryCard = {
  key: string
  name: string
  description: string
  image: string
  href: string
}

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-")
}

function flattenSubcategories(nodes: CategoryNode[]): CategoryNode[] {
  return nodes.flatMap((node) => {
    if (node.children?.length) {
      return node.children
    }
    return []
  })
}

export function Categories() {
  const [categoriesTree, setCategoriesTree] = useState<CategoryNode[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      try {
        const response = await api.get<CategoryNode[]>("/categories/tree")
        if (!isMounted) return
        setCategoriesTree(response.data)
      } catch (error) {
        console.error("Failed to load categories section:", error)
      }
    }

    void loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const categoryCards = useMemo<CategoryCard[]>(() => {
    const subcategories = flattenSubcategories(categoriesTree)
    const sourceCategories = subcategories.length ? subcategories : categoriesTree

    return sourceCategories.slice(0, 10).map((category, index) => {
      const key = normalizeKey(category.slug ?? category.name)
      return {
        key: category.id ?? `${key}-${index}`,
        name: category.name,
        description: category.description,
        image: category.images[0],
        href: `/shop?category=${encodeURIComponent(category.name)}`,
      }
    })
  }, [categoriesTree])

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
    const distance = Math.max(element.clientWidth * 0.75, 240)
    element.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    updateScrollState()
    window.addEventListener("resize", updateScrollState)
    return () => window.removeEventListener("resize", updateScrollState)
  }, [categoryCards.length])

  return (
    <section className="bg-muted py-24" id="collections">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Explore
          </p>
          <h2 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            Shop by Category
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
            {categoryCards.map((category) => (
              <Link
                key={category.key}
                href={category.href}
                className="group/card relative aspect-[3/4] w-[72%] shrink-0 snap-start overflow-hidden rounded-[28px] sm:w-[46%] lg:w-[31%]"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/30 transition-colors duration-300 group-hover/card:bg-foreground/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                  <h3 className="mb-2 text-xl font-light tracking-wider sm:text-2xl">{category.name}</h3>
                  <p className="mb-4 line-clamp-2 text-center text-sm text-white/80">{category.description}</p>
                  <span className="inline-flex items-center text-xs uppercase tracking-[0.2em] opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            aria-label="Scroll categories left"
            className={`absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-foreground shadow-md transition md:flex ${
              canScrollLeft && isHovered ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            aria-label="Scroll categories right"
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
              aria-label="Previous categories"
              disabled={!canScrollLeft}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 text-foreground disabled:opacity-35"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              aria-label="Next categories"
              disabled={!canScrollRight}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 text-foreground disabled:opacity-35"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
